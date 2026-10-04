// Paired Markdown comments keep examples readable outside the website.
export default function exampleSections() {
  return (tree) => {
    const children = [];
    let example;
    for (const node of tree.children) {
      const value = ['comment', 'raw'].includes(node.type)
        ? node.value.trim().replace(/^<!--\s*|\s*-->$/g, '') : '';
      const marker = /^example:(start|end) ([a-z][a-z0-9-]*)$/.exec(value);
      if (!marker) {
        (example ? example.children : children).push(node);
        continue;
      }
      const [, action, id] = marker;
      if (action === 'start') {
        if (example) throw new Error(`Nested example marker: ${id}`);
        example = {
          type: 'element', tagName: 'div',
          properties: { className: ['tutorial-example'], 'data-example': id },
          children: [],
        };
        children.push(example);
      } else {
        if (!example || example.properties['data-example'] !== id) {
          throw new Error(`Unmatched example end marker: ${id}`);
        }
        example = undefined;
      }
    }
    if (example) throw new Error(`Unclosed example: ${example.properties['data-example']}`);
    tree.children = children;
  };
}
