import assert from 'node:assert/strict';
import { load } from 'cheerio';
import { readFile } from 'node:fs/promises';
import { satteri } from '@astrojs/markdown-satteri';
import config from '../astro.config.mjs';

const renderer = await config.markdown.processor.createRenderer(config.markdown);
const render = async source => load((await renderer.render(source)).code);

// The CMS may put blank paragraphs between the delimiters and the formula.
const formula = String.raw`1 = aa^{-1} \bmod m`;
for (const gap of ['\n', '\n\n']) {
  const $ = await render(`$$${gap}${formula}${gap}$$\n\n## Next section\n\nStill prose.`);
  assert.equal($('.katex-display').length, 1);
  assert.equal($('.katex-error').length, 0);
  assert.equal($('annotation[encoding="application/x-tex"]').text().trim(), formula);
  assert.equal($('math').attr('display'), 'block');
  assert.equal($('h2').text(), 'Next section', 'math stops at the closing delimiter');
  assert.equal($('p').last().text(), 'Still prose.');
}

const inline = await render(String.raw`Inverse $$a^{-1}$$ and fraction $$\frac{1}{m}$$.`);
assert.equal(inline('.katex').length, 2);
assert.equal(inline('.katex-display').length, 0);
assert.equal(inline('.katex-error').length, 0);

const aligned = await render(String.raw`$$
\begin{aligned}
E(x) &= (ax+b) \bmod m \\
D(E(x)) &= x
\end{aligned}
$$`);
assert.equal(aligned('.katex-display').length, 1);
assert.equal(aligned('.katex-error').length, 0);

const code = await render('`$a^{-1}$`\n\n```python\nprint("$$ \\bmod m $$")\n```');
assert.equal(code('.katex').length, 0, 'code examples stay literal');
assert.equal(code('p > code').text(), '$a^{-1}$');
assert.equal(code('pre code').text().trim(), 'print("$$ \\bmod m $$")');
assert(code('pre.astro-code').length, 'existing syntax highlighting remains enabled');

const literal = await render(String.raw`An escaped dollar: \$5. Shell variables: $HOME and $USER.`);
assert.equal(literal('.katex').length, 0);

const imported = await render('<h2 id="original">Imported</h2><pre data-notion-code-syntax="bash"><code>echo "$HOME $USER"</code></pre>');
assert.equal(imported('h2').attr('id'), 'original');
assert.equal(imported('pre code').text(), 'echo "$HOME $USER"');
assert.equal(imported('.katex').length, 0);

// Imported HTML includes multiline PowerShell and inline <code> with dollars.
const htmlPost = (await readFile(new URL('../src/content/posts/dreamhack-fast-xss.md', import.meta.url), 'utf8'))
  .replace(/^---[\s\S]*?---\s*/, '');
const plainRenderer = await satteri().createRenderer(config.markdown);
assert.equal((await renderer.render(htmlPost)).code, (await plainRenderer.render(htmlPost)).code,
  'existing imported writeup HTML is preserved exactly');

const invalid = await render(String.raw`$$
\frac{
$$`);
assert.equal(invalid('.katex-error').length, 1, 'a malformed formula does not stop publication');

console.log('Math rendering passed: display, CMS spacing, inline, aligned, code, HTML, and invalid input.');
