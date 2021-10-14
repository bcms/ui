<script lang="tsx">
import {
  defineComponent,
  onBeforeUnmount,
  onMounted,
  PropType,
} from '@vue/runtime-core';
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
import { Editor } from '@tiptap/core';
import { BCMSEntryExtendedContent } from '../../types';
import { createBcmsSlashCommand } from './slash-command';

const component = defineComponent({
  props: {
    id: { type: String, default: '' },
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
    const throwable = window.bcms.util.throwable;
    const editor = getEditor();

    function getEditor() {
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
              class: 'listItem relative mb-5 pl-5 last:mb-0',
            },
          }),
          CodeBlock.configure({
            HTMLAttributes: {
              class:
                'code mb-12 relative bg-dark bg-opacity-5 text-dark p-4 font-semibold text-xs rounded-2.5 md:mb-10',
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
        window.bcms.editor = undefined;
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

<style lang="scss">
.ProseMirror {
  @apply focus:outline-none;
  & > .paragraph {
    @apply mb-12 md:mb-10;
  }
  & * {
    &:not(div) {
      &::before {
        @apply hidden;
      }
    }
  }
  & > * {
    &:not(div) {
      &::before {
        content: '';
        @apply absolute top-0 left-0 w-8 h-8 block bg-no-repeat bg-center -translate-x-1.5 -translate-y-full md:-translate-x-full md:translate-y-[-20%];
        background-size: 65%;
      }
    }
  }
}
.bcmsContentEditor {
  &--content {
    .heading {
      &:is(h1) {
        @apply text-12.5 -tracking-0.03;
        &::before {
          background-image: url('/assets/icons/editor/heading/h1-fill.svg');
        }
      }
      &:is(h2) {
        @apply text-9.5 -tracking-0.03;
        &::before {
          background-image: url('/assets/icons/editor/heading/h2-fill.svg');
        }
      }
      &:is(h3) {
        @apply text-7 -tracking-0.01;
        &::before {
          background-image: url('/assets/icons/editor/heading/h3-fill.svg');
        }
      }
      &:is(h4) {
        @apply text-2xl -tracking-0.01;
        &::before {
          background-image: url('/assets/icons/editor/heading/h4-fill.svg');
        }
      }
      &:is(h5) {
        @apply text-xl -tracking-0.01;
        &::before {
          background-image: url('/assets/icons/editor/heading/h5-fill.svg');
        }
      }
      &:is(h6) {
        @apply text-base -tracking-0.01;
        &::before {
          background-image: url('/assets/icons/editor/heading/h6-fill.svg');
        }
      }
    }
    .paragraph {
      &::before {
        background-image: url('/assets/icons/editor/text-fill.svg');
      }
      &.is-empty {
        &::after {
          content: attr(data-placeholder);
          @apply absolute top-0 left-0 flex text-grey pointer-events-none;
        }
      }
    }
    .unorderedList {
      &::before {
        background-image: url('/assets/icons/editor/list-ul-fill.svg');
      }
      .listItem {
        &::after {
          content: '';
          @apply absolute top-1.5 left-0 w-1 h-1 rounded-full bg-dark bg-opacity-50;
        }
      }
      .unorderedList {
        @apply mb-0 mt-2;
      }
    }
    .orderedList {
      counter-reset: section;
      &::before {
        background-image: url('/assets/icons/editor/list-ol-fill.svg');
      }
      .listItem {
        &::after {
          counter-increment: section;
          content: counter(section);
          @apply absolute top-0.5 left-0 text-xs font-semibold text-dark text-opacity-50;
        }
      }
      .orderedList {
        @apply mb-0 mt-2;
      }
    }
  }
  .textDropdown {
    &--inner {
      &::before {
        content: '';
        @apply absolute top-0 left-4 w-3 h-3 bg-white rotate-45 -translate-y-1/2;
      }
    }
  }
}
</style>
