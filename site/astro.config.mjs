import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import repositoryLinks from './plugins/repository-links.mjs';
import chapterTitle from './plugins/chapter-title.mjs';

const base = '/document-as-code-lab';

export default defineConfig({
  site: 'https://and-gu.github.io',
  base,
  markdown: {
    processor: unified({ rehypePlugins: [[repositoryLinks, { base }], chapterTitle] }),
  },
});
