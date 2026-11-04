import { load } from 'cheerio';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const output = fileURLToPath(new URL('../src/data/security-news.json', import.meta.url));
export const feeds = [
  { source: 'BleepingComputer', url: 'https://www.bleepingcomputer.com/feed/', host: 'www.bleepingcomputer.com' },
  { source: 'The Hacker News', url: 'https://feeds.feedburner.com/TheHackersNews', host: 'thehackernews.com' },
  { source: 'CISA', url: 'https://www.cisa.gov/cybersecurity-advisories/all.xml', host: 'www.cisa.gov' },
];

export function cleanTitle(value) {
  return value.normalize('NFKC').replace(/[\u0000-\u001f\u007f\u200b-\u200d\ufeff]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 240);
}

export function safeUrl(value, host) {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' || url.hostname !== host || url.username || url.password || url.port) return null;
    url.hash = '';
    return url.href;
  } catch { return null; }
}

export function parseFeed(xml, feed) {
  const $ = load(xml, { xmlMode: true });
  if (!$('rss, feed').length) throw new Error('Invalid RSS document');
  return $('item, entry').toArray().map(node => {
    const item = $(node);
    const title = cleanTitle(item.children('title').first().text());
    const rawLink = item.children('link').first().attr('href') || item.children('link').first().text();
    const url = safeUrl(rawLink || '', feed.host);
    const rawDate = item.children('pubDate, published, updated, dc\\:date').first().text();
    const date = new Date(rawDate);
    if (!title || !url || !Number.isFinite(date.getTime())) return null;
    return { title, source: feed.source, date: date.toISOString(), url };
  }).filter(Boolean);
}

export function combine(items) {
  const seenUrls = new Set(), seenTitles = new Set();
  return items.sort((a, b) => b.date.localeCompare(a.date)).filter(item => {
    const titleKey = item.title.toLocaleLowerCase('en').replace(/[^\p{L}\p{N}]+/gu, '');
    if (seenUrls.has(item.url) || seenTitles.has(titleKey)) return false;
    seenUrls.add(item.url); seenTitles.add(titleKey);
    return true;
  }).slice(0, 20);
}

export async function updateNews({ fetcher = fetch, destination = output } = {}) {
  let previous = { updatedAt: null, items: [] };
  try { previous = JSON.parse(await readFile(destination, 'utf8')); } catch {}
  const results = await Promise.allSettled(feeds.map(async feed => {
    const response = await fetcher(feed.url, { headers: { 'User-Agent': 'aviniy.github.io RSS reader' }, signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`${response.status}`);
    const xml = await response.text();
    if (xml.length > 8_000_000) throw new Error('Feed too large');
    const items = parseFeed(xml, feed);
    if (!items.length) throw new Error('No valid entries');
    return items;
  }));
  const failures = results.filter(result => result.status === 'rejected');
  if (failures.length) {
    for (const result of failures) console.warn('RSS fetch failed:', result.reason.message);
    console.warn('Keeping last successful news JSON.');
    return { updated: false, ...previous };
  }
  const items = combine(results.flatMap(result => result.value));
  if (!items.length) return { updated: false, ...previous };
  const data = { updatedAt: new Date().toISOString(), items };
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, JSON.stringify(data, null, 2) + '\n');
  return { updated: true, ...data };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await updateNews();
  console.log(`Security news: ${result.updated ? 'updated' : 'retained'} (${result.items.length} items)`);
}
