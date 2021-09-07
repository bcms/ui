<script lang="tsx">
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  PropType,
} from '@vue/runtime-core';
import { useEditor, EditorContent, VueRenderer } from '@tiptap/vue-3';
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
import { CommandProps, Editor, Extension, Range } from '@tiptap/core';
import {
  BCMSEntryExtendedContent,
  BCMSPropValueExtended,
  SlashCommandItem,
} from '../../types';
import Commands from './slash-command';
import CommandsList from './slash-command-list.vue';
import tippy, { Instance, Props } from 'tippy.js';
import { useThrowable } from '../../util';
import { SuggestionProps } from '@tiptap/suggestion';

interface CommandData {
  editor: CommandProps;
  range: Range;
}

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
    const store = window.bcms.sdk.store;
    const throwable = useThrowable();

    const widgets = computed(() => {
      return store.getters.widget_items;
    });

    const editor = useEditor({
      content: {
        type: 'doc',
        content: props.content.nodes,
      },
      extensions: [
        Document,
        (Commands as Extension).configure({
          suggestion: {
            items: (query: string) => {
              const headings = new Array(6).fill({}).map((_, index) => {
                return {
                  title: `Heading ${index + 1}`,
                  icon: `/editor/heading/h${index + 1}`,
                  command: (data: CommandData) => {
                    data.editor
                      .chain()
                      .focus()
                      .deleteRange(data.range)
                      .setNode('heading', { level: index + 1 })
                      .run();
                  },
                };
              });

              const wdgts: Array<SlashCommandItem> = [];

              for (let i = 0; i < widgets.value.length; i++) {
                const widget = widgets.value[i];
                const values: BCMSPropValueExtended[] = [];
                for (let j = 0; j < widget.props.length; j++) {
                  const prop = widget.props[j];
                  window.bcms.prop
                    .toPropValueExtended({
                      prop,
                    })
                    .then((value) => {
                      if (value) {
                        values.push(value);
                      }
                    });
                }

                wdgts.push({
                  title: `${widget.name}`,
                  widget: true,
                  icon: `/administration/widget`,
                  command: () => {
                    (editor.value as Editor).chain().setWidget({
                      widget,
                      content: values,
                    });
                  },
                });
              }

              return [
                ...headings,
                {
                  title: 'Paragraph',
                  icon: '/editor/text',
                  command: (data: CommandData) => {
                    data.editor
                      .chain()
                      .focus()
                      .deleteRange(data.range)
                      .setNode('paragraph')
                      .run();
                  },
                },
                {
                  title: 'Bullet List',
                  icon: '/editor/list-ul',
                  command: (data: CommandData) => {
                    data.editor
                      .chain()
                      .focus()
                      .deleteRange(data.range)
                      .toggleBulletList()
                      .run();
                  },
                },
                {
                  title: 'Ordered List',
                  icon: '/editor/list-ol',
                  command: (data: CommandData) => {
                    data.editor
                      .chain()
                      .focus()
                      .deleteRange(data.range)
                      .toggleOrderedList()
                      .run();
                  },
                },
                {
                  title: 'Code Block',
                  icon: '/editor/code',
                  command: (data: CommandData) => {
                    data.editor
                      .chain()
                      .focus()
                      .deleteRange(data.range)
                      .setNode('codeBlock')
                      .run();
                  },
                },
                ...wdgts,
              ].filter((item) =>
                item.title.toLowerCase().startsWith(query.toLowerCase())
              );
            },
            render: () => {
              let _component: VueRenderer;
              let popup: Instance<Props>[];

              return {
                onStart: (_props: SuggestionProps) => {
                  _component = new VueRenderer(CommandsList, {
                    props: _props,
                    editor: _props.editor,
                  });

                  popup = tippy('body', {
                    getReferenceClientRect: _props.clientRect,
                    appendTo: () => document.body,
                    content: _component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual',
                    placement: 'bottom-start',
                  });
                },
                onUpdate(_props: any) {
                  _component.updateProps(_props);

                  popup[0].setProps({
                    getReferenceClientRect: _props.clientRect,
                  });
                },
                onKeyDown(_props: any) {
                  if (_props.event.key === 'Escape') {
                    popup[0].hide();

                    return true;
                  }
                  return _component.ref?.onKeyDown(_props);
                },
                onExit() {
                  popup[0].destroy();
                  _component.destroy();
                },
              };
            },
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

    onMounted(async () => {
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
      </div>
    );
  },
});
export default component;
</script>
