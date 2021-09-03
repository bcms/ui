import { VueNodeViewRenderer } from '@tiptap/vue-3';
import Component from './node-wrapper.vue';

// export const BCMSHeading = Heading.extend({
//   addAttributes() {
//     const att: Attributes = {
//       tag: {
//         default: 'h',
//         keepOnSplit: false,
//       },
//       icon: {
//         default: '',
//         keepOnSplit: false,
//       },
//     };
//     Object.keys(this.options.HTMLAttributes).forEach((key) => {
//       att[key] = {
//         default: this.options.HTMLAttributes[key],
//         keepOnSplit: false,
//       };
//     });
//     return att;
//   },
//   renderHTML({ node, HTMLAttributes }) {
//     const hasLevel = this.options.levels.includes(node.attrs.level);
//     const level = hasLevel ? node.attrs.level : this.options.levels[0];

//     return [
//       `h${level}`,
//       mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
//         lvl: 'h' + level,
//       }),
//       0,
//     ];
//   },
//   addNodeView() {
//     return VueNodeViewRenderer(Component);
//   },
// });

import { Node, mergeAttributes, Attributes } from '@tiptap/core';
import { textblockTypeInputRule } from 'prosemirror-inputrules';

type Level = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingOptions {
  levels: Level[];
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    heading: {
      /**
       * Set a heading node
       */
      setHeading: (attributes: { level: Level; tag?: string }) => ReturnType;
      /**
       * Toggle a heading node
       */
      toggleHeading: (attributes: { level: Level; tag?: string }) => ReturnType;
    };
  }
}

export const BCMSHeading = Node.create<HeadingOptions>({
  name: 'heading',

  defaultOptions: {
    levels: [1, 2, 3, 4, 5, 6],
    HTMLAttributes: {},
  },

  content: 'inline*',

  group: 'block',

  defining: true,

  addAttributes() {
    const att: Attributes = {
      tag: {
        default: 'h',
        keepOnSplit: false,
      },
      icon: {
        default: '',
        keepOnSplit: false,
      },
      level: {
        default: 1,
        rendered: false,
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

  parseHTML() {
    return this.options.levels.map((level: Level) => ({
      tag: `h${level}`,
      attrs: { lvl: level, tag: `h${level}` },
    }));
  },

  renderHTML({ node, HTMLAttributes }) {
    const hasLevel = this.options.levels.includes(node.attrs.level);
    const level = hasLevel ? node.attrs.level : this.options.levels[0];

    return [
      `h${level}`,
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        tag: 'h' + level,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setHeading:
        (attributes) =>
        ({ commands }) => {
          if (!this.options.levels.includes(attributes.level)) {
            return false;
          }
          attributes.tag = `h${attributes.level}`;
          return commands.setNode('heading', attributes);
        },
      toggleHeading:
        (attributes) =>
        ({ commands }) => {
          if (!this.options.levels.includes(attributes.level)) {
            return false;
          }
          attributes.tag = `h${attributes.level}`;
          return commands.toggleNode('heading', 'paragraph', attributes);
        },
    };
  },

  addKeyboardShortcuts() {
    return this.options.levels.reduce(
      (items, level) => ({
        ...items,
        ...{
          [`Mod-Alt-${level}`]: () =>
            this.editor.commands.toggleHeading({ level }),
        },
      }),
      {}
    );
  },

  addInputRules() {
    return this.options.levels.map((level) => {
      return textblockTypeInputRule(
        new RegExp(`^(#{1,${level}})\\s$`),
        this.type,
        { level }
      );
    });
  },

  addNodeView() {
    return VueNodeViewRenderer(Component);
  },
});
