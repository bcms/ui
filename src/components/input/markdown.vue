<script lang="tsx">
import { defineComponent, PropType } from 'vue';
import { DefaultComponentProps } from '../_default';
import InputWrapper from './_input.vue';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    value: String,
    modelValue: String,
    placeholder: String,
    label: String,
    invalidText: String,
    helperText: String,
    disabled: Boolean,
    onInput: Function as PropType<(value: string) => void>,
  },
  emits: {
    input: (_value: string) => {
      return true;
    },
    'update:modelValue': (_value: string) => {
      return true;
    },
  },
  setup(props, ctx) {
    function handleInput(event: Event) {
      const el = event.target as HTMLInputElement;
      if (!el) {
        return;
      }
      ctx.emit('input', el.value);
      ctx.emit('update:modelValue', el.value);
    }

    return () => (
      <InputWrapper
        class={props.class}
        label={props.label}
        invalidText={props.invalidText}
        helperText={props.helperText}
      >
        <div
          class={`_bcmsInput--markdown ${
            props.disabled ? '_bcmsInput--markdown_disabled' : ''
          }`}
        >
          <textarea
            rows={3}
            placeholder={props.placeholder}
            value={props.modelValue ? props.modelValue : props.value}
            id={props.label}
            onKeyup={handleInput}
            onChange={handleInput}
            class="_bcmsInput--textarea"
          />
        </div>
      </InputWrapper>
    );
  },
});
export default component;
</script>
