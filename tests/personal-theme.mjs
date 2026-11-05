import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { JSDOM } from 'jsdom';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
const layout = await read('src/layouts/PersonalLayout.astro');
const toggle = await read('src/components/PersonalThemeToggle.astro');
const initScript = layout.match(/<script[^>]*data-personal-theme-init[^>]*>([\s\S]*?)<\/script>/)?.[1];
const controller = toggle.match(/<script[^>]*data-personal-theme-controller[^>]*>([\s\S]*?)<\/script>/)?.[1];
assert.ok(initScript, 'theme initialization runs in the personal layout head');
assert.ok(controller, 'theme controller exists');
assert.ok(layout.indexOf('data-personal-theme-init') < layout.indexOf('</head>'), 'stored theme applied before body paint');

const key = 'aviniy-personal-theme-v1';
function fixture({ stored = null, blockRead = false, blockWrite = false, personal = true } = {}) {
  const markup = toggle.slice(0, toggle.indexOf('<script'));
  const dom = new JSDOM(`<!doctype html><html class="${personal ? 'personal-site' : ''}" data-theme="light" data-personal-theme="bocchi"><head></head><body>${markup}<iframe id="youtube-player" src="about:blank"></iframe></body></html>`, {
    url: 'https://aviniy.github.io/', runScripts: 'outside-only', pretendToBeVisual: true,
  });
  const { window } = dom;
  const state = { stored, blockRead, blockWrite, writes: 0, playerCalls: 0, events: [] };
  Object.defineProperty(window, 'localStorage', { value: {
    getItem(name) { assert.equal(name, key); if (state.blockRead) throw new Error('storage unavailable'); return state.stored; },
    setItem(name, value) { assert.equal(name, key); state.writes++; if (state.blockWrite) throw new Error('storage unavailable'); state.stored = value; },
  } });
  // Any attempt to re-initialize YouTube on a theme change is a test failure.
  Object.defineProperty(window, 'YT', { get() { state.playerCalls++; throw new Error('theme controller must not access YouTube'); } });
  const iframe = window.document.querySelector('iframe');
  const iframeWindow = iframe.contentWindow;
  window.document.addEventListener('aviniy:theme-change', event => state.events.push(event.detail.theme));
  if (personal) window.eval(initScript);
  window.eval(controller);
  const button = theme => window.document.querySelector(`[data-personal-theme-choice="${theme}"]`);
  const check = theme => {
    assert.equal(window.document.documentElement.dataset.personalTheme, theme);
    assert.equal(button(theme).getAttribute('aria-pressed'), 'true');
    assert.equal(button(theme === 'bocchi' ? 'kurumi' : 'bocchi').getAttribute('aria-pressed'), 'false');
    assert.equal(window.document.querySelector('iframe'), iframe, 'iframe node identity preserved');
    assert.equal(iframe.contentWindow, iframeWindow, 'iframe browsing context preserved');
    assert.equal(state.playerCalls, 0, 'no player API access');
    assert.equal(window.document.documentElement.dataset.theme, 'light', 'Lab dark-mode attribute is independent');
  };
  const storageEvent = (eventKey, newValue) => window.dispatchEvent(new window.StorageEvent('storage', { key: eventKey, newValue }));
  return { window, state, button, check, storageEvent, close: () => window.close() };
}

for (const stored of [null, '', 'broken', 'BOCCHI', 'light']) {
  const page = fixture({ stored });
  page.check('bocchi');
  assert.equal(page.window.document.querySelector('.personal-theme-switch').hidden, false, 'controls revealed only after initialization');
  assert.equal(page.state.writes, 0, 'initialization does not write storage');
  page.close();
}

{
  const page = fixture({ stored: 'kurumi' });
  page.check('kurumi');
  // Nested icon/text clicks bubble to the existing button handler.
  page.button('bocchi').querySelector('span').click();
  page.check('bocchi');
  assert.equal(page.state.stored, 'bocchi');
  page.button('kurumi').click();
  page.check('kurumi');
  assert.equal(page.state.stored, 'kurumi');
  assert.deepEqual(page.state.events, ['bocchi', 'kurumi']);
  page.button('kurumi').click();
  assert.equal(page.state.events.length, 2, 'unchanged theme emits no extra event');
  page.window.eval(controller);
  const before = page.state.writes;
  page.button('bocchi').click();
  assert.equal(page.state.writes, before + 1, 'controller execution cannot duplicate click listeners');
  page.check('bocchi');
  page.storageEvent('unrelated-key', 'kurumi');
  page.check('bocchi');
  page.storageEvent(key, 'kurumi');
  page.check('kurumi');
  page.storageEvent(key, 'invalid');
  page.check('bocchi');
  page.storageEvent(key, 'kurumi');
  page.storageEvent(null, null);
  page.check('bocchi');
  page.state.stored = 'kurumi';
  page.window.dispatchEvent(new page.window.Event('pageshow'));
  page.check('kurumi');
  page.close();
}

for (const options of [{ blockRead: true }, { blockWrite: true }, { blockRead: true, blockWrite: true }]) {
  const page = fixture(options);
  page.check('bocchi');
  page.button('kurumi').click();
  page.check('kurumi');
  if (options.blockRead) {
    page.window.dispatchEvent(new page.window.Event('pageshow'));
    page.check('kurumi');
  }
  page.button('bocchi').click();
  page.check('bocchi');
  page.close();
}

{
  const page = fixture({ personal: false });
  page.button('kurumi').click();
  assert.equal(page.state.writes, 0, 'controller refuses non-personal pages');
  assert.equal(page.window.document.documentElement.dataset.personalThemeReady, undefined);
  page.close();
}

const baseLayout = await read('src/layouts/BaseLayout.astro');
const forbidden = /PersonalLayout|PersonalNav|PersonalThemeToggle|personal-theme\.css|data-personal-theme|HeartCursor/;
assert.doesNotMatch(baseLayout, forbidden, 'Lab shared layout must remain separate');
async function inspectLab(directory) {
  for (const entry of await readdir(new URL(`../${directory}/`, import.meta.url), { withFileTypes: true })) {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) await inspectLab(path);
    else if (/\.(astro|[jt]s)$/.test(entry.name)) assert.doesNotMatch(await read(path), forbidden, `${path} does not include personal themes`);
  }
}
await inspectLab('src/pages/lab');
for (const path of ['src/pages/index.astro', 'src/pages/aboutme.astro']) {
  const page = await read(path);
  assert.match(page, /import PersonalLayout from/, `${path} uses shared personal layout`);
  assert.match(page, /import PersonalNav from/, `${path} uses shared navigation`);
}
assert.match(await read('src/components/PersonalNav.astro'), /PersonalThemeToggle/, 'both personal pages receive the same theme control');

console.log('Personal themes: default/storage/error handling, two-way toggles, ARIA, lifecycle, single initialization, player preservation and Lab isolation verified');
