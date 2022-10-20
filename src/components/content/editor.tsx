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
import Toolbar from './toolbar';
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
  BCMSMediaType,
  BCMSSocketSyncChangeDataProp,
  BCMSSocketSyncChangeType,
} from '@becomes/cms-sdk/types';
import { BCMSContentProvider } from './provider';
import { BCMSInlineCodeMark } from './marks';

const component = defineComponent({
  props: {
    id: { type: String, default: '' },
    content: {
      type: Object as PropType<BCMSEntryExtendedContent>,
      required: true,
    },
    lng: { type: String, default: 'en' },
    lngIndex: { type: Number, default: 0 },
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
    let linkHoverEl: HTMLElement | null = null;

    window.bcms.editorLinkMiddleware[middlewareId] = (event) => {
      const el = event.currentTarget as HTMLLinkElement;
      const href = el.getAttribute('href') as string;
      if (linkHoverEl) {
        document.body.removeChild(linkHoverEl);
      }
      window.bcms.modal.content.link.show({
        href,
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
    window.bcms.editorLinkMiddleware[middlewareId + '_me'] = async (event) => {
      const el = event.target as HTMLLinkElement;
      const href = el.getAttribute('href') as string;
      const bb = el.getBoundingClientRect();
      linkHoverEl = document.createElement('div');
      if (href.startsWith('media:')) {
        const [id] = href.replace('media:', '').split('@*_');
        if (id) {
          await window.bcms.util.throwable(async () => {
            const media = await window.bcms.sdk.media.getById(id);
            if (media) {
              let src = '';
              if (
                media.type === BCMSMediaType.VID ||
                media.type === BCMSMediaType.GIF
              ) {
                src = `${window.bcms.origin}/api/media/${
                  media._id
                }/vid/bin/thumbnail?act=${window.bcms.sdk.storage.get('at')}`;
              } else {
                src = `${window.bcms.origin}/api/media/${
                  media._id
                }/bin/small/act?act=${window.bcms.sdk.storage.get('at')}`;
              }
              if (linkHoverEl) {
                linkHoverEl.innerHTML = `<div class="bcmsUrlPreview--hover-img"><img src="${src}" /></div>`;
              }
            }
          });
        }
      } else if (href.startsWith('entry:')) {
        await window.bcms.util.throwable(async () => {
          if (linkHoverEl) {
            const [eid, tid] = href.replace('entry:', '').split('@*_');
            const entry = await window.bcms.sdk.entry.getLite({
              templateId: tid,
              entryId: eid,
            });
            let meta = entry.meta.find((e) => e.lng === props.lng);
            if (!meta) {
              meta = entry.meta[0];
            }
            linkHoverEl.innerHTML = `<span class="bcmsUrlPreview--hover-text">${
              (meta.props[0].data as string[])[0]
            }</span>`;
          }
        });
      } else {
        linkHoverEl.innerHTML = `<span class="bcmsUrlPreview--hover-text">${href}</span>`;
      }
      linkHoverEl.setAttribute('class', 'bcmsUrlPreview--hover');
      linkHoverEl.setAttribute('style', 'opacity: 1;');
      setTimeout(() => {
        if (linkHoverEl) {
          linkHoverEl.setAttribute(
            'style',
            `opacity: 1; top: ${
              bb.y - 10 + document.body.scrollTop - linkHoverEl.offsetHeight
            }px; left: ${bb.x - linkHoverEl.offsetWidth / 4}px`
          );
        }
      }, 20);
      document.body.appendChild(linkHoverEl);
    };
    window.bcms.editorLinkMiddleware[middlewareId + '_ml'] = () => {
      if (linkHoverEl) {
        try {
          document.body.removeChild(linkHoverEl);
          linkHoverEl = null;
        } catch (error) {
          // do nothing
        }
      }
    };

    function getEditor() {
      return useEditor({
        content: {
          type: 'doc',
          content:
            props.content.nodes.length > 0
              ? props.content.nodes.map((node, index) => {
                  const jsonNode: JSONContent = JSON.parse(
                    JSON.stringify(node)
                  );
                  if (
                    jsonNode.type === 'widget' &&
                    typeof (jsonNode.attrs as any).widget !== 'string'
                  ) {
                    (jsonNode.attrs as any).widget = JSON.stringify(
                      (jsonNode.attrs as any).widget
                    );
                    (jsonNode.attrs as any).content = JSON.stringify(
                      (jsonNode.attrs as any).content
                    );
                    (jsonNode.attrs as any).basePath =
                      props.propPath + '.' + index;
                  }
                  return jsonNode;
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
            provider: new BCMSContentProvider(
              props.propPath + '',
              ydoc,
              props.entrySync as BCMSEntrySync
            ),
            user: {
              name: 'Bane',
              color: '#ff00ff',
            },
          }),
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
                'code mb-12 relative bg-dark bg-opacity-5 text-dark p-4 font-medium text-xs rounded-2.5 md:mb-10 dark:bg-opacity-20 dark:text-light dark:bg-darkGrey dark:bg-opacity-50 dark:border dark:border-grey dark:border-opacity-20',
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
              class:
                'heading mb-12 relative font-normal leading-none md:mb-10 dark:text-light',
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
          BCMSInlineCodeMark.configure({
            HTMLAttributes: {
              class: 'inlineCode',
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
              onmouseenter: `bcms.editorLinkMiddleware.${
                middlewareId + '_me'
              }(event)`,
              onmouseleave: `bcms.editorLinkMiddleware.${
                middlewareId + '_ml'
              }(event)`,
              class:
                'text-green cursor-pointer bcmsUrlPreview dark:text-yellow',
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
          if (event.sct === BCMSSocketSyncChangeType.PROP) {
            const data = event.data as BCMSSocketSyncChangeDataProp;
            if ((data as any).cu && data.p === props.propPath) {
              const cu = (data as any).cu;
              console.log(cu);
              if (ydoc) {
                if (cu.updates) {
                  Y.applyUpdate(ydoc, Uint8Array.from(cu.updates));
                } else if (cu.stateUpdate) {
                  const otherState = Uint8Array.from(cu.stateUpdate);
                  // const diff = Y.encodeStateAsUpdate(ydoc, otherStateVector);
                  Y.applyUpdate(ydoc, otherState);
                }
              }
            }
          } else if (event.sct === ('C' as never)) {
            console.log(event.data);
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
      if (props.entrySync) {
        const stateUpdate = Array.from(Y.encodeStateAsUpdate(ydoc));
        if (window.location.href.includes('test=bane')) {
          props.entrySync.emit.contentUpdate({
            propPath: props.propPath + '',
            languageCode: props.lng,
            languageIndex: props.lngIndex,
            data: {
              stateUpdate,
            } as any,
          });
        }
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
      if (entrySyncUnsub) {
        entrySyncUnsub();
      }
      if (editor.value) {
        editor.value.destroy();
      }
      if (window.bcms.editorLinkMiddleware[middlewareId]) {
        delete window.bcms.editorLinkMiddleware[middlewareId];
        delete window.bcms.editorLinkMiddleware[middlewareId + '_me'];
        delete window.bcms.editorLinkMiddleware[middlewareId + '_ml'];
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
              <BCMSIcon src="/alert-triangle" class="fill-current text-red" />
            </span>
          </div>
        )}
      </div>
    );
  },
});
export default component;
