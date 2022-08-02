<script lang="tsx">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuidv4 } from 'uuid';
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onBeforeUpdate,
  onMounted,
  PropType,
} from 'vue';
import { EditorContent, useEditor } from '@tiptap/vue-3';
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
import type { Editor, JSONContent } from '@tiptap/core';
import type { BCMSEntryExtendedContent } from '../../types';
import { createBcmsSlashCommand } from './slash-command';
import { BCMSIcon } from '..';
import { useTranslation } from '../../translations';

const component = defineComponent({
  props: {
    id: { type: String, default: '' },
    content: {
      type: Object as PropType<BCMSEntryExtendedContent>,
      required: true,
    },
    lng: { type: String, default: '' },
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
    const middlewareId = `m${uuidv4().replace(/-/g, '')}`;
    const translations = computed(() => {
      return useTranslation();
    });
    const editor = getEditor();
    let lngBuffer = '';
    let idBuffer = '';

    window.bcms.editorLinkMiddleware[middlewareId] = (event) => {
      const el = event.currentTarget as HTMLLinkElement;
      window.bcms.modal.content.link.show({
        href: el.href,
        onDone(data) {
          if (data.href) {
            (editor.value as Editor)
              .chain()
              .focus()
              .extendMarkRange('link')
              .setLink({ href: data.href })
              .run();
          } else {
            (editor.value as Editor)
              .chain()
              .focus()
              .extendMarkRange('link')
              .unsetLink()
              .run();
          }
        },
      });
    };

    function getEditor() {
      return useEditor({
        content: {
          type: 'doc',
          content:
            props.content.nodes.length > 0
              ? props.content.nodes.map((e) => {
                  const a: JSONContent = JSON.parse(JSON.stringify(e));
                  if (
                    a.type === 'widget' &&
                    typeof (a.attrs as any).widget === 'string'
                  ) {
                    (a.attrs as any).widget = JSON.stringify(
                      (a.attrs as any).widget
                    );
                    (a.attrs as any).content = JSON.stringify(
                      (a.attrs as any).content
                    );
                  }
                  return a;
                })
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
                'paragraph relative text-base -tracking-0.01 leading-tight dark:text-light',
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
            openOnClick: false,
            HTMLAttributes: {
              onclick: `bcms.editorLinkMiddleware.${middlewareId}(event)`,
              class: 'text-green cursor-pointer bcmsUrlPreview',
            },
          }),
          Underline.configure({
            HTMLAttributes: {
              class: 'underline',
            },
          }),
          Placeholder.configure({
            placeholder:
              translations.value.page.entry.editor.placeholder.placeholder,
            showOnlyWhenEditable: false,
            showOnlyCurrent: false,
          }),
          BCMSWidget,
        ],
      });
    }
    async function create() {
      lngBuffer = props.lng || '';
      idBuffer = props.id;
      const maxTime = Date.now() + 10000;
      await throwable(async () => {
        await window.bcms.sdk.widget.getAll();
      });
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
    }
    function findDraggableParent(el: HTMLElement): HTMLElement | null {
      if (el.id === 'widget_wrapper') {
        return el;
      }
      const parent = el.parentNode as HTMLElement;
      if (parent) {
        return findDraggableParent(parent);
      }
      return null;
    }

    onMounted(async () => {
      await create();
      if (editor.value) {
        editor.value.on('focus', (event) => {
          const el = findDraggableParent(
            event.event.currentTarget as HTMLElement
          );
          if (el) {
            el.setAttribute('draggable', 'false');
          }
        });
        editor.value.on('blur', (event) => {
          const el = findDraggableParent(
            event.event.currentTarget as HTMLElement
          );
          if (el) {
            el.setAttribute('draggable', 'true');
          }
        });
      }
    });
    onBeforeUpdate(async () => {
      if (lngBuffer !== props.lng || idBuffer !== props.id) {
        if (editor.value) {
          editor.value.commands.clearContent();
          setTimeout(async () => {
            (editor as any).value.commands.setContent({
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
          }, 20);
        }
      }
    });
    onBeforeUnmount(() => {
      if (editor.value) {
        editor.value.destroy();
      }
      if (window.bcms.editorLinkMiddleware[middlewareId]) {
        delete window.bcms.editorLinkMiddleware[middlewareId];
      }
    });

    return () => (
      <div class={`relative ${rootClass}`}>
        <Toolbar
          class="relative text-grey flex items-center bg-white min-w-max rounded-2.5 p-0.5 shadow-cardLg desktop:absolute desktop:bottom-2.5"
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
