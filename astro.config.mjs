import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { mathMarkdown } from './src/lib/math-markdown.js';

export default defineConfig({
  site: 'https://aviniy.github.io',
  base: '/',
  integrations: [sitemap()],
  markdown: {
    processor: satteri({
      // Writeups contain shell variables; reserve double dollars for math.
      features: { math: { singleDollarTextMath: false } },
      mdastPlugins: [mathMarkdown],
    }),
    shikiConfig: { themes: { light: 'catppuccin-latte', dark: 'catppuccin-mocha' } },
  },
});
