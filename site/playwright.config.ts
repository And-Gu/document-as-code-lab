import { defineConfig } from '@playwright/test';
import path from 'node:path';
const runDirectory = process.env.TEST_RUN_DIR;
if (!runDirectory) throw new Error('Use npm run test:e2e or npm run test:e2e:cross so each run owns its outputs and server.');
const port = Number(process.env.E2E_PORT || 4340);
export default defineConfig({
  testDir: './tests/e2e', fullyParallel: true, forbidOnly: !!process.env.CI,
  retries: 0, workers: 2, timeout: 45000, globalTimeout: 600000,
  outputDir: path.join(runDirectory, 'artifacts'),
  reporter: [['list'], ['json', { outputFile:path.join(runDirectory, 'results.json') }], ['html', { outputFolder:path.join(runDirectory, 'report'), open:'never' }]],
  use: { baseURL:`http://127.0.0.1:${port}/document-as-code-lab/`, trace:'retain-on-failure', screenshot:'only-on-failure' },
  projects: ['chromium','firefox','webkit'].map(browserName => ({ name:browserName, use:{ browserName:browserName as 'chromium'|'firefox'|'webkit' } })),
  webServer: { command:'node scripts/serve-production.mjs', url:`http://127.0.0.1:${port}/document-as-code-lab/build-information.json`, reuseExistingServer:false, timeout:15000 },
});
