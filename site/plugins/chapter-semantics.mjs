import { visit } from 'unist-util-visit';

const text = node => node.value ?? (node.children ?? []).map(text).join('');
export default function chapterSemantics() {
  return tree => {
    visit(tree, 'element', node => {
      if (node.tagName !== 'blockquote') return;
      const label = text(node).trimStart();
      const kind = label.startsWith('Explore further:') ? 'supporting-reference'
        : label.startsWith('Source note:') ? 'source-note' : undefined;
      if (kind) node.properties.className = [...(node.properties.className ?? []), kind];
    });
  };
}
