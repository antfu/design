# Agent notes

Project-specific conventions for `@antfu/design` (the workbench-global rules
still apply).

## Components & stories

- Each component lives in `packages/design/components/<Category>/` and is prefixed
  by its category (`DisplayBadge`, `OverlayModal`, …), with a co-located
  `*.stories.ts`. Keep styling token-driven (no hard-coded colors) and reka-ui for
  overlay behavior.

## Keep the Storybook Overview up to date

- The single **Overview** page (`packages/design/components/Overview.mdx`) lists
  every component with a linked title + a `<Canvas>` per variation. It is
  **generated**, not hand-edited.
- Whenever you **add/remove a component or a story export**, regenerate it:
  ```sh
  pnpm -F @antfu/design run docs:overview
  ```
  then commit the updated `Overview.mdx`. New categories must be added to the
  `cats` array in `scripts/gen-overview.mjs`.
