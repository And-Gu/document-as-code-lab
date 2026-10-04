import { getCollection, type CollectionEntry } from 'astro:content';

export function chapterTitle(chapter: CollectionEntry<'chapters'>) {
  return chapter.body?.match(/^#\s+(.+)$/m)?.[1] ?? chapter.id;
}

export async function getChapters() {
  return (await getCollection('chapters')).sort(
    (a, b) => a.data.chapter_number - b.data.chapter_number,
  );
}
