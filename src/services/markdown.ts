import { BCMSMarkdownServicePrototype } from '../types';
import MarkdownIt from 'markdown-it';

export function BCMSMarkdownService(): BCMSMarkdownServicePrototype {
  const markdownIt = MarkdownIt({
    html: true,
  });
  return {
    toHtml(markdown) {
      return markdownIt.render(markdown).replace(/src=/g, 'src-disabled=');
    },
  };
}
