<script lang="tsx">
import { defineComponent, PropType, ref } from 'vue';
import InputWrapper from '../_input.vue';
import BCMSMultiAddItem from './item.vue';
import { DefaultComponentProps } from '../../_default';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    value: {
      type: Array as PropType<string[]>,
      required: true,
    },
    placeholder: String,
    label: String,
    invalidText: String,
    helperText: String,
    disabled: {
      type: Boolean,
      default: false,
    },
    format: Function as PropType<(value: string) => string>,
    validate: Function as PropType<(value: string[]) => string | null>,
    onInput: Function as PropType<(value: string[]) => void | Promise<void>>,
  },
  emits: {
    input: (_value: string[]) => {
      return true;
    },
  },
  setup(props, ctx) {
    const items = ref(props.value);
    const invalidText = ref(props.invalidText);

    function handleInput(event: Event | KeyboardEvent) {
      const element = event.target as HTMLInputElement;
      if (!element) {
        return;
      }
      if ((event as KeyboardEvent).key === 'Enter' && element.value) {
        if (typeof props.validate === 'function') {
          const error = props.validate([...items.value, element.value]);
          if (error) {
            invalidText.value = error;
            return;
          }
        }
        items.value = [...items.value, element.value];
        element.value = '';
        ctx.emit('input', items.value);
      } else {
        if (typeof props.format === 'function') {
          element.value = props.format(element.value);
        }
      }
    }

    return () => (
      <InputWrapper
        class={props.class}
        label={props.label}
        invalidText={props.invalidText ? props.invalidText : invalidText.value}
        helperText={props.helperText}
      >
        <input
          id={props.label}
          class="_bcmsInput--text"
          placeholder={props.placeholder}
          disabled={props.disabled}
          onChange={handleInput}
          onKeyup={handleInput}
        />
        <div class="_bcmsInput--multiAdd">
          <ul>
            {items.value.map((item) => (
              <BCMSMultiAddItem
                item={item}
                disabled={props.disabled}
                onRemove={() => {
                  items.value = items.value.filter((e) => e !== item);
                  ctx.emit('input', items.value);
                }}
              />
            ))}
          </ul>
        </div>
      </InputWrapper>
    );
  },
});
export default component;
</script>
