<script lang="tsx">
import { defineComponent } from 'vue';
import InputWrapper from './_input.vue';

const component = defineComponent({
  inheritAttrs: true,
  props: {
    class: String,
    value: Number,
    modelValue: Number,
    placeholder: String,
    label: String,
    invalidText: String,
    disabled: Boolean,
    helperText: String,
  },
  emits: {
    enter: () => {
      return true;
    },
    input: (_: number) => {
      return true;
    },
    'update:modelValue': (_: number) => {
      return true;
    },
  },
  setup(props, ctx) {
    function inputHandler(event: Event) {
      const element = event.target as HTMLInputElement;
      if (!element) {
        return;
      }
      let val = element.value.replace(/[^0-9.-.]+/g, '');
      const dotParts = val.split('.');
      if (dotParts.length > 2) {
        val = dotParts.slice(0, 2).join('.');
      }
      element.value = val;
      const output = parseFloat(val);
      if (isNaN(output)) {
        ctx.emit('update:modelValue', 0);
        ctx.emit('input', 0);
      } else {
        ctx.emit('update:modelValue', output);
        ctx.emit('input', output);
      }
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
