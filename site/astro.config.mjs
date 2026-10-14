import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import repositoryLinks from './plugins/repository-links.mjs';
import chapterTitle from './plugins/chapter-title.mjs';
import growthWidget from './plugins/growth-widget.mjs';
import exampleSections from './plugins/example-sections.mjs';

const base = '/document-as-code-lab';

export default defineConfig({
  site: 'https://and-gu.github.io',
  base,
  redirects: {
    '/chapters/06-processing/': `${base}/chapters/07-processing/`,
    '/chapters/06-ai-native/': `${base}/chapters/08-ai-native/`,
    '/chapters/07-ai-native/': `${base}/chapters/08-ai-native/`,
    '/chapters/07-images/': `${base}/chapters/09-images/`,
    '/chapters/08-images/': `${base}/chapters/09-images/`,
    '/chapters/08-git-review/': `${base}/chapters/10-git-review/`,
    '/chapters/09-git-review/': `${base}/chapters/10-git-review/`,
    '/chapters/09-dashboards/': `${base}/materials/reference/dashboards-and-work-tracking/`,
    '/chapters/10-dashboards/': `${base}/materials/reference/dashboards-and-work-tracking/`,
    '/chapters/10-publishing/': `${base}/chapters/12-publishing/`,
    '/chapters/11-publishing/': `${base}/chapters/12-publishing/`,
    '/chapters/11-beyond-github/': `${base}/chapters/13-beyond-github/`,
    '/chapters/12-beyond-github/': `${base}/chapters/13-beyond-github/`,
    '/chapters/12-automation/': `${base}/chapters/14-automation/`,
    '/chapters/13-automation/': `${base}/chapters/14-automation/`,
  },
  markdown: {
    processor: unified({ rehypePlugins: [[repositoryLinks, { base }], chapterTitle, growthWidget, exampleSections] }),
  },
});
