import { VueNodeViewRenderer } from '@tiptap/vue-3';
import { Heading } from '@tiptap/extension-heading';
import Wrapper from './_wrapper.vue';

export const BCMSHeading = Heading.extend({
  addAttributes() {
    return {
      level: {
        default: 1,
        rendered: false,
      },
      ...Object.keys(this.options.HTMLAttributes).reduce((output, key) => {
        const o: {
          [name: string]: {
            default: string;
          };
        } = {} as never;
        o[key] = {
          default: this.options.HTMLAttributes[key],
        };
        return {
          ...output,
          ...o,
        };
      }, {}),
    };
  },
  addNodeView() {
    return VueNodeViewRenderer(Wrapper);
  },
  // addCommands() {
  //   return {
  //     setHeading:
  //       (attributes) =>
  //       ({ commands }) => {
  //         if (!this.options.levels.includes(attributes.level)) {
  //           return false;
  //         }

  //         return commands.setNode('heading', attributes);
  //       },
  //     toggleHeading:
  //       (attributes) =>
  //       ({ commands }) => {
  //         if (!this.options.levels.includes(attributes.level)) {
  //           return false;
  //         }
  //         return commands.toggleNode('heading', 'paragraph', attributes);
  //       },
  //   };
  // },
});
