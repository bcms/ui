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
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import BCMSWidget from './widget';
import type { Editor, JSONContent } from '@tiptap/core';
import type { BCMSEntryExtendedContent, BCMSEntrySync } from '../../types';
import { createBcmsSlashCommand } from './slash-command';
import { BCMSIcon } from '..';
import { useTranslation } from '../../translations';
import * as Y from 'yjs';
import {
  BCMSSocketSyncChangeDataProp,
  BCMSSocketSyncChangeType,
} from '@becomes/cms-sdk/types';
// import { BCMSContentProvider } from './provider';
import { WebrtcProvider } from 'y-webrtc';

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
    propPath: String,
    entrySync: Object as PropType<BCMSEntrySync>,
  },
  emits: {
    editorReady: (_editor: Editor, _ydoc: Y.Doc) => {
      return true;
    },
    updateContent: (_propPath: string, _update: number[]) => {
      return true;
    },
  },
  setup(props, ctx) {
    const ydoc = new Y.Doc();
    const rootClass = 'bcmsContentEditor';
    const throwable = window.bcms.util.throwable;
    const middlewareId = `m${uuidv4().replace(/-/g, '')}`;
    const translations = computed(() => {
      return useTranslation();
    });
    const editor = getEditor();
    let lngBuffer = '';
    let idBuffer = '';
    let entrySyncUnsub: () => void;

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
              ? props.content.nodes.map((e, index) => {
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
                    (a.attrs as any).basePath = props.propPath + '.' + index;
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
          History,
          Collaboration.configure({
            document: ydoc,
          }),
          CollaborationCursor.configure({
            // provider: new BCMSContentProvider(
            //   props.propPath || 'collab-cursor',
            //   ydoc
            // ),
            provider: new WebrtcProvider(`bcms-${props.propPath}`, ydoc),
            user: {
              name: 'Bane',
              color: '#ff0000',
            },
          }),
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
          ctx.emit('editorReady', editor.value, ydoc);
        } else {
          setTimeout(checkEditorCallback, 100);
        }
      }
      if (!editor.value) {
        setTimeout(checkEditorCallback);
      } else {
        ctx.emit('editorReady', editor.value, ydoc);
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
      if (props.entrySync) {
        entrySyncUnsub = props.entrySync.onChange((event) => {
          console.log({ p: props.propPath, event });
          if (event.sct === BCMSSocketSyncChangeType.PROP) {
            const data = event.data as BCMSSocketSyncChangeDataProp;
            if ((data as any).cu && data.p === props.propPath) {
              const cu = (data as any).cu;
              if (ydoc) {
                Y.applyUpdate(ydoc, Uint8Array.from(cu.updates));
              }
            }
          }
        });
      }
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
      ydoc.on('update', (updates) => {
        ctx.emit(
          'updateContent',
          props.propPath || 'none',
          Array.from(updates)
        );
      });
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
      if (entrySyncUnsub) {
        entrySyncUnsub();
      }
      if (editor.value) {
        editor.value.destroy();
      }
      if (window.bcms.editorLinkMiddleware[middlewareId]) {
        delete window.bcms.editorLinkMiddleware[middlewareId];
      }
    });

    return () => (
      <div class={`relative ${rootClass}`} data-bcms-prop-path={props.propPath}>
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
