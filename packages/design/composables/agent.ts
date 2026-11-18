/**
 * Agent bridge: let an AI agent read and drive the UI through component APIs
 * instead of screenshots or accessibility-tree clicking.
 *
 * Create one bridge and install it with `app.use(agent)`, or scope it to a
 * subtree with `provideAgent(agent)`. Instrumented form controls and
 * `LayoutTabs` then register themselves. `snapshot()` lists their state and
 * actions, and `act()` runs actions through the same `v-model` path a user's
 * input takes.
 * Without an installed bridge, the components skip registration entirely.
 *
 * While an action runs, {@link getChangeSource} returns `'agent'`, so an
 * `@update:modelValue` handler can tell agent changes from user changes.
 *
 * @example
 * const agent = createAgent({ allow: step => step.action !== 'clear' })
 * app.use(agent)
 * agent.snapshot()
 * // [{ ref: 'c1', component: 'text-input', label: 'Project name', value: 'Apollo', actions: ['setValue', 'clear'] }]
 * await agent.act({ steps: [{ ref: 'Project name', action: 'setValue', args: ['Atlas'] }] })
 */
import type { App, InjectionKey } from 'vue'
import { getCurrentInstance, inject, nextTick, onBeforeUnmount, onMounted, provide } from 'vue'

/** One control as an agent sees it. */
export interface AgentControlSnapshot {
  /** Stable id for this mount, e.g. `c3`. */
  ref: string
  /** Control kind, e.g. `text-input`, `switch`, `select`. */
  component: string
  label?: string
  value: unknown
  disabled?: boolean
  /** Allowed values, for controls that pick from a list. */
  options?: unknown[]
  actions: string[]
}

export interface AgentStep {
  /** A control `ref` or its exact `label`. */
  ref: string
  action: string
  args?: unknown[]
}

export interface AgentStepResult {
  step: AgentStep
  ok: boolean
  error?: string
}

export interface AgentActResult {
  results: AgentStepResult[]
  /** The state after all steps ran. */
  snapshot: AgentControlSnapshot[]
}

export interface AgentBridgeOptions {
  /** Approve or reject each step before it runs. Defaults to allowing all. */
  allow?: (step: AgentStep, control: AgentControlSnapshot) => boolean | Promise<boolean>
}

/** A tool shape that works for WebMCP (`navigator.modelContext`) or any agent SDK. */
export interface AgentTool {
  name: string
  description: string
  inputSchema: Record<string, unknown>
  execute: (input: any) => Promise<unknown>
}

export interface AgentBridge {
  snapshot: () => AgentControlSnapshot[]
  /** Run steps in order. Stops at the first failed step. */
  act: (input: { steps: AgentStep[] }) => Promise<AgentActResult>
  /** `snapshot` and `act` as tool definitions. */
  tools: () => AgentTool[]
  /** Vue plugin hook, so `app.use(bridge)` works. */
  install: (app: App) => void
}

/** What a component passes to {@link useAgentControl}. */
export interface AgentControlDefinition {
  component: string
  label?: () => string | undefined
  value: () => unknown
  disabled?: () => boolean | undefined
  options?: () => unknown[] | undefined
  actions: Record<string, (...args: any[]) => void>
}

interface Registry {
  register: (def: AgentControlDefinition) => () => void
}

const AgentKey: InjectionKey<Registry> = Symbol('antfu-design-agent')
const registries = new WeakMap<AgentBridge, Registry>()
const FieldLabelKey: InjectionKey<() => string | undefined> = Symbol('antfu-design-field-label')

let source: 'agent' | 'user' = 'user'

/**
 * Who caused the change being handled right now. Read it synchronously inside
 * an `@update:modelValue` (or watcher with `flush: 'sync'`) handler.
 */
export function getChangeSource(): 'agent' | 'user' {
  return source
}

export function createAgent(options: AgentBridgeOptions = {}): AgentBridge {
  const controls = new Map<string, AgentControlDefinition>()
  let counter = 0

  const registry: Registry = {
    register(def) {
      const ref = `c${++counter}`
      controls.set(ref, def)
      return () => controls.delete(ref)
    },
  }

  function describe(ref: string, def: AgentControlDefinition): AgentControlSnapshot {
    const snap: AgentControlSnapshot = {
      ref,
      component: def.component,
      label: def.label?.(),
      value: def.value(),
      actions: Object.keys(def.actions),
    }
    if (def.disabled?.())
      snap.disabled = true
    const opts = def.options?.()
    if (opts)
      snap.options = opts
    return snap
  }

  function snapshot(): AgentControlSnapshot[] {
    return [...controls].map(([ref, def]) => describe(ref, def))
  }

  function resolve(target: string): [string, AgentControlDefinition] {
    const byRef = controls.get(target)
    if (byRef)
      return [target, byRef]
    const matches = [...controls].filter(([, def]) => def.label?.() === target)
    if (matches.length === 1)
      return matches[0]!
    throw new Error(matches.length ? `Label "${target}" matches ${matches.length} controls; use a ref` : `No control "${target}"`)
  }

  async function runStep(step: AgentStep): Promise<void> {
    const [ref, def] = resolve(step.ref)
    const snap = describe(ref, def)
    if (snap.disabled)
      throw new Error(`Control "${step.ref}" is disabled`)
    const action = def.actions[step.action]
    if (!action)
      throw new Error(`Unknown action "${step.action}"; available: ${snap.actions.join(', ')}`)
    if (options.allow && !(await options.allow(step, snap)))
      throw new Error('Rejected by allow()')
    source = 'agent'
    try {
      action(...(step.args ?? []))
    }
    finally {
      source = 'user'
    }
    await nextTick()
  }

  async function act({ steps }: { steps: AgentStep[] }): Promise<AgentActResult> {
    const results: AgentStepResult[] = []
    for (const step of steps) {
      try {
        await runStep(step)
        results.push({ step, ok: true })
      }
      catch (error) {
        results.push({ step, ok: false, error: (error as Error).message })
        break
      }
    }
    return { results, snapshot: snapshot() }
  }

  const stepSchema = {
    type: 'object',
    properties: {
      ref: { type: 'string', description: 'Control ref (e.g. "c1") or exact label' },
      action: { type: 'string' },
      args: { type: 'array' },
    },
    required: ['ref', 'action'],
  }

  const bridge: AgentBridge = {
    snapshot,
    act,
    tools: () => [
      {
        name: 'ui_snapshot',
        description: 'List the UI controls on the page with their label, value, options, and available actions.',
        inputSchema: { type: 'object', properties: {} },
        execute: async () => snapshot(),
      },
      {
        name: 'ui_act',
        description: 'Run actions on UI controls in order. Returns per-step results and the new snapshot.',
        inputSchema: { type: 'object', properties: { steps: { type: 'array', items: stepSchema } }, required: ['steps'] },
        execute: input => act(input),
      },
    ],
    install(app) {
      app.provide(AgentKey, registry)
    },
  }
  registries.set(bridge, registry)
  return bridge
}

/** Scope a bridge to the calling component's subtree instead of the whole app. */
export function provideAgent(agent: AgentBridge): void {
  provide(AgentKey, registries.get(agent)!)
}

/**
 * Register the calling component with the installed agent bridge, if any.
 * A no-op when no bridge is installed.
 */
export function useAgentControl(def: AgentControlDefinition): void {
  const registry = inject(AgentKey, null)
  if (!registry)
    return
  const instance = getCurrentInstance()
  const fieldLabel = inject(FieldLabelKey, null)
  const label = (): string | undefined =>
    def.label?.()
    || (instance?.attrs['aria-label'] as string | undefined)
    || fieldLabel?.()
    || (instance?.props.placeholder as string | undefined)
    || undefined

  let unregister: (() => void) | undefined
  onMounted(() => {
    unregister = registry.register({ ...def, label })
  })
  onBeforeUnmount(() => unregister?.())
}

/**
 * Throw unless `value` is one of `allowed`. For pick-from-a-list actions, so an
 * agent can't set a value the user couldn't pick.
 */
export function assertAgentOption(allowed: unknown[], value: unknown): void {
  if (!allowed.includes(value))
    throw new Error(`${JSON.stringify(value)} is not one of: ${allowed.map(v => JSON.stringify(v)).join(', ')}`)
}

/** Lets `FormField` name the control it wraps. */
export function provideAgentFieldLabel(label: () => string | undefined): void {
  provide(FieldLabelKey, label)
}
