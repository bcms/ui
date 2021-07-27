import { Node, mergeAttributes } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import { BCMSEntryExtendedContentAttrWidget } from '../../types';
import Component from './widget.vue';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    widget: {
      /**
       * Set a heading node
       */
      setWidget: (attributes: BCMSEntryExtendedContentAttrWidget) => ReturnType;
    };
  }
}

export default Node.create({
  name: 'widget',
  group: 'block',
  defining: true,
  atom: true,

  addCommands() {
    return {
      setWidget: (attrs) => (data) => {
        console.log(this);
        return (
          data.editor
            .chain()
            .focus()
            .insertContent({
              type: 'widget',
              attrs,
            })
            // .toggleWrap('listItem')
            .run()
        );
      },
    };
  },
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
