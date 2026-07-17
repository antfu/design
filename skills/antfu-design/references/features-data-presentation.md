# Presenting data

Devtools UIs are mostly *data*. Reach for a display component before raw text —
they encode the formatting + severity decisions consistently.

| You have… | Use | Notes |
|---|---|---|
| a count / quantity | `DisplayNumber` / `DisplayNumberBadge` | `Intl` formatting, mono + tabular, prefix/suffix |
| a byte size | `DisplayBytes` | `base` 1024/1000, `colorize`, percent of `total` |
| an elapsed time | `DisplayDuration` | ms → human, `colorize` (fast=neutral … slow=critical) |
| a timestamp | `DisplayDate` | relative + exact tooltip, `colorize` by age, `live` |
| a module / file path | `DisplayFilePath` | truncates, dims directories, decodes `.pnpm` → `~`, icon |
| a package name | `DisplayPackageName` | scope colored by hash |
| a version | `DisplayVersion` | `vX.Y.Z` prefix logic |
| a proportion | `DisplayProportionBar` / `DisplayDonut` | stacked % bar / progress ring |
| a status / health | `DisplayBadge` | a palette/hue color for the status (`variant="solid"` for emphasis) |
| a long list | `LayoutVirtualList` / `LayoutExpandableList` | virtualize, or "show N more" with a fade |

## Rules of thumb

- **Colorize by meaning, once.** Turn on `colorize` for the one dimension that
  carries signal (e.g. staleness in a list of dates); don't rainbow everything.
- **Right-align numeric columns** and keep them `tabular-nums` so they scan.
- **Truncate paths, never wrap them.** `DisplayFilePath` keeps the basename legible and
  exposes the full path on hover.
- **Hash colors for identity, palette colors for category.** A package name gets
  a stable hash color; a known type (esm/cjs) gets a fixed `badge-color-*`.
