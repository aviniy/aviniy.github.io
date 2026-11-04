import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';

const source = await readFile(new URL('../src/components/HeartCursor.astro', import.meta.url), 'utf8');
const script = source.match(/<script is:inline>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script);
const dom = new JSDOM('<div data-heart-cursor></div>', { runScripts: 'outside-only', pretendToBeVisual: true });
const { window } = dom;
let frame = null, nextFrame = 0;
let reduced = false;
window.matchMedia = query => ({
  get matches() { return query.includes('reduced') ? reduced : true; },
  addEventListener() {},
});
window.requestAnimationFrame = callback => { frame = callback; return ++nextFrame; };
window.cancelAnimationFrame = () => { frame = null; };
window.eval(script);
const layer = window.document.querySelector('[data-heart-cursor]');
const pointerEvent = (type, x, y) => {
  const event = new window.Event(type);
  Object.defineProperties(event, { clientX: { value: x }, clientY: { value: y }, pointerType: { value: 'mouse' } });
  window.document.dispatchEvent(event);
};
pointerEvent('pointerdown', 100, 100);
assert.equal(layer.children.length, 12);
for (let i = 0; i < 200; i++) {
  pointerEvent('pointermove', i * 20, 100);
  const callback = frame;
  callback?.(i * 30 + 100);
}
assert.ok(layer.children.length <= 85, 'particle DOM stays within cap');
reduced = true;
window.document.dispatchEvent(new window.Event('visibilitychange'));
// A live browser media-query change calls the same sync handler; pagehide always clears particles.
window.dispatchEvent(new window.Event('pagehide'));
assert.equal(layer.children.length, 0);
console.log('Heart cursor burst, cap, and cleanup verified');
