<script lang="tsx">
import { defineComponent, ref } from 'vue';
import BCMSIcon from '../icon.vue';
import InputWrapper from './_input.vue';

const component = defineComponent({
  props: {
    class: String,
    value: String,
    modelValue: String,
    placeholder: String,
    label: String,
    invalidText: String,
    disabled: Boolean,
    helperText: String,
  },
  emits: {
    input: (value: string) => {
      return value;
    },
    enter: (_?: unknown) => {
      return _;
    },
    'update:modelValue': (value: string) => {
      return value;
    },
  },
  setup(props, ctx) {
    const showRef = ref(false);
    function inputHandler(event: Event) {
      const element = event.target as HTMLInputElement;
      if (!element) return;
      ctx.emit('update:modelValue', element.value);
      ctx.emit('input', element.value);
    }
    return () => {
      return (
        <InputWrapper
          class={props.class}
          label={props.label}
          invalidText={props.invalidText}
          helperText={props.helperText}
        >
          <div class="_bcmsInput--password">
            <input
              id={props.label}
              class="_bcmsInput--text"
              placeholder={props.placeholder}
              value={props.value ? props.value : props.modelValue}
              type={showRef.value ? 'text' : 'password'}
              disabled={props.disabled}
              onChange={inputHandler}
              onKeyup={(event) => {
                inputHandler(event);
                if (event.key === 'Enter' && props.onEnter) {
                  props.onEnter();
                }
              }}
            />
            <button
              class="_bcmsInput--password-toggle"
              type="button"
              disabled={props.disabled}
              onClick={() => {
                showRef.value = !showRef.value;
              }}
            >
              {showRef.value ? (
                <BCMSIcon src="/eye/show" />
              ) : (
                <BCMSIcon src="/eye/hide" />
              )}
            </button>
          </div>
        </InputWrapper>
      );
    };
  },
});
export default component;
</script>
