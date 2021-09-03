import Paragraph from '@tiptap/extension-paragraph';
import { Attributes, VueNodeViewRenderer } from '@tiptap/vue-3';
import Component from './node-wrapper.vue';

export const BCMSParagraph = Paragraph.extend({
  addAttributes() {
    const att: Attributes = {
      tag: {
        default: 'p',
        keepOnSplit: false,
      },
    };
    Object.keys(this.options.HTMLAttributes).forEach((key) => {
      att[key] = {
        default: this.options.HTMLAttributes[key],
        keepOnSplit: false,
      };
    });
    return att;
  },
  addNodeView() {
    return VueNodeViewRenderer(Component);
  },
});
