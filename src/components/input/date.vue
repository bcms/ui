<script lang="tsx">
import { computed, defineComponent } from 'vue';
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
              class={`date relative block w-full bg-white border rounded-3.5 transition-all duration-300 shadow-none font-normal not-italic text-base leading-tight -tracking-0.01 text-dark h-11 py-0 px-4.5 outline-none placeholder-grey placeholder-opacity-100 pt-3 pb-[9px] pl-4.5 resize-none top-0 left-0 overflow-hidden hover:shadow-input focus-within:shadow-input ${
                props.invalidText
                  ? 'border-red hover:border-red focus-within:border-red'
                  : ''
              } ${
                props.invalidText
                  ? ''
                  : 'border-grey hover:border-grey hover:border-opacity-50 focus-within:border-grey focus-within:border-opacity-50'
              } ${!props.includeTime && props.invalidText ? 'pr-11' : 'pr-2'} ${
                props.disabled
                  ? 'cursor-not-allowed opacity-40 shadow-none border-grey'
                  : 'cursor-auto'
              }`}
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
                class={`time relative block w-full bg-white border rounded-3.5 transition-all duration-300 shadow-none font-normal not-italic text-base leading-tight -tracking-0.01 text-dark h-11 py-0 px-4.5 outline-none placeholder-grey placeholder-opacity-100 pt-3 pb-[9px] pl-4.5 resize-none top-0 left-0 overflow-hidden hover:shadow-input focus-within:shadow-input ${
                  props.invalidText
                    ? 'border-red hover:border-red focus-within:border-red'
                    : ''
                } ${
                  props.invalidText
                    ? ''
                    : 'border-grey hover:border-grey hover:border-opacity-50 focus-within:border-grey focus-within:border-opacity-50'
                } ${
                  props.includeTime && props.invalidText ? 'pr-11' : 'pr-2'
                } ${
                  props.disabled
                    ? 'cursor-not-allowed opacity-40 shadow-none border-grey'
                    : 'cursor-auto'
                }`}
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
