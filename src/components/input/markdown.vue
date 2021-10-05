<script lang="tsx">
import { defineComponent } from 'vue';
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
          }  ${
            props.invalidText
              ? 'border border-red hover:border-red focus-within:border-red'
              : ''
          }`}
        >
          <textarea
            rows={3}
            placeholder={props.placeholder}
            value={props.modelValue ? props.modelValue : props.value}
            id={props.label}
            onKeyup={handleInput}
            onChange={handleInput}
            class={`relative block w-full bg-white rounded-3.5 transition-all duration-300 shadow-none font-normal not-italic text-base leading-tight -tracking-0.01 text-dark h-11 py-0 px-4.5 outline-none placeholder-grey placeholder-opacity-100 cursor-auto pt-3 pb-[9px] pl-4.5 resize-none top-0 left-0 overflow-hidden ${
              props.invalidText ? 'pr-11' : 'pr-6'
            } ${
              props.disabled ? 'cursor-not-allowed opacity-40 shadow-none' : ''
            }`}
          />
        </div>
      </InputWrapper>
    );
  },
});
export default component;
</script>
