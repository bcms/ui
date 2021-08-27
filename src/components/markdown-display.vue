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
        class={`markdownBoxDisplay ${props.class}`}
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
