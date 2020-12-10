// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {Remarkable} from 'remarkable';

export type MarkdownServicePrototype = {
  toHtml(markdown: string): string;
};

function markdownService(): MarkdownServicePrototype {
  const remarkable = new Remarkable({
    html: true,
  });
  return {
    toHtml(markdown) {
      return remarkable.render(markdown).replace(/src/g, 'src-disabled');
    },
  };
}

export const MarkdownService = markdownService();
