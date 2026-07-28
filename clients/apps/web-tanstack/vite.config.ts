import mdx from '@mdx-js/rollup'
import stylex from '@stylexjs/unplugin'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import rehypeSlug from 'rehype-slug'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import { defineConfig } from 'vite'

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
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [remarkFrontmatter, remarkGfm],
        rehypePlugins: [rehypeSlug],
      }),
    },
    tanstackStart(),
    viteReact({ include: /\.(js|jsx|mdx|ts|tsx)$/ }),
  ],
})

export default config
