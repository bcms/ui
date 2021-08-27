<script lang="tsx">
import {
  defineComponent,
  onBeforeUnmount,
  onMounted,
  PropType,
} from '@vue/runtime-core';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import CodeBlock from '@tiptap/extension-code-block';
import HardBreak from '@tiptap/extension-hard-break';
import Heading from '@tiptap/extension-heading';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import History from '@tiptap/extension-history';
import Placeholder from '@tiptap/extension-placeholder';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Toolbar from './toolbar.vue';
import Widget from './widget';
import { Editor } from '@tiptap/core';
import { BCMSEntryExtendedContent, BCMSPropValueExtended } from '../../types';

const component = defineComponent({
  props: {
    content: {
      type: Object as PropType<BCMSEntryExtendedContent>,
      required: true,
    },
    allowedWidgetIds: Array as PropType<string[]>,
  },
  emits: {
    editorReady: (_: Editor) => {
      return true;
    },
  },
  setup(props, ctx) {
    const rootClass = 'bcmsContentEditor';
    const editor = useEditor({
      content: {
        type: 'doc',
        content: props.content.nodes,
      },
      extensions: [
        Document.extend({
          addKeyboardShortcuts() {
            return {
              'Mod-Shift-Enter': () => {
                window.bcms.modal.content.widget.show({
                  allowedIds: props.allowedWidgetIds,
                  async onDone({ widget }) {
                    const values: BCMSPropValueExtended[] = [];
                    for (let i = 0; i < widget.props.length; i++) {
                      const prop = widget.props[i];
                      const value = await window.bcms.prop.toPropValueExtended({
                        prop,
                      });
                      if (value) {
                        values.push(value);
                      }
                    }
                    (editor.value as Editor).chain().setWidget({
                      widget,
                      content: values,
                    });
                    // (editor.value as Editor)
                    //   .chain()
                    //   .focus()
                    //   .insertContent({
                    //     type: 'widget',
                    //     attrs: {
                    //       widget,
                    //       content: values,
                    //     },
                    //   })
                    //   // .toggleWrap('listItem')
                    //   .run();
                  },
                });
                return true;
              },
            };
          },
        }),
        Paragraph.configure({
          HTMLAttributes: {
            class: 'paragraph',
          },
        }),
        Text.configure({
          HTMLAttributes: {
            class: 'text',
          },
        }),
        BulletList.configure({
          HTMLAttributes: {
            class: 'unorderedList',
          },
        }),
        ListItem.configure({
          HTMLAttributes: {
            class: 'listItem',
          },
        }),
        CodeBlock.configure({
          HTMLAttributes: {
            class: 'code',
          },
        }),
        HardBreak.configure({
          HTMLAttributes: {
            class: 'break',
          },
        }),
        Heading.configure({
          HTMLAttributes: {
            class: 'heading',
          },
        }),
        HorizontalRule.configure({
          HTMLAttributes: {
            class: 'horizontalLine',
          },
        }),
        OrderedList.configure({
          HTMLAttributes: {
            class: 'orderedList',
          },
        }),
        History,
        Bold.configure({
          HTMLAttributes: {
            class: 'bold',
          },
        }),
        Italic.configure({
          HTMLAttributes: {
            class: 'italic',
          },
        }),
        Strike.configure({
          HTMLAttributes: {
            class: 'stripe',
          },
        }),
        Link.configure({
          HTMLAttributes: {
            class: 'link',
          },
        }),
        Underline.configure({
          HTMLAttributes: {
            class: 'underline',
          },
        }),
        Placeholder.configure({
          placeholder: 'Click and start typing here',
        }),
        Widget,
      ],
    });

    onMounted(() => {
      const maxTime = Date.now() + 10000;
      function checkEditorCallback() {
        if (maxTime < Date.now()) {
          console.error('Content editor ready timeout of 10s excide.');
        }
        if (editor.value) {
          ctx.emit('editorReady', editor.value);
        } else {
          setTimeout(checkEditorCallback, 100);
        }
      }
      if (!editor.value) {
        setTimeout(checkEditorCallback);
      } else {
        ctx.emit('editorReady', editor.value);
      }
    });
    onBeforeUnmount(() => {
      if (editor.value) {
        editor.value.destroy();
      }
    });

    return () => (
      <div class={rootClass}>
        <button
          onClick={() => {
            console.log(editor.value?.getJSON());
          }}
        >
          Save
        </button>
        <Toolbar class={`${rootClass}--toolbar`} editor={editor.value} />
        <EditorContent class={`${rootClass}--content`} editor={editor.value} />
      </div>
    );
  },
});
export default component;
</script>
