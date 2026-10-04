import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const chapters = defineCollection({
  loader: glob({
    pattern: '*.md',
    base: '../docs',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    chapter_number: z.number().int().positive(),
    status: z.string().default('unknown'),
    id: z.string().optional(),
    audience: z.string().optional(),
    learning_goal: z.string().optional(),
  }),
});

const materials = defineCollection({
  loader: glob({
    pattern: ['*.md', 'site/README.md', 'examples/**/*.md', 'reference/**/*.md', 'assets/**/*.md'],
    base: '..',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
});

export const collections = { chapters, materials };
