export const categories = [
  { name: 'Information Security', children: ['System Security','Network Security','Web Security','Cryptography','Digital Forensics'] },
  { name: 'Wargame', children: [
    'OverTheWire Bandit',
    { name: 'Dreamhack', children: [
      { name: 'Dreamhack Web', label: 'Web' },
      { name: 'Dreamhack Misc', label: 'Misc' },
      { name: 'Dreamhack Forensics', label: 'Forensics' },
      { name: 'Dreamhack System Hacking', label: 'System Hacking' },
      { name: 'Dreamhack Reversing', label: 'Reversing' },
      { name: 'Dreamhack Pwnable', label: 'Pwnable' },
      { name: 'Dreamhack Crypto', label: 'Crypto' }
    ] },
    'CTF Writeups'
  ] },
  { name: 'Linux', children: ['Linux Basics','Commands','Shell Scripting'] },
  { name: 'Research', children: ['Vulnerability Analysis','CVE Research','Security Tools'] },
  { name: 'Misc', children: [] },
  { name: 'Algorithm', children: ['Baekjoon'] },
  { name: 'Study Notes', children: [] }
];

export const categoryName = node => typeof node === 'string' ? node : node.name;
export const categoryLabel = node => typeof node === 'string' ? node : node.label || node.name;
export const categoryDescendants = node => [categoryName(node), ...(typeof node === 'string' ? [] : (node.children || []).flatMap(categoryDescendants))];
export const allCategoryNames = () => categories.flatMap(categoryDescendants);
export const categoryNode = name => {
  const find = node => categoryName(node) === name ? node : typeof node === 'string' ? undefined : node.children?.map(find).find(Boolean);
  return categories.map(find).find(Boolean);
};
export const categoryMatches = (postCategory, name) => categoryDescendants(categoryNode(name) || name).includes(postCategory);
