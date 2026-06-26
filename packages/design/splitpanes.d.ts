/**
 * Opt-in fallback types for `splitpanes` — for consumers whose installed
 * `splitpanes` predates bundled TypeScript types (v4.1.2+ ships its own, so you
 * usually don't need this).
 *
 * It is deliberately NOT part of this package's own `tsconfig` (which would
 * duplicate-declare against the real types). Consumers on an older splitpanes
 * can opt in by adding to a `.d.ts` in their project:
 *
 * ```ts
 * /// <reference types="@antfu/design/splitpanes.d.ts" />
 * ```
 */
declare module 'splitpanes' {
  import type { DefineComponent } from 'vue'

  export interface PaneData {
    min: number
    max: number
    size: number
  }

  export interface Pane {
    id: number
    el: HTMLElement | null
    min: number
    max: number
    givenSize: number | null
    size: number
    index: number
  }

  export interface SplitpanesReadyPayload {
    panes: PaneData[]
  }

  export interface SplitpanesResizePayload {
    event: MouseEvent | TouchEvent
    index: number
    prevPane: Pane | undefined
    nextPane: Pane | undefined
    panes: PaneData[]
  }

  /** `resized` fires on splitter drag-end AND after pane add/remove (latter omit event/index). */
  export interface SplitpanesResizedPayload {
    event?: MouseEvent | TouchEvent
    index?: number
    prevPane?: Pane
    nextPane?: Pane
    panes: PaneData[]
  }

  export interface SplitpanesProps {
    horizontal?: boolean
    pushOtherPanes?: boolean
    maximizePanes?: boolean
    rtl?: boolean
    firstSplitter?: boolean
  }

  export interface PaneProps {
    size?: number | string
    minSize?: number | string
    maxSize?: number | string
  }

  export const Splitpanes: DefineComponent<SplitpanesProps>
  export const Pane: DefineComponent<PaneProps>
}
