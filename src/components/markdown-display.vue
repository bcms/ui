<script lang="tsx">
import { defineComponent, PropType } from 'vue';
import { DefaultComponentProps } from './_default';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    markdown: String,
    fallbackText: {
      type: String,
      default: '',
    },
    onEdit: Function as PropType<() => void | Promise<void>>,
  },
  emits: {
    edit: () => {
      return true;
    },
  },
  setup(props, ctx) {
    return () => (
      <div
        id={props.id}
        class={`markdownBoxDisplay ${props.class}`}
        style={props.style}
        v-cy={props.cyTag ? props.cyTag : 'markdown-box-display'}
        v-html={window.bcms.services.markdown.toHtml(
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
