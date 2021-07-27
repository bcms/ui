<script lang="tsx">
import { computed, defineComponent, PropType } from 'vue';
import { DefaultComponentProps } from '../_default';
import InputWrapper from './_input.vue';
import BCMSIcon from '../icon.vue';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    value: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
    invalidText: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    includeTime: {
      type: Boolean,
      default: false,
    },
    helperText: {
      type: String,
      default: '',
    },
    onInput: Function as PropType<(value: number) => void | Promise<void>>,
    onEnter: Function as PropType<() => void | Promise<void>>,
  },
  emits: {
    input: (_value: number) => {
      return true;
    },
    enter: () => {
      return true;
    },
  },
  setup(props, ctx) {
    const dateAsString = computed(() => {
      return props.value ? toDate(props.value) : toDate(0);
    });

    function toDate(millis: number): string {
      const date = new Date(millis);
      return `${date.getFullYear()}-${
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1
      }-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;
    }
    function handlerInput(event: Event) {
      const element = event.target as HTMLInputElement;
      const value = !element.valueAsNumber ? 0 : element.valueAsNumber;
      ctx.emit('input', value);
      if ((event as KeyboardEvent).key === 'Enter') {
        ctx.emit('enter');
      }
    }

    return () => (
      <InputWrapper
        class={props.class}
        label={props.label}
        invalidText={props.invalidText}
        helperText={props.helperText}
      >
        <div
          v-cy={props.cyTag}
          class={`_bcmsInput--date ${
            props.includeTime ? '_bcmsInput--date_time' : ''
          }`}
        >
          <div class="_bcmsInput--date-wrapper">
            <input
              id={props.label}
              class="_bcmsInput--text date"
              type="date"
              value={dateAsString.value}
              disabled={props.disabled}
              onChange={(event) => {
                handlerInput(event);
              }}
              onKeyup={(event) => {
                handlerInput(event);
              }}
            />
            <button
              aria-label="Reset date"
              title="Reset date"
              class="_bcmsInput--date-reset"
              disabled={props.disabled}
              onClick={() => {
                ctx.emit('input', 0);
              }}
            >
              <BCMSIcon src="/close" />
            </button>
          </div>
          {props.includeTime ? (
            <div class="_bcmsInput--date-wrapper">
              <input
                class="_bcmsInput--text time"
                disabled={props.disabled}
                type="time"
              />
              <button
                aria-label="Reset date"
                title="Reset date"
                disabled={props.disabled}
                class="_bcmsInput--date-reset"
              >
                <BCMSIcon src="/close" />
              </button>
            </div>
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
