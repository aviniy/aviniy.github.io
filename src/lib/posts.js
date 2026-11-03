import { getCollection } from 'astro:content';
import { sortPostsByUpdated } from './category-sort.js';
export const basePath = import.meta.env.BASE_URL;
export const url = (path = '') => `${basePath}${path.replace(/^\//, '')}`;
export async function allPosts() { return sortPostsByUpdated(await getCollection('posts', ({ data }) => !data.draft)); }
export const postUrl = post => url(`posts/${post.id}/`);
export const date = value => new Intl.DateTimeFormat('ko-KR', { year:'numeric', month:'2-digit', day:'2-digit' }).format(value);
