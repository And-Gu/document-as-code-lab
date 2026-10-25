import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, cp, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
const temp=await mkdtemp(path.join(tmpdir(),'build-identity-'));
try {
  await mkdir(path.join(temp,'site/scripts'),{recursive:true});
  await cp('scripts/build-information.mjs',path.join(temp,'site/scripts/build-information.mjs'));
  await writeFile(path.join(temp,'.gitignore'),'site/public/\n');
  const git=args=>execFileSync('git',args,{cwd:temp,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
  git(['init','-q']);git(['add','.']);git(['-c','user.name=Verification fixture','-c','user.email=fixture@example.invalid','commit','-qm','Fixture']);
  const run=()=>execFileSync(process.execPath,['site/scripts/build-information.mjs'],{cwd:temp,env:{...process.env,PRIVATE_TEST_SENTINEL:'must-not-leak'},encoding:'utf8'});
  run();const clean=JSON.parse(await readFile(path.join(temp,'site/public/build-information.json'),'utf8'));
  assert.equal(clean.source_commit,git(['rev-parse','HEAD']));assert.equal(clean.schema_version,1);assert.ok(Number.isFinite(Date.parse(clean.built_at)));
  assert.deepEqual(Object.keys(clean).sort(),['built_at','schema_version','source_commit']);
  await writeFile(path.join(temp,'uncommitted.md'),'A changed input');run();const dirty=JSON.parse(await readFile(path.join(temp,'site/public/build-information.json'),'utf8'));assert.equal(dirty.source_commit,null);assert.ok(!JSON.stringify(dirty).includes('must-not-leak'));
  console.log('Clean build revision, dirty/untracked-tree refusal and minimal public manifest passed.');
}finally{await rm(temp,{recursive:true,force:true});}
