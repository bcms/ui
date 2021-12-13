<script lang="tsx">
import { defineComponent } from '@vue/runtime-core';
import { DefaultComponentProps } from '../_default';
import InputWrapper from './_input.vue';
import Icon from '../icon.vue';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    value: Boolean,
    modelValue: Boolean,
    placeholder: String,
    label: String,
    invalidText: String,
    disabled: Boolean,
    helperText: String,
    description: String,
  },
  emits: {
    enter: () => {
      return true;
    },
    input: (_: boolean) => {
      return true;
    },
    'update:modelValue': (_: boolean) => {
      return true;
    },
  },
  setup(props, { emit }) {
    function handlerInput(event: Event) {
      const element = event.target as HTMLInputElement;
      if (!element) {
        return;
      }
      emit('input', element.checked);
    }

    function keydownHandler(event: KeyboardEvent) {
      const element = event.target as HTMLInputElement;
      if (!element) {
        return;
      }
      if (event.key === 'Enter') {
        emit('input', !element.checked);
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
          <div
            v-cy={props.cyTag}
            class={`_bcmsInput--checkbox ${
              props.disabled ? '_bcmsInput--checkbox_disabled' : ''
            }`}
          >
            <input
              id={props.label}
              type="checkbox"
              class="_bcmsInput--checkbox-input sr-only"
              checked={props.value}
              disabled={props.disabled}
              onChange={handlerInput}
              onKeydown={keydownHandler}
            />
            <span class="_bcmsInput--checkbox-icon">
              <Icon src="/checkmark" />
            </span>
            {props.description && (
              <span class="_bcmsInput--checkbox-description">
                {props.description}
              </span>
            )}
          </div>
        </InputWrapper>
      );
    };
  },
});

export default component;
</script>
