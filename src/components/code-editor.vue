<script lang="tsx">
import { defineComponent, onBeforeUpdate, onMounted, PropType, ref } from 'vue';
import CodeMirror, { Editor } from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import { DefaultComponentProps } from './_default';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    mode: {
      type: String as PropType<'javascript'>,
      default: 'javascript',
    },
    code: {
      type: String,
      default: '',
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    change(code: string) {
      return code;
    },
  },
  setup(props, ctx) {
    const element = ref<HTMLDivElement | null>(null);

    let editor: Editor;

    onMounted(() => {
      if (element.value) {
        editor = CodeMirror(element.value, {
          value: props.code,
          mode: props.mode,
          lineNumbers: true,
          lineWrapping: false,
          theme: 'neo',
          tabSize: 2,
          autocorrect: true,
          smartIndent: true,
          readOnly: props.readOnly,
        });
        editor.on('change', () => {
          ctx.emit('change', editor.getValue());
        });
      }
    });
    onBeforeUpdate(() => {
      if (editor && props.code !== editor.getValue()) {
        editor.setValue(props.code);
      }
    });

    return () => {
      return <div ref={element} class={`codeEditor ${props.class}`} />;
    };
  },
});
export default component;
</script>
