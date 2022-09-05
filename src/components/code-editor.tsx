import { defineComponent, onBeforeUpdate, onMounted, PropType, ref } from 'vue';
import type { Editor } from 'codemirror';
import CodeMirror from 'codemirror';
import { codeMirrorInitJs } from './codemirror-langs/javascript';
import { DefaultComponentProps } from './_default';

const cm = CodeMirror;

codeMirrorInitJs(cm);

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
    change: (_code: string) => {
      return true;
    },
  },
  setup(props, ctx) {
    const element = ref<HTMLDivElement | null>(null);

    let editor: Editor;

    onMounted(() => {
      if (element.value) {
        editor = cm(element.value, {
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
      return <div ref={element} class={`bcmsCodeEditor ${props.class}`} />;
    };
  },
});
export default component;
