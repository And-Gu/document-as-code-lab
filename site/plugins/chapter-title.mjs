import path from 'node:path';

// Chapter pages render their title separately to place metadata below it.
export default function chapterTitle() {
  return (tree, file) => {
    if (!file.path || path.basename(path.dirname(file.path)) !== 'docs') return;
    const index = tree.children.findIndex((node) => node.type === 'element' && node.tagName === 'h1');
    if (index >= 0) tree.children.splice(index, 1);
  };
}
