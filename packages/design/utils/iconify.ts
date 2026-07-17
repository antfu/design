/**
 * Runtime Iconify SVG fetcher, backing the `DisplayIconifyRemoteIcon` component.
 *
 * Unlike `utils/icon.ts` (which resolves to static, build-time UnoCSS classes
 * from an installed `@iconify-json/*` collection), this fetches the raw SVG
 * markup from the public `api.iconify.design` CDN at runtime — so any
 * `collection:icon` pair works without installing its icon set, at the cost of
 * a network round-trip and needing to sanitize untrusted SVG markup.
 */

import createDOMPurify from 'dompurify'

const iconifySvgCache = new Map<string, Promise<string> | string>()

const purify = createDOMPurify()

/**
 * Fetch (and cache) the sanitized SVG markup for an Iconify `collection:icon` pair.
 *
 * Results are cached in-memory per `collection:icon` id so repeated renders of
 * the same icon don't re-fetch; a failed fetch is not cached, so a later call
 * can retry.
 *
 * @param collection - Iconify collection id, e.g. `catppuccin`.
 * @param icon - Icon name within the collection, e.g. `vue`.
 * @returns The sanitized SVG markup string.
 *
 * @example
 * await getIconifySvg('catppuccin', 'vue') // → '<svg ...>...</svg>'
 */
export async function getIconifySvg(collection: string, icon: string): Promise<string> {
  const id = `${collection}:${icon}`
  if (iconifySvgCache.has(id))
    return iconifySvgCache.get(id)!

  const promise = fetchAndSanitize()
    .then((svg) => {
      iconifySvgCache.set(id, svg)
      return svg
    })
    .catch((err) => {
      // Don't cache failures — drop the entry so a later render can retry.
      iconifySvgCache.delete(id)
      throw err
    })
  iconifySvgCache.set(id, promise)
  return promise

  async function fetchAndSanitize(): Promise<string> {
    const url = `https://api.iconify.design/${collection}/${icon}.svg?color=currentColor&width=100%`
    const svg = await fetch(url).then(res => res.text())
    return purify.sanitize(svg)
  }
}
