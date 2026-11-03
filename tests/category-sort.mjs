import assert from 'node:assert/strict';
import { sortCategoryPosts } from '../src/lib/category-sort.js';

const titles = ['Level 10 → Level 11', 'Level 2 → Level 3', 'bandit', 'Level 0', 'Level 1 → Level 2'];
const posts = titles.map(title => ({ data: { title } }));
assert.deepEqual(sortCategoryPosts(posts, 'OverTheWire Bandit').map(post => post.data.title), [
  'bandit', 'Level 0', 'Level 1 → Level 2', 'Level 2 → Level 3', 'Level 10 → Level 11'
]);
console.log('Bandit level order verified');
