import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
export default defineConfig({ site: 'https://aviniy.github.io', base: '/', integrations: [sitemap()], markdown: { shikiConfig: { themes: { light: 'catppuccin-latte', dark: 'catppuccin-mocha' } } } });
