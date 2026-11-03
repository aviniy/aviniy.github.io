import { getCollection } from 'astro:content';
export const basePath = import.meta.env.BASE_URL;
export const url = (path = '') => `${basePath}${path.replace(/^\//, '')}`;
export async function allPosts() { return (await getCollection('posts', ({ data }) => !data.draft)).sort((a,b) => b.data.updatedAt - a.data.updatedAt); }
export const postUrl = post => url(`posts/${post.id}/`);
export const date = value => new Intl.DateTimeFormat('ko-KR', { year:'numeric', month:'2-digit', day:'2-digit' }).format(value);
