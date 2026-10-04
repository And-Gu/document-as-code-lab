import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import repositoryLinks from './plugins/repository-links.mjs';

const base = '/document-as-code-lab';

export default defineConfig({
  site: 'https://and-gu.github.io',
  base,
  markdown: {
    processor: unified({ rehypePlugins: [[repositoryLinks, { base }]] }),
  },
});
