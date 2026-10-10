import { visit } from 'unist-util-visit';

export default function growthWidget() {
  return (tree) => {
    visit(tree, ['comment', 'raw'], (node, index, parent) => {
      const marker = node.value.trim();
      const name = ['project-growth', 'budget-table'].find(name =>
        [`interactive: ${name}`, `<!-- interactive: ${name} -->`].includes(marker));
      if (!name || index === undefined || !parent) return;
      parent.children[index] = {
        type: 'element', tagName: 'div', properties: { id: `${name}-widget` }, children: [],
      };
    });
  };
}
