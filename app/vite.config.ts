import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Production builds for GitHub Pages use base /vstd/. Dev stays at /.
// Set GITHUB_PAGES=1 in CI; npm run dev keeps default base.
const isPagesBuild = process.env.GITHUB_PAGES === '1'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: isPagesBuild ? '/vstd/' : '/',
  css: {
    transformer: 'postcss',
    modules: {
      localsConvention: 'camelCase',
    },
  },
})
