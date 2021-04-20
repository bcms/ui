import { BCMSMarkdownServicePrototype } from '../types';
import MarkdownIt from 'markdown-it';

export function BCMSMarkdownService() {
  const markdownIt = MarkdownIt({
    html: true,
  });
  const self: BCMSMarkdownServicePrototype = {
    toHtml(markdown) {
      return markdownIt.render(markdown).replace(/src=/g, 'src-disabled=');
    },
  };
  return self;
}
