/* eslint-disable @typescript-eslint/no-explicit-any */
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
  atom: true,
  defining: true,
  draggable: true,
  isolating: true,

  addCommands() {
    return {
      setWidget: (attrs) => (data) => {
        const path = (data.state.selection.$anchor as any).path;
        if ((data.state.selection.$anchor as any).path.length !== 6) {
          return false;
        }
        return data.editor
          .chain()
          .focus()
          .insertContentAt(
            {
              from: path[2],
              to: path[2] + path[3].content.size + 1,
            },
            {
              type: 'widget',
              attrs,
            }
          )
          .run();
      },
    };
  },
  addAttributes() {
    return {
      widget: {
        default: undefined,
        parseHTML: (element) => element.getAttribute('widget'),
      },
      content: {
        default: [],
        parseHTML: (element) => element.getAttribute('content'),
      },
    };
  },

  onUpdate() {
    const path = (this.editor.state.selection.$anchor as any).path;
    const widgetAttrs = this.editor.getAttributes('widget');
    if (widgetAttrs.widget) {
      if (path.length > 3) {
        (this.editor.commands as any).undo();
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'widget',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'widget',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },

  addNodeView() {
    return VueNodeViewRenderer(Component);
  },
});
