import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { visit } from 'unist-util-visit';

const root = fileURLToPath(new URL('../../', import.meta.url));

export default function repositoryLinks({ base = '' } = {}) {
  const prefix = base.replace(/\/$/, '');
  return (tree, file) => {
    if (!file.path) return;
    visit(tree, 'element', (node) => {
      const property = node.tagName === 'a' ? 'href' : node.tagName === 'img' ? 'src' : null;
      const value = property && node.properties?.[property];
      if (typeof value !== 'string' || /^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(value)) return;

      const suffixIndex = value.search(/[?#]/);
      const pathname = suffixIndex < 0 ? value : value.slice(0, suffixIndex);
      const suffix = suffixIndex < 0 ? '' : value.slice(suffixIndex);
      const target = path.resolve(path.dirname(file.path), decodeURIComponent(pathname));
      const relative = path.relative(root, target).split(path.sep).join('/');
      if (relative.startsWith('../') || path.isAbsolute(relative)) return;

      const encoded = relative.split('/').map(encodeURIComponent).join('/');
      if (/^docs\/[^/]+\.md$/.test(relative)) {
        node.properties[property] = `${prefix}/chapters/${encoded.slice(5, -3)}/${suffix}`;
      } else if (relative.endsWith('.md')) {
        node.properties[property] = `${prefix}/materials/${encoded.slice(0, -3)}/${suffix}`;
      } else {
        node.properties[property] = `${prefix}/files/${encoded}${suffix}`;
      }
    });
  };
}
