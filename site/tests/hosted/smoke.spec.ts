import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
test('P3-02 expected deployment artifact, routes, metadata, sources and assets',async({page,request,baseURL},info)=>{
  const errors:string[]=[], missing:string[]=[], observed:string[]=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  page.on('response',response=>{if(response.status()>=400 && new URL(response.url()).origin===new URL(baseURL!).origin)missing.push(`${response.status()} ${response.url()}`);});
  page.on('requestfailed',r=>{if(new URL(r.url()).origin===new URL(baseURL!).origin)missing.push(r.url());});
  let manifest;
  for(let attempt=0;attempt<3;attempt++){
    const response=await request.get(`build-information.json?verification=${Date.now()}`,{timeout:12000});
    if(response.ok()) {try{manifest=await response.json();}catch{/* A fallback HTML page is not a manifest. */}}
    if(manifest?.source_commit===process.env.EXPECTED_REVISION)break;
    if(attempt<2)await new Promise(resolve=>setTimeout(resolve,2000));
  }
  await info.attach('deployment-identity',{body:JSON.stringify({expected:process.env.EXPECTED_REVISION,run:process.env.DEPLOYMENT_RUN_ID,observed:manifest??null,url:baseURL,checked_at:new Date().toISOString(),browser:page.context().browser()?.version()}),contentType:'application/json'});
  expect(manifest?.source_commit,'Revision mismatch/pending: a 200 response is not deployment evidence').toBe(process.env.EXPECTED_REVISION);
  expect(manifest.schema_version).toBe(1); expect(Object.keys(manifest).sort()).toEqual(['built_at','schema_version','source_commit']);expect(Number.isFinite(Date.parse(manifest.built_at))).toBe(true);
  const routes=['','chapters/01-introduction/','chapters/07-processing/','chapters/08-ai-native/','materials/examples/contract-explorer/records/DEL-101/','materials/reference/information-refinement/','materials/reference/knowledge-catalogue/','presentations/','presentations/information-model/notes/','chapters/06-processing/','dashboard/'];
  for(const viewport of [{width:390,height:844},{width:1440,height:900}]){
    await page.setViewportSize(viewport);
    for(const route of routes){
      const response=await page.goto(new URL(route,baseURL).href);expect(response?.status()).toBe(200);await page.waitForLoadState('networkidle');observed.push(page.url());
      if(route==='chapters/06-processing/')await expect(page).toHaveURL(/chapters\/07-processing\/$/);
      await expect(page.locator('h1')).toHaveCount(1);
      const canonical=await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toBe(`https://and-gu.github.io${new URL(page.url()).pathname}`);
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content',canonical!);
      await expect(page.locator('meta[name="description"]')).not.toHaveAttribute('content','');
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
    }
  }
  const raw=await request.get('files/examples/contract-explorer/records/DEL-101.md');expect(raw.status()).toBe(200);expect(await raw.body()).toEqual(await readFile('../examples/contract-explorer/records/DEL-101.md'));
  const source=await request.get('files/examples/information-refinement/sources/SRC-FORECAST.md');expect(await source.body()).toEqual(await readFile('../examples/information-refinement/sources/SRC-FORECAST.md'));
  expect(errors).toEqual([]);expect(missing).toEqual([]);
  // Controlled failure is isolated from natural console/asset checks, and never depends on live GitHub uptime.
  await page.route('https://api.github.com/**',route=>route.fulfill({status:503,contentType:'application/json',body:'{"message":"Controlled smoke-test failure"}'}));
  await page.locator('#dashboard-live-refresh').click();await expect(page.locator('#dashboard-announcement')).toContainText('need attention');
  const finalManifest=await (await request.get(`build-information.json?verification=${Date.now()}`)).json();expect(finalManifest.source_commit).toBe(process.env.EXPECTED_REVISION);
  await info.attach('observed-pages',{body:JSON.stringify({urls:observed,viewports:[390,1440],naturalErrors:[],missingAssets:[],dashboardFailure:'controlled 503; explicit error retained',checked_at:new Date().toISOString()}),contentType:'application/json'});
});
