import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import repositoryLinks from './plugins/repository-links.mjs';

export default defineConfig({
  markdown: {
    processor: unified({ rehypePlugins: [repositoryLinks] }),
  },
});
