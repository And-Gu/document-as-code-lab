import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'yaml';
import { z } from 'astro/zod';
import { getChapters, chapterTitle } from './chapters';
import { repositoryRoot } from './repository';
import { siteUrl } from './urls';
import { processProcedures } from './learning';

const text = z.string().trim().min(1);
const identifier = text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const common = {
  id: identifier,
  title: text,
  sources: z.array(text.regex(/^docs\/[a-z0-9-]+\.md$/)).min(1),
  notes: text.optional(),
};
const column = z.object({ title: text, items: z.array(text).min(1).max(4) }).strict();
export const slideSchema = z.discriminatedUnion('type', [
  z.object({ ...common, type: z.literal('title'), subtitle: text, context: text.optional() }).strict(),
  z.object({
    ...common, type: z.literal('content'), message: text,
    demo: z.literal('source-selection').optional(),
    bullets: z.array(text).max(4).default([]),
    image: z.object({
      path: text.regex(/^assets\/[a-zA-Z0-9_/-]+\.(png|jpg|jpeg|webp|svg)$/),
      alt: text, caption: text.optional(), interactive: z.literal('relationships').optional(),
    }).strict().optional(),
  }).strict(),
  z.object({ ...common, type: z.literal('comparison'), left: column, right: column }).strict(),
  z.object({
    ...common, type: z.literal('diagram'), message: text,
    steps: z.array(z.object({ label: text, detail: text }).strict()).min(2).max(5),
    outputs: z.array(text).min(1).max(3).optional(), caption: text.optional(),
  }).strict(),
]);
export const presentationSchema = z.object({
  slug: identifier, title: text, description: text, slides: z.array(slideSchema).min(1),
  view: z.enum(['slide', 'scroll']).default('slide'),
}).strict();
export type Slide = z.infer<typeof slideSchema>;
export type SlideOf<T extends Slide['type']> = Extract<Slide, { type: T }>;
export type Presentation = Awaited<ReturnType<typeof getPresentations>>[number];
export interface DemoRecord { id: string; title: string; status: string; owner: string; url: string }

export async function getPresentationDemo(): Promise<DemoRecord[]> {
  const records = await Promise.all(['access', 'equipment', 'contacts'].map(async (name) => {
    const file = `examples/onboarding-showcase/${name}.md`;
    const raw = await readFile(path.join(repositoryRoot, file), 'utf8');
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!match) throw new Error(`Missing procedure metadata: ${file}`);
    const metadata = z.object({ id: text, owner: text, status: z.enum(['draft', 'approved']) }).parse(parse(match[1]));
    const title = match[2].match(/^# (.+)$/m)?.[1];
    if (!title) throw new Error(`Missing procedure title: ${file}`);
    return { ...metadata, title, body: match[2], url: siteUrl(`files/${file}`) };
  }));
  processProcedures(records);
  return records.map(({ body, ...record }) => record);
}

// Vite tracks these source files in development; Astro renders them at build time.
const definitions = import.meta.glob('../../../presentations/*.yaml', {
  query: '?raw', import: 'default', eager: true,
});

export async function getPresentations() {
  const chapters = await getChapters();
  const sources = new Map(chapters.map((chapter) => [
    `docs/${chapter.id}.md`,
    { title: chapterTitle(chapter), number: chapter.data.chapter_number, url: siteUrl(`chapters/${chapter.id}/`) },
  ]));
  const slugs = new Set<string>();
  const presentations = [];
  for (const [file, raw] of Object.entries(definitions)) {
    const definition = presentationSchema.parse(parse(String(raw)));
    if (slugs.has(definition.slug)) throw new Error(`Duplicate presentation slug: ${definition.slug}`);
    slugs.add(definition.slug);
    const ids = new Set<string>();
    for (const slide of definition.slides) {
      if (ids.has(slide.id)) throw new Error(`Duplicate slide id in ${file}: ${slide.id}`);
      ids.add(slide.id);
      for (const source of slide.sources) {
        if (!sources.has(source)) throw new Error(`Unknown chapter in ${file}: ${source}`);
      }
      if (slide.type === 'content' && slide.image) {
        await access(path.join(repositoryRoot, slide.image.path));
      }
    }
    presentations.push({
      ...definition,
      sourceFile: `presentations/${file.split('/').at(-1)}`,
      slides: definition.slides.map((slide) => ({
        ...slide, references: slide.sources.map((source) => sources.get(source)!),
      })),
    });
  }
  return presentations.sort((a, b) => a.title.localeCompare(b.title));
}
