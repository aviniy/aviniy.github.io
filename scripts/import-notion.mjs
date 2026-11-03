import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import JSZip from 'jszip';
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
import * as cheerio from 'cheerio';
import { categories } from '../src/config/categories.js';

const root = process.cwd();
const imports = path.join(root, 'imports');
const contentDir = path.join(root, 'src/content/posts');
const assetsDir = path.join(root, 'public/assets/notion');
const MAX_ZIP = 25 * 1024 * 1024;
const MAX_TOTAL = 100 * 1024 * 1024;
const MAX_FILE = 20 * 1024 * 1024;
const assetExt = new Set(['.png','.jpg','.jpeg','.gif','.webp','.pdf']);
const window = new JSDOM('').window;
const purify = createDOMPurify(window);
const safe = name => !path.posix.isAbsolute(name) && !name.includes('\\') && !name.split('/').some(p => p === '..' || p === '.' || !p) && !/^[a-z]:/i.test(name);
const slugify = name => name.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,'-').replace(/^-|-$/g,'').slice(0,80) || 'page';
const hash = text => crypto.createHash('sha256').update(text).digest('hex').slice(0,10);
const yaml = value => JSON.stringify(value);
const date = new Date().toISOString().slice(0,10);
const plainName = value => value.replace(/\s+[0-9a-f]{32}(?=\.html?$|$)/i,'').replace(/\.html?$/i,'').trim().toLocaleLowerCase();
const inferCategory = name => {
  const parts = name.split('/').map(plainName);
  if (parts.some(part => part === 'bandit' || part === 'overthewire bandit')) return 'OverTheWire Bandit';
  for (const group of categories) {
    const child = group.children.find(item => parts.includes(item.toLocaleLowerCase()));
    if (child) return child;
    if (parts.includes(group.name.toLocaleLowerCase())) return group.name;
  }
  return 'Study Notes';
};
const findDate = ($, key) => {
  const raw = $(`meta[property="${key}"],meta[name="${key}"]`).first().attr('content');
  const parsed = raw && new Date(raw);
  return parsed && !Number.isNaN(parsed.getTime()) ? parsed.toISOString().slice(0,10) : undefined;
};
async function processZip(zipPath) {
  const stat = await fs.stat(zipPath);
  if (stat.size > MAX_ZIP) throw new Error('ZIP 크기가 25 MB를 초과합니다.');
  const zip = await JSZip.loadAsync(await fs.readFile(zipPath), { checkCRC32: true });
  const files = Object.entries(zip.files).filter(([,f]) => !f.dir);
  let total = 0;
  for (const [name, file] of files) {
    if (!safe(name)) throw new Error(`위험한 ZIP 경로: ${name}`);
    const size = file._data?.uncompressedSize ?? 0;
    if (size > MAX_FILE) throw new Error(`파일 크기 초과: ${name}`);
    total += size;
    if (total > MAX_TOTAL) throw new Error('압축 해제 크기가 100 MB를 초과합니다.');
  }
  const htmlFiles = files.filter(([name]) => /\.html?$/i.test(name));
  const map = new Map(htmlFiles.map(([name]) => [name, `${slugify(path.posix.basename(name).replace(/\s+[0-9a-f]{32}(?=\.html?$)/i,'').replace(/\.html?$/i,''))}-${hash(`${path.basename(zipPath)}:${name}`)}`]));
  let count = 0;
  for (const [name, file] of htmlFiles) {
    const source = await file.async('string');
    const $ = cheerio.load(source);
    const title = $('title').first().text().trim() || $('h1').first().text().trim() || path.posix.basename(name).replace(/\.html?$/i,'');
    const description = $('meta[name="description"]').attr('content') || $('p').first().text().trim().slice(0,180) || title;
    const createdAt = findDate($,'article:published_time') || date;
    const updatedAt = findDate($,'article:modified_time') || date;
    const slug = map.get(name);
    const document = $('main').first().length ? $('main').first() : $('article').first().length ? $('article').first() : $('body').first();
    document.find('script,style,iframe,object,embed,form,link,meta').remove();
    document.find('[href],[src]').each((_,el) => {
      const attr = el.attribs.href !== undefined ? 'href' : 'src';
      const raw = (el.attribs[attr] || '').trim();
      if (attr === 'href' && raw.startsWith('#')) return;
      if (/^(?:javascript:|data:|vbscript:|file:|\/\/)/i.test(raw)) { $(el).removeAttr(attr); return; }
      if (/^https?:/i.test(raw)) { if (attr === 'src') $(el).removeAttr(attr); return; }
      const decoded = decodeURIComponent(raw.split(/[?#]/)[0]);
      const target = path.posix.normalize(path.posix.join(path.posix.dirname(name),decoded));
      if (!safe(target)) { $(el).removeAttr(attr); return; }
      if (map.has(target)) { $(el).attr(attr, `../../posts/${map.get(target)}/`); return; }
      const entry = zip.files[target];
      if (entry && assetExt.has(path.posix.extname(target).toLowerCase())) {
        const ext = path.posix.extname(target).toLowerCase();
        const asset = `${hash(`${path.basename(zipPath)}:${target}`)}${ext}`;
        $(el).attr(attr, `../../assets/notion/${asset}`);
      } else $(el).removeAttr(attr);
    });
    document.find('input[type="checkbox"]').each((_,el)=>$(el).attr('disabled',''));
    document.find('h2,h3').each((i,el)=>$(el).attr('id',`${slugify($(el).text())}-${i}`));
    const clean = purify.sanitize(document.html() || '', { USE_PROFILES: { html: true }, ADD_TAGS:['details','summary'], ADD_ATTR:['open','checked','disabled','class','id'], FORBID_TAGS:['iframe','script','style','form','object','embed','svg','math'], FORBID_ATTR:['style','srcset'] });
    for (const [target, entry] of files) {
      if (!assetExt.has(path.posix.extname(target).toLowerCase()) || !clean.includes(hash(`${path.basename(zipPath)}:${target}`))) continue;
      const ext = path.posix.extname(target).toLowerCase();
      if (ext === '.svg') continue;
      await fs.mkdir(assetsDir,{recursive:true});
      await fs.writeFile(path.join(assetsDir,`${hash(`${path.basename(zipPath)}:${target}`)}${ext}`),await entry.async('nodebuffer'));
    }
    const existing = path.join(contentDir,`${slug}.md`);
    let oldCreated;
    try { oldCreated = (await fs.readFile(existing,'utf8')).match(/^createdAt: (.+)$/m)?.[1]; } catch {}
    const metadata = [`title: ${yaml(title)}`,`description: ${yaml(description)}`,`category: ${yaml(inferCategory(name))}`,`tags: []`,`createdAt: ${oldCreated || yaml(createdAt)}`,`updatedAt: ${yaml(updatedAt)}`,`draft: false`,`notionSource: ${yaml(`${path.basename(zipPath)}:${name}`)}`];
    await fs.mkdir(contentDir,{recursive:true});
    await fs.writeFile(existing,`---\n${metadata.join('\n')}\n---\n\n${clean}\n`);
    count++;
    console.log(`${slug}: ${title}`);
  }
  return count;
}
async function main() {
  await fs.mkdir(imports,{recursive:true});
  let total = 0;
  for (const name of await fs.readdir(imports)) {
    if (!/\.zip$/i.test(name)) continue;
    if (process.env.NOTION_IMPORT_FILE && name !== process.env.NOTION_IMPORT_FILE) continue;
    try { total += await processZip(path.join(imports,name)); }
    catch (error) { console.error(`${name}: ${error.message}`); process.exitCode = 1; }
  }
  console.log(`${total}개 페이지 가져오기 완료`);
}
await main();
