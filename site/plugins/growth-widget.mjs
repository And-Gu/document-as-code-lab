import { visit } from 'unist-util-visit';

export default function growthWidget() {
  return (tree) => {
    visit(tree, ['comment', 'raw'], (node, index, parent) => {
      const marker = node.value.trim();
      const name = /^(?:<!--\s*)?interactive: (scenario-check-[a-z-]+)(?:\s*-->)?$/.exec(marker)?.[1]
        ?? ['project-growth', 'budget-table', 'onboarding-lab', 'markdown-playground', 'chapter-quiz', 'metadata-lab', 'processing-lab', 'readiness-lab', 'contract-explorer', 'architecture-explorer'].find(name =>
          [`interactive: ${name}`, `<!-- interactive: ${name} -->`].includes(marker));
      if (!name || index === undefined || !parent) return;
      parent.children[index] = {
        type: 'element', tagName: 'div', properties: { id: `${name}-widget` }, children: [],
      };
    });
  };
}
