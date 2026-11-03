const banditLevel = post => {
  const title = post.data.title.trim();
  if (/^bandit$/i.test(title)) return -1;
  const match = /^Level\s+(\d+)\b/i.exec(title);
  return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
};

const compareBanditPosts = (a, b) => banditLevel(a) - banditLevel(b) || a.data.title.localeCompare(b.data.title, 'ko', { numeric: true });

export function sortPostsByUpdated(posts) {
  return [...posts].sort((a, b) => {
    const dateDifference = b.data.updatedAt - a.data.updatedAt;
    if (dateDifference) return dateDifference;
    if (a.data.category === 'OverTheWire Bandit' && b.data.category === 'OverTheWire Bandit') return compareBanditPosts(a, b);
    return 0;
  });
}

export function sortCategoryPosts(posts, category) {
  if (category !== 'OverTheWire Bandit') return posts;
  return [...posts].sort(compareBanditPosts);
}
