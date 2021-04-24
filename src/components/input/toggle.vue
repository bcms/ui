<script lang="tsx">
import { defineComponent, PropType, ref } from 'vue';
import { DefaultComponentProps } from '../_default';
import InputWrapper from './_input.vue';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    label: String,
    modelValue: Boolean,
    value: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    states: Object as PropType<[string, string]>,
    helperText: String,
    onInput: Function as PropType<(value: boolean) => void | Promise<void>>,
  },
  emits: {
    input: (_value: boolean) => {
      return true;
    },
    'update:modelValue': (value?: boolean) => {
      return true;
    },
  },
  setup(props, ctx) {
    const state = ref(getState());

    function getState() {
      return typeof props.modelValue === 'boolean'
        ? props.modelValue
        : props.value;
    }
    function keyDownHandler(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        state.value = !state.value;
        ctx.emit('input', state.value);
        ctx.emit('update:modelValue', state.value);
      }
    }

    return () => (
      <InputWrapper
        class={`_bcmsInput--toggle_contentWidth ${props.class}`}
        label={props.label}
        helperText={props.helperText}
        onClick={() => {
          if (!props.disabled) {
            state.value = !state.value;
            ctx.emit('input', state.value);
            ctx.emit('update:modelValue', state.value);
          }
        }}
      >
        <div
          id={props.label}
          class="_bcmsInput--toggle"
          tabindex="0"
          onKeydown={keyDownHandler}
        >
          <span
            class={`_bcmsInput--toggle-inner ${
              state.value ? '_bcmsInput--toggle-inner_checked' : ''
            } ${props.disabled ? '_bcmsInput--toggle-inner_disabled' : ''}`}
          >
            <span class="circle" />
          </span>
          {props.states && props.states.length === 2 ? (
            <span class="_bcmsInput--toggle-state">
              {state.value ? props.states[0] : props.states[1]}
            </span>
          ) : (
            ''
          )}
        </div>
      </InputWrapper>
    );
  },
});
export default component;
</script>
