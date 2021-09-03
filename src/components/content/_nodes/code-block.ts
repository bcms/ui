import CodeBlock from '@tiptap/extension-code-block';
import { Attributes, VueNodeViewRenderer } from '@tiptap/vue-3';
import Component from './node-wrapper.vue';

export const BCMSCodeBlock = CodeBlock.extend({
  addAttributes() {
    const att: Attributes = {
      tag: {
        default: 'code',
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
