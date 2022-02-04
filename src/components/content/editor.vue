<script lang="tsx">
import {
  defineComponent,
  onBeforeUnmount,
  onBeforeUpdate,
  onMounted,
  PropType,
  Ref,
} from 'vue';
import { EditorContent, useEditor, Editor as VueEditor } from '@tiptap/vue-3';
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
import { BCMSEntryExtendedContent } from '../../types';
import { createBcmsSlashCommand } from './slash-command';
import { BCMSIcon } from '..';

const component = defineComponent({
  props: {
    id: { type: String, default: '' },
    content: {
      type: Object as PropType<BCMSEntryExtendedContent>,
      required: true,
    },
    allowedWidgetIds: Array as PropType<string[]>,
    inMeta: { type: Boolean, default: false },
    invalidText: { type: String, default: '' },
  },
  emits: {
    editorReady: (_: Editor) => {
      return true;
    },
  },
  setup(props, ctx) {
    const rootClass = 'bcmsContentEditor';
    const throwable = window.bcms.util.throwable;
    const editor = getEditor();
    let lngBuffer = '';

    function getEditor(): Ref<VueEditor> {
      return useEditor({
        content: {
          type: 'doc',
          content:
            props.content.nodes.length > 0
              ? props.content.nodes
              : [
                  {
                    type: 'paragraph',
                    content: [],
                  },
                ],
        },
        extensions: [
          Document,
          createBcmsSlashCommand({ allowedWidgets: props.allowedWidgetIds }),
          Dropcursor,
          Paragraph.configure({
            HTMLAttributes: {
              class:
                'paragraph relative text-base -tracking-0.01 leading-tight',
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
              class: 'unorderedList relative mb-12 list-none md:mb-10',
              icon: '/editor/list-ul',
            },
          }),
          ListItem.extend({
            addAttributes() {
              return {
                list: {
                  default: true,
                },
              };
            },
          }).configure({
            HTMLAttributes: {
              class: 'listItem relative mb-3 pl-5 last:mb-0',
            },
          }),
          CodeBlock.configure({
            HTMLAttributes: {
              class:
                'code mb-12 relative bg-dark bg-opacity-5 text-dark p-4 font-medium text-xs rounded-2.5 md:mb-10',
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
              class: 'heading mb-12 relative font-normal leading-none md:mb-10',
            },
          }),
          HorizontalRule.configure({
            HTMLAttributes: {
              class: 'horizontalLine',
            },
          }),
          OrderedList.configure({
            HTMLAttributes: {
              class: 'orderedList relative mb-12 list-none md:mb-10',
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
    }
    async function create() {
      lngBuffer = props.content.lng;
      const maxTime = Date.now() + 10000;
      await throwable(async () => {
        await window.bcms.sdk.widget.getAll();
      });
      function checkEditorCallback() {
        console.log('editor', window.bcms.editor);
        if (maxTime < Date.now()) {
          console.error('Content editor ready timeout of 10s excide.');
        }
        if (editor.value) {
          window.bcms.editor = editor;
          ctx.emit('editorReady', editor.value);
        } else {
          setTimeout(checkEditorCallback, 100);
        }
      }
      if (!editor.value) {
        setTimeout(checkEditorCallback);
      } else {
        window.bcms.editor = editor;
        ctx.emit('editorReady', editor.value);
      }
    }

    onMounted(async () => {
      await create();
    });
    onBeforeUpdate(async () => {
      if (lngBuffer !== props.content.lng) {
        editor.value.commands.setContent({
          type: 'doc',
          content:
            props.content.nodes.length > 0
              ? props.content.nodes
              : [
                  {
                    type: 'paragraph',
                    content: [],
                  },
                ],
        });
        await create();
      }
    });
    onBeforeUnmount(() => {
      if (editor.value) {
        window.bcms.editor = undefined;
        editor.value.destroy();
      }
    });

    return () => (
      <div class={`relative ${rootClass}`}>
        {!props.inMeta && (
          <div class="text-dark text-7 leading-1.07 -tracking-0.01 mb-10 select-none">
            Content
          </div>
        )}
        <Toolbar
          class="relative text-grey flex items-center bg-white min-w-max rounded-2.5 p-0.5 shadow-cardLg 2xl:absolute 2xl:top-8"
          editor={editor.value}
        />
        <EditorContent
          class={`${rootClass}--content ${
            props.inMeta ? rootClass + '--content_meta' : ''
          } ${props.invalidText ? rootClass + '--content_error' : ''}`}
          editor={editor.value}
        />
        {props.invalidText && (
          <div
            class="absolute right-3 top-2.5 w-6 h-6 z-10"
            v-tooltip={props.invalidText}
          >
            <span>
              <BCMSIcon src="/alert-triangle" class="text-red fill-current" />
            </span>
          </div>
        )}
      </div>
    );
  },
});
export default component;
</script>
