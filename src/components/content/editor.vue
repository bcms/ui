<script lang="tsx">
import {
  defineComponent,
  onBeforeUnmount,
  onMounted,
  PropType,
} from '@vue/runtime-core';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import Document from '@tiptap/extension-document';
import Text from '@tiptap/extension-text';
import ListItem from '@tiptap/extension-list-item';
import HardBreak from '@tiptap/extension-hard-break';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import History from '@tiptap/extension-history';
import Placeholder from '@tiptap/extension-placeholder';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Toolbar from './toolbar.vue';
import Paragraph from '@tiptap/extension-paragraph';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Heading from '@tiptap/extension-heading';
import CodeBlock from '@tiptap/extension-code-block';
import Dropcursor from '@tiptap/extension-dropcursor';
import BCMSWidget from './widget';
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
                  },
                });
                return true;
              },
            };
          },
        }),
        Dropcursor,
        Paragraph.configure({
          HTMLAttributes: {
            class: 'paragraph text-base -tracking-0.01 leading-tight',
            icon: '/editor/text',
          },
        }),
        Text.configure({
          HTMLAttributes: {
            class: 'text',
          },
        }),
        BulletList.configure({
          HTMLAttributes: {
            class: 'unorderedList mb-10 list-none',
            icon: '/editor/list-ul',
          },
        }),
        ListItem.configure({
          HTMLAttributes: {
            class: 'listItem relative mb-5 pl-5 last:mb-0',
          },
        }),
        CodeBlock.configure({
          HTMLAttributes: {
            class:
              'code mb-10 relative bg-dark bg-opacity-5 text-dark p-4 font-semibold text-xs rounded-2.5',
            icon: '/editor/code',
          },
        }),
        HardBreak.configure({
          HTMLAttributes: {
            class: 'break',
          },
        }),
        Heading.configure({
          HTMLAttributes: {
            class: 'heading mb-10',
          },
        }),
        HorizontalRule.configure({
          HTMLAttributes: {
            class: 'horizontalLine',
          },
        }),
        OrderedList.configure({
          HTMLAttributes: {
            class: 'orderedList mb-10 list-none',
            icon: '/editor/list-ol',
          },
        }),
        History,
        Bold.configure({
          HTMLAttributes: {
            class: 'font-bold',
          },
        }),
        Italic.configure({
          HTMLAttributes: {
            class: 'italic',
          },
        }),
        Strike.configure({
          HTMLAttributes: {
            class: 'line-through',
          },
        }),
        Link.configure({
          HTMLAttributes: {
            class: 'text-green cursor-pointer',
          },
        }),
        Underline.configure({
          HTMLAttributes: {
            class: 'underline',
          },
        }),
        Placeholder.configure({
          placeholder: 'Click and start typing here',
          showOnlyWhenEditable: false,
          showOnlyCurrent: false,
        }),
        BCMSWidget,
      ],
    });

    (window as any).editor = editor;

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
        <div class="text-dark text-7 leading-1.07 -tracking-0.01 mb-10 select-none">
          Content
        </div>
        <Toolbar
          class="relative text-grey flex items-center bg-white min-w-max rounded-2.5 p-0.5 shadow-cardLg"
          editor={editor.value}
        />
        <EditorContent class={`${rootClass}--content`} editor={editor.value} />
        <button
          onClick={() => {
            console.log(editor.value?.getJSON());
          }}
        >
          Save
        </button>
      </div>
    );
  },
});
export default component;
</script>
