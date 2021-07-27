<script lang="tsx">
import { defineComponent, PropType } from 'vue';
import InputWrapper from './_input.vue';

const component = defineComponent({
  inheritAttrs: true,
  props: {
    class: String,
    value: String,
    modelValue: String,
    placeholder: String,
    label: String,
    invalidText: String,
    disabled: Boolean,
    helperText: String,
    onInput: Function as PropType<(value: string) => void>,
    onEnter: Function as PropType<() => void>,
  },
  emits: {
    enter: () => {
      return true;
    },
    input: (_: string) => {
      return true;
    },
    'update:modelValue': (_: string) => {
      return true;
    },
  },
  setup(props, ctx) {
    function inputHandler(event: Event) {
      const element = event.target as HTMLInputElement;
      if (!element) {
        return;
      }
      ctx.emit('update:modelValue', element.value);
      ctx.emit('input', element.value);
    }
    return () => {
      return (
        <InputWrapper
          class={props.class}
          label={props.label}
          helperText={props.helperText}
          invalidText={props.invalidText}
        >
          <input
            id={props.label}
            class="_bcmsInput--text"
            placeholder={props.placeholder}
            value={props.value ? props.value : props.modelValue}
            disabled={props.disabled}
            onChange={inputHandler}
            onKeyup={(event) => {
              inputHandler(event);
              if (event.key === 'Enter') {
                ctx.emit('enter');
              }
            }}
          />
        </InputWrapper>
      );
    };
  },
});
export default component;
</script>
