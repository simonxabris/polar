import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import stylex from '@stylexjs/unplugin'

const config = defineConfig({
  resolve: { tsconfigPaths: true, dedupe: ['react', 'react-dom'] },
  ssr: {
    // posthog-js ships a UMD build for posthog-js/react that resolves a
    // second React copy when externalized; bundle it for SSR instead.
    noExternal: ['posthog-js'],
  },
  plugins: [
    devtools(),
    nitro({ rollupConfig: { external: [/^@sentry\//] } }),
    stylex.vite({
      devPersistToDisk: true,
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
