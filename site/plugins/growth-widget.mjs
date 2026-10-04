import { visit } from 'unist-util-visit';

export default function growthWidget() {
  return (tree) => {
    visit(tree, ['comment', 'raw'], (node, index, parent) => {
      const marker = node.value.trim();
      if (!['interactive: project-growth', '<!-- interactive: project-growth -->'].includes(marker) || index === undefined || !parent) return;
      parent.children[index] = {
        type: 'element', tagName: 'div', properties: { id: 'project-growth-widget' }, children: [],
      };
    });
  };
}
