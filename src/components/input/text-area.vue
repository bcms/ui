<script lang="tsx">
import { defineComponent, PropType, ref } from 'vue';
import InputWrapper from './_input.vue';

const component = defineComponent({
  props: {
    class: {
      type: String,
      default: '',
    },
    modelValue: String,
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    invalidText: {
      type: String,
      default: '',
    },
    helperText: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    minHeight: {
      type: Number,
      default: 44,
    },
    onInput: Function as PropType<(value: string) => void>,
  },
  emits: {
    input: (value: string) => {
      return value;
    },
    'update:modelValue': (value?: string) => {
      return value;
    },
  },
  setup(props, ctx) {
    const height = ref(props.minHeight);
    const logic = {
      inputHandler(event: Event) {
        const element = event.target as HTMLTextAreaElement;
        if (!element) {
          return;
        }
        ctx.emit('input', element.value);
      },
      handleHeight(event: Event) {
        const element = event.target as HTMLInputElement;
        if (!element) {
          return;
        }
        height.value = Math.min(element.scrollHeight);
      },
    };

    return () => {
      return (
        <InputWrapper
          class={props.class}
          label={props.label}
          invalidText={props.invalidText}
          helperText={props.helperText}
        >
          <textarea
            class="_bcmsInput--textarea"
            onChange={logic.inputHandler}
            onInput={logic.handleHeight}
            placeholder={props.placeholder}
            value={props.value ? props.value : props.modelValue}
            disabled={props.disabled}
            style={`min-height: ${props.minHeight}px; height: ${height.value}px`}
          />
        </InputWrapper>
      );
    };
  },
});
export default component;
</script>
