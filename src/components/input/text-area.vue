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
    format: Function as PropType<(value: string) => string>,
  },
  emits: {
    input: (_: string) => {
      return true;
    },
    'update:modelValue': (_?: string) => {
      return true;
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
        if (props.format) {
          element.value = props.format(element.value);
        }
        ctx.emit('update:modelValue', element.value);
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
            class={`relative block w-full bg-white border rounded-3.5 transition-all duration-300 shadow-none font-normal not-italic text-base leading-tight -tracking-0.01 text-dark h-11 py-0 px-4.5 outline-none placeholder-grey placeholder-opacity-100 pt-3 pb-[9px] pl-4.5 resize-none top-0 left-0 overflow-hidden hover:shadow-input focus-within:shadow-input ${
              props.invalidText
                ? 'border-red hover:border-red focus-within:border-red pr-11'
                : 'pr-6'
            } ${
              props.invalidText
                ? ''
                : 'border-grey hover:border-grey hover:border-opacity-50 focus-within:border-grey focus-within:border-opacity-50'
            } ${
              props.disabled
                ? 'cursor-not-allowed opacity-40 shadow-none border-grey'
                : 'cursor-auto'
            }`}
            onChange={(event) => {
              logic.inputHandler(event);
            }}
            onKeyup={(event) => {
              logic.inputHandler(event);
            }}
            // onInput={logic.handleHeight}
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
