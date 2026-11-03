import assert from 'node:assert/strict';
import { sortCategoryPosts, sortPostsByUpdated } from '../src/lib/category-sort.js';
import { allCategoryNames, categoryMatches } from '../src/config/categories.js';

const titles = ['Level 10 → Level 11', 'Level 2 → Level 3', 'bandit', 'Level 0', 'Level 1 → Level 2'];
const posts = titles.map(title => ({ data: { title } }));
assert.deepEqual(sortCategoryPosts(posts, 'OverTheWire Bandit').map(post => post.data.title), [
  'bandit', 'Level 0', 'Level 1 → Level 2', 'Level 2 → Level 3', 'Level 10 → Level 11'
]);
console.log('Bandit level order verified');
const dated = posts.map(post => ({ data: { ...post.data, category: 'OverTheWire Bandit', updatedAt: new Date('2026-11-03') } }));
assert.deepEqual(sortPostsByUpdated(dated).map(post => post.data.title), [
  'bandit', 'Level 0', 'Level 1 → Level 2', 'Level 2 → Level 3', 'Level 10 → Level 11'
]);
console.log('Homepage Bandit order verified');
assert.ok(allCategoryNames().includes('Dreamhack Web'));
assert.ok(categoryMatches('Dreamhack Web', 'Dreamhack'));
assert.ok(categoryMatches('Dreamhack Reversing', 'Wargame'));
assert.equal(categoryMatches('Dreamhack Web', 'Dreamhack Misc'), false);
console.log('Dreamhack category hierarchy verified');
