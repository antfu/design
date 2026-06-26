// Allow side-effect CSS imports inside components (e.g. splitpanes base CSS).
// `.vue` files are handled natively by vue-tsc, so no `*.vue` shim here.
declare module '*.css'
