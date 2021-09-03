import BulletList from '@tiptap/extension-bullet-list';
import { Attributes, VueNodeViewRenderer } from '@tiptap/vue-3';
import Component from './node-wrapper.vue';

export const BCMSBulletList = BulletList.extend({
  addAttributes() {
    const att: Attributes = {
      tag: {
        default: 'ul',
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
