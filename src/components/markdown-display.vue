<script lang="tsx">
import { defineComponent } from 'vue';
import { DefaultComponentProps } from './_default';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    markdown: String,
    fallbackText: {
      type: String,
      default: '',
    },
  },
  emits: {
    edit: () => {
      return true;
    },
  },
  setup(props, ctx) {
    const markdownService = window.bcms.markdown;
    return () => (
      <div
        id={props.id}
        class={`markdownBoxDisplay text-grey text-base leading-tight -tracking-0.01 select-none cursor-default inline-block ${props.class}`}
        style={props.style}
        v-cy={props.cyTag ? props.cyTag : 'markdown-box-display'}
        v-html={markdownService.toHtml(
          props.markdown ? props.markdown : props.fallbackText
        )}
        onDblclick={() => {
          ctx.emit('edit');
        }}
      />
    );
  },
});
export default component;
</script>

<style lang="scss">
.markdownBoxDisplay {
  & > * {
    @apply mb-[5px];
  }
  ul,
  ol {
    @apply ml-[15px];
  }
  strong,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    @apply font-bold;
  }
  pre {
    @apply mt-[5px] mb-[7px] rounded-2.5 border border-dotted border-green p-2.5 text-xs;
  }
  table {
    @apply w-full border-collapse;
    thead {
      @apply text-green text-left;
      tr {
        @apply border-b border-grey border-opacity-50;
      }
    }
    td,
    th {
      @apply p-[5px];
    }
    tbody {
      tr {
        @apply border-b border-grey border-opacity-50;
      }
    }
  }
}
</style>
