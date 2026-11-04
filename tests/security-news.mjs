import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { cleanTitle, combine, feeds, parseFeed, safeUrl, updateNews } from '../scripts/update-security-news.mjs';

assert.equal(cleanTitle('  A\n\tＢ  story  '), 'A B story');
assert.equal(safeUrl('javascript:alert(1)', feeds[0].host), null);
assert.equal(safeUrl('https://www.bleepingcomputer.com.evil.test/news', feeds[0].host), null);
assert.equal(safeUrl('https://user:pass@www.bleepingcomputer.com/news', feeds[0].host), null);
assert.equal(safeUrl('https://www.bleepingcomputer.com/news#fragment', feeds[0].host), 'https://www.bleepingcomputer.com/news');
const xml = '<rss><channel><item><title> A   story </title><link>https://www.bleepingcomputer.com/news/a</link><pubDate>Wed, 04 Nov 2026 12:00:00 GMT</pubDate></item><item><title>Bad</title><link>https://evil.test/</link><pubDate>Wed, 04 Nov 2026 12:00:00 GMT</pubDate></item></channel></rss>';
assert.equal(parseFeed(xml, feeds[0]).length, 1);
assert.equal(combine([
  { title: 'A story', url: 'https://example.com/a', date: '2026-11-04T12:00:00.000Z' },
  { title: 'A  STORY', url: 'https://example.com/b', date: '2026-11-03T12:00:00.000Z' },
]).length, 1);
const folder = await mkdtemp(path.join(tmpdir(), 'security-news-'));
const destination = path.join(folder, 'news.json');
const success = await updateNews({ destination, fetcher: async url => {
  const feed = feeds.find(item => item.url === url);
  return { ok: true, text: async () => xml.replaceAll('www.bleepingcomputer.com', feed.host) };
}});
assert.equal(success.updated, true);
const original = await readFile(destination, 'utf8');
const failure = await updateNews({ destination, fetcher: async () => { throw new Error('offline'); } });
assert.equal(failure.updated, false);
assert.equal(await readFile(destination, 'utf8'), original);
console.log('Security news parsing and fallback tests passed');
