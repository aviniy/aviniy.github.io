const banditLevel = post => {
  const title = post.data.title.trim();
  if (/^bandit$/i.test(title)) return -1;
  const match = /^Level\s+(\d+)\b/i.exec(title);
  return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
};

export function sortCategoryPosts(posts, category) {
  if (category !== 'OverTheWire Bandit') return posts;
  return [...posts].sort((a, b) => banditLevel(a) - banditLevel(b) || a.data.title.localeCompare(b.data.title, 'ko', { numeric: true }));
}
