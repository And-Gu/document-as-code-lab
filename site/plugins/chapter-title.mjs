import path from 'node:path';

// Chapter pages render their title separately to place metadata below it.
export default function chapterTitle() {
  return (tree, file) => {
    if (!file.path) return;
    const record = file.path.replaceAll('\\', '/').includes('/examples/contract-explorer/records/');
    if (!record && path.basename(path.dirname(file.path)) !== 'docs') return;
    const index = tree.children.findIndex((node) => node.type === 'element' && node.tagName === 'h1');
    if (index >= 0) {
      if (record) tree.children[index] = { type: 'element', tagName: 'span', properties: { id: tree.children[index].properties.id }, children: [] };
      else tree.children.splice(index, 1);
    }
  };
}
