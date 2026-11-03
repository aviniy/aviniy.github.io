import fs from 'node:fs/promises';
import path from 'node:path';

export async function getStaticPaths() {
  const directory = path.join(process.cwd(), 'public/assets/notion');
  try {
    const files = (await fs.readdir(directory)).filter(file => /^[a-f0-9]{10}\.(?:png|jpe?g|gif|webp|pdf)$/i.test(file));
    return files.map(file => ({ params: { file }, props: { source: path.join(directory, file) } }));
  } catch {
    return [];
  }
}

export async function GET({ props }: { props: { source: string } }) {
  const extension = path.extname(props.source).toLowerCase();
  const types: Record<string, string> = { '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.gif':'image/gif', '.webp':'image/webp', '.pdf':'application/pdf' };
  return new Response(await fs.readFile(props.source), { headers: { 'Content-Type': types[extension] || 'application/octet-stream', 'Cache-Control': 'public, max-age=31536000, immutable' } });
}
