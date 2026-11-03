import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const posts = defineCollection({ loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }), schema: z.object({ title: z.string(), description: z.string().default(''), category: z.string().default('Study Notes'), tags: z.array(z.string()).default([]), createdAt: z.coerce.date(), updatedAt: z.coerce.date(), draft: z.boolean().default(false), notionSource: z.string().optional(), importedHtml: z.string().optional() }) });
export const collections = { posts };
