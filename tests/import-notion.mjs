import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import JSZip from 'jszip';

const root = process.cwd();
const zipPath = path.join(root,'imports','sample-test.zip');
const postsDir = path.join(root,'src/content/posts');
const assetDir = path.join(root,'public/assets/notion');
const beforePosts = new Set(await fs.readdir(postsDir));
const beforeAssets = new Set(await fs.readdir(assetDir).catch(()=>[]));
const zip = new JSZip();
zip.file('노트.html','<html><head><title>한글 노트</title></head><body><main><h2>개요</h2><p>내용 <a href="다음.html">다음</a></p><img src="노트/사진.png" alt="사진"><pre><code>echo hello</code></pre><table><tr><td>값</td></tr></table><details><summary>펼치기</summary><p>내용</p></details><script>alert(1)</script><a href="javascript:alert(1)">위험</a></main></body></html>');
zip.file('다음.html','<html><head><title>다음 글</title></head><body><main><h2>두 번째</h2></main></body></html>');
zip.file('bandit/Level 0.html','<html><head><title>Level 0</title></head><body><main><h2>접속</h2></main></body></html>');
zip.file('Dreamhack/Web/Web Challenge.html','<html><head><title>Web Challenge</title></head><body><main><h2>분석</h2></main></body></html>');
zip.file('노트/사진.png',Buffer.from('89504e470d0a1a0a','hex'));
await fs.writeFile(zipPath,await zip.generateAsync({type:'nodebuffer'}));
try {
  const run = () => spawnSync(process.execPath,['scripts/import-notion.mjs'],{cwd:root,encoding:'utf8',env:{...process.env,NOTION_IMPORT_FILE:'sample-test.zip'}});
  const first = run(); assert.equal(first.status,0,first.stderr);
  const second = run(); assert.equal(second.status,0,second.stderr);
  const created = (await fs.readdir(postsDir)).filter(x=>!beforePosts.has(x));
  assert.equal(created.length,4);
  const bandit = await fs.readFile(path.join(postsDir,created.find(x=>x.startsWith('level-0-'))),'utf8');
  assert.match(bandit,/category: "OverTheWire Bandit"/);
  const dreamhack = await fs.readFile(path.join(postsDir,created.find(x=>x.startsWith('web-challenge-'))),'utf8');
  assert.match(dreamhack,/category: "Dreamhack Web"/);
  const page = await fs.readFile(path.join(postsDir,created.find(x=>x.startsWith('노트-'))),'utf8');
  assert.match(page,/\.\.\/\.\.\/posts\/다음-/);
  assert.match(page,/\.\.\/\.\.\/assets\/notion\//);
  assert.match(page,/<pre>/); assert.match(page,/<table>/); assert.match(page,/<details>/);
  assert.doesNotMatch(page,/<script|javascript:/i);
  const build = spawnSync(process.execPath,['node_modules/astro/bin/astro.mjs','build'],{cwd:root,encoding:'utf8'});
  assert.equal(build.status,0,build.stderr || build.stdout);
  const slug = created.find(x=>x.startsWith('노트-')).replace(/\.md$/,'');
  const output = await fs.readFile(path.join(root,'dist','lab','posts',slug,'index.html'),'utf8');
  assert.match(output,/\.\.\/\.\.\/assets\/notion\//);
  assert.match(output,/\.\.\/\.\.\/posts\/다음-/);
  assert.match(output,/id="개요-0"/);
  console.log('Notion ZIP import verified');
} finally {
  await fs.rm(zipPath,{force:true});
  for(const file of (await fs.readdir(postsDir)).filter(x=>!beforePosts.has(x))) await fs.rm(path.join(postsDir,file),{force:true});
  for(const file of (await fs.readdir(assetDir).catch(()=>[])).filter(x=>!beforeAssets.has(x))) await fs.rm(path.join(assetDir,file),{force:true});
}
