import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';

const source = await readFile(new URL('../src/components/HeartCursor.astro', import.meta.url), 'utf8');
const script = source.match(/<script is:inline>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script);
const dom = new JSDOM('<div data-heart-cursor></div>', { runScripts: 'outside-only', pretendToBeVisual: true });
const { window } = dom;
let frame = null, nextFrame = 0, now = 0;
let reduced = false, fine = true, random = .5;
const mediaListeners = {};
window.matchMedia = query => ({
  get matches() { return query.includes('reduced') ? reduced : fine; },
  addEventListener(type, callback) { mediaListeners[query.includes('reduced') ? 'motion' : 'pointer'] = callback; },
});
window.requestAnimationFrame = callback => { frame = callback; return ++nextFrame; };
window.cancelAnimationFrame = () => { frame = null; };
window.Math.random = () => random;
window.performance.now = () => now;
window.eval(script);
// Re-executing an inline script must not double-register pointer listeners.
window.eval(script);
const layer = window.document.querySelector('[data-heart-cursor]');
const pointerEvent = (type, x = 100, y = 100, pointerType = 'mouse') => {
  const event = new window.Event(type);
  Object.defineProperties(event, { clientX: { value: x }, clientY: { value: y }, pointerType: { value: pointerType } });
  window.document.dispatchEvent(event);
};
const theme = value => {
  window.document.documentElement.dataset.personalTheme = value;
  window.document.dispatchEvent(new window.CustomEvent('aviniy:theme-change'));
};
const click = () => { now += 400; pointerEvent('pointerdown'); };

click();
assert.equal(layer.children.length, 12, 'single Bocchi click burst');
assert.ok([...layer.children].every(p => p.dataset.kind === 'heart' && p.textContent === '♥'));
pointerEvent('pointerdown');
assert.equal(layer.children.length, 12, 'rapid clicks are throttled');
const ended = layer.firstElementChild;
ended.dispatchEvent(new window.Event('animationend'));
assert.equal(ended.isConnected, false, 'finished animation is removed');

for (let i = 0; i < 200; i++) {
  now += 30;
  pointerEvent('pointermove', i * 20, 100);
  const callback = frame;
  callback?.(now);
}
assert.equal(layer.children.length, 85, 'particle DOM stays within cap');
theme('kurumi');
assert.equal(layer.children.length, 0, 'theme switch clears old palette');
click();
assert.ok([...layer.children].every(p => p.dataset.kind === 'petal' && p.textContent === ''));
assert.equal(layer.firstElementChild.style.getPropertyValue('--color'), '#8c263e');
random = .9;
click();
assert.equal(layer.querySelectorAll('[data-kind="sparkle"]').length, 12, 'Kurumi gold sparkles');
random = .99;
click();
assert.equal(layer.querySelectorAll('[data-kind="clock"]').length, 1, 'clock motif rate limited within burst');
assert.equal(layer.textContent.includes('♥'), false, 'no hearts in Kurumi mode');

theme('bocchi');
random = .5;
pointerEvent('pointerdown', 100, 100, 'touch');
pointerEvent('pointermove', 200, 100, 'touch');
pointerEvent('pointerdown', 100, 100, 'pen');
assert.equal(layer.children.length, 0, 'touch and pen events do not emit');
reduced = true;
mediaListeners.motion();
click();
assert.equal(layer.children.length, 0, 'reduced motion disables effects');
reduced = false;
mediaListeners.motion();
click();
assert.equal(layer.children.length, 12, 'Bocchi resumes after reduced motion disabled');
fine = false;
mediaListeners.pointer();
click();
assert.equal(layer.children.length, 0, 'coarse pointer disables and clears effects');
fine = true;
mediaListeners.pointer();
click();
window.dispatchEvent(new window.Event('pagehide'));
assert.equal(layer.children.length, 0, 'pagehide cleanup');
window.dispatchEvent(new window.Event('pageshow'));
click();
assert.equal(layer.children.length, 12, 'bfcache restore resumes effects once');
window.dispatchEvent(new window.Event('pagehide'));
window.close();
console.log('Heart cursor: themes, burst, throttle, cap, animation cleanup, motion, pointer and page lifecycle verified');
