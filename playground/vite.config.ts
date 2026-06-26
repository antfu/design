import Vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [Vue(), Unocss()],
  // `@antfu/design` ships raw `.ts`/`.vue`; let plugin-vue transform them
  // instead of esbuild pre-bundling.
  optimizeDeps: { exclude: ['@antfu/design'] },
})
