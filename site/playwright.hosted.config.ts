import { defineConfig } from '@playwright/test';
import { execFileSync } from 'node:child_process';
const { HOSTED_URL, EXPECTED_REVISION, DEPLOYMENT_RUN_ID } = process.env;
if (!HOSTED_URL || !EXPECTED_REVISION || !DEPLOYMENT_RUN_ID) throw new Error('Provide HOSTED_URL, full EXPECTED_REVISION and DEPLOYMENT_RUN_ID. No deployment is started by this check.');
const url = new URL(HOSTED_URL);
if (url.username || url.password || url.search || url.hash || !url.pathname.endsWith('/document-as-code-lab/') || (url.protocol !== 'https:' && !['localhost','127.0.0.1'].includes(url.hostname))) throw new Error('Use an explicit public HTTPS base URL ending in /document-as-code-lab/ (localhost allowed only for harness rehearsal).');
if (!/^[a-f0-9]{40}$/.test(EXPECTED_REVISION)) throw new Error('EXPECTED_REVISION must be a full source commit.');
if (execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim() !== EXPECTED_REVISION) throw new Error('Check out EXPECTED_REVISION so raw-file comparison uses the expected source.');
export default defineConfig({
  testDir:'./tests/hosted', workers:1, retries:0, timeout:120000, globalTimeout:240000,
  outputDir:'../build/verification/hosted-artifacts',
  reporter:[['list'],['json',{outputFile:'../build/verification/hosted-results.json'}]],
  use:{baseURL:HOSTED_URL,browserName:'chromium',viewport:{width:390,height:844},trace:'retain-on-failure',screenshot:'only-on-failure'},
});
