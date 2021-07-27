import { Node, mergeAttributes } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import Component from './widget.vue';

export default Node.create({
  name: 'widget',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      widget: {
        default: undefined,
      },
      content: {
        default: [],
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'widget',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['widget', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return VueNodeViewRenderer(Component);
  },
});
