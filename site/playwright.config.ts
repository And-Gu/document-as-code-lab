import { defineConfig } from '@playwright/test';
const port = Number(process.env.E2E_PORT || 4340);
export default defineConfig({
  testDir: './tests/e2e', fullyParallel: true, forbidOnly: !!process.env.CI,
  retries: 0, workers: 2, timeout: 45000, globalTimeout: 600000,
  outputDir: '../build/verification/local-artifacts',
  reporter: [['list'], ['json', { outputFile:'../build/verification/local-results.json' }], ['html', { outputFolder:'../build/verification/local-report', open:'never' }]],
  use: { baseURL:`http://127.0.0.1:${port}/document-as-code-lab/`, trace:'retain-on-failure', screenshot:'only-on-failure' },
  projects: ['chromium','firefox','webkit'].map(browserName => ({ name:browserName, use:{ browserName:browserName as 'chromium'|'firefox'|'webkit' } })),
  webServer: { command:'node scripts/serve-production.mjs', url:`http://127.0.0.1:${port}/document-as-code-lab/build-information.json`, reuseExistingServer:false, timeout:15000 },
});
