import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import repositoryLinks from './plugins/repository-links.mjs';
import chapterTitle from './plugins/chapter-title.mjs';
import growthWidget from './plugins/growth-widget.mjs';
import exampleSections from './plugins/example-sections.mjs';
import chapterSemantics from './plugins/chapter-semantics.mjs';

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
    '/chapters/08-git-review/': `${base}/chapters/02-github-workspace/`,
    '/chapters/09-git-review/': `${base}/chapters/02-github-workspace/`,
    '/chapters/10-git-review/': `${base}/chapters/02-github-workspace/`,
    '/chapters/09-dashboards/': `${base}/materials/reference/dashboards-and-work-tracking/`,
    '/chapters/10-dashboards/': `${base}/materials/reference/dashboards-and-work-tracking/`,
    '/chapters/11-publishing/': `${base}/chapters/10-publishing/`,
    '/chapters/12-publishing/': `${base}/chapters/10-publishing/`,
    '/chapters/12-beyond-github/': `${base}/chapters/11-beyond-github/`,
    '/chapters/13-beyond-github/': `${base}/chapters/11-beyond-github/`,
    '/chapters/12-automation/': `${base}/materials/reference/automation-quality/#plan-a-first-increment`,
    '/chapters/13-automation/': `${base}/materials/reference/automation-quality/#plan-a-first-increment`,
    '/chapters/14-automation/': `${base}/materials/reference/automation-quality/#plan-a-first-increment`,
    '/chapters/10-quality-checks/': `${base}/materials/reference/automation-quality/`,
    '/chapters/11-quality-checks/': `${base}/materials/reference/automation-quality/`,
  },
  markdown: {
    processor: unified({ rehypePlugins: [[repositoryLinks, { base }], chapterTitle, growthWidget, exampleSections, chapterSemantics] }),
  },
});
