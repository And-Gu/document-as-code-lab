import { request } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { assertHostedIdentity } from '../../scripts/hosted-target.mjs';

// Run even when --grep selects just one scenario. A failed identity check stops
// the scenarios; a changed deployment during testing fails the overall run.
export default async function guard() {
  const verify = async (phase: string) => {
    const context = await request.newContext({ baseURL: process.env.HOSTED_URL });
    let manifest: unknown;
    let failure: unknown;
    const attempts = phase === 'before' ? 3 : 1;
    try {
      for (let attempt = 0; attempt < attempts; attempt++) {
        try {
          const response = await context.get(`build-information.json?verification=${Date.now()}`, { timeout: 12000 });
          if (!response.ok()) throw new Error(`Manifest returned HTTP ${response.status()}`);
          manifest = await response.json();
          assertHostedIdentity(manifest, process.env.EXPECTED_REVISION);
          failure = undefined;
          break;
        } catch (error) { failure = error; }
        if (attempt < attempts - 1) await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } finally {
      await context.dispose();
      await writeFile(path.join(process.env.TEST_RUN_DIR!, `deployment-${phase}.json`), JSON.stringify({
        url: process.env.HOSTED_URL, expected: process.env.EXPECTED_REVISION,
        deployment_run: process.env.DEPLOYMENT_RUN_ID, observed: manifest ?? null,
        checked_at: new Date().toISOString(), error: failure ? String(failure) : null,
      }, null, 2));
    }
    if (failure) throw failure;
  };
  await verify('before');
  return () => verify('after');
}
