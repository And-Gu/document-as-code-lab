import { defineConfig } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { validateHostedTarget } from './scripts/hosted-target.mjs';
const runDirectory = process.env.TEST_RUN_DIR;
if (!runDirectory) throw new Error('Use npm run test:hosted so each run owns its output directory.');
const target = validateHostedTarget(process.env, execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim());
const scenarios = process.env.HOSTED_SCENARIOS === '1';
export default defineConfig({
  testDir:scenarios ? './tests/e2e' : './tests/hosted', workers:1, retries:0, timeout:120000, globalTimeout:240000,
  globalSetup:scenarios ? './tests/hosted/scenario-identity.ts' : undefined,
  outputDir:path.join(runDirectory, 'artifacts'),
  reporter:[['list'],['json',{outputFile:path.join(runDirectory, 'results.json')}]],
  use:{baseURL:target.url,viewport:scenarios ? {width:1280,height:720} : {width:390,height:844},trace:'retain-on-failure',screenshot:'only-on-failure'},
  projects:[{name:'chromium',use:{browserName:'chromium'}}],
});
