<script lang="tsx">
import { defineComponent, onBeforeUpdate, onMounted, PropType, ref } from 'vue';
import CodeMirror from 'codemirror';
import type { Editor } from 'codemirror';
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
    onChange: Function as PropType<(value: string) => void | Promise<void>>,
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
      if (editor) {
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
