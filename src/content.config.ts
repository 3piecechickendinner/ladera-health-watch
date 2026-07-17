import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// News & Updates is markdown-file-driven so a non-technical volunteer can add
// a post by dropping one .md file into src/content/news/. See README.md.
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    // 'update' = a post written by the group. 'press' = a link out to news coverage.
    type: z.enum(['update', 'press']).default('update'),
    // Required when type is 'press': the outlet name and the link to their story.
    sourceName: z.string().optional(),
    externalUrl: z.string().url().optional(),
  }),
});

export const collections = { news };
