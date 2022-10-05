import { defineComponent, PropType, Ref } from 'vue';
import BCMSIcon from '../icon';

const component = defineComponent({
  props: {
    id: String,
    class: String,
    invalidTextClass: String,
    helperTextClass: String,
    labelClass: String,
    label: String,
    invalidText: String,
    helperText: String,
    containerRef: Object as PropType<Ref<HTMLElement | null>>,
  },
  emits: {
    click: () => {
      return true;
    },
  },
  setup(props, ctx) {
    return () => {
      return (
        <label
          // for={props.label}
          class={`flex flex-col ${props.class}`}
          onClick={() => {
            ctx.emit('click');
          }}
          for={props.id ? props.id : props.label}
          ref={props.containerRef}
        >
          {(props.invalidText || props.label) && (
            <span
              class="flex items-center space-x-3 mb-1.5"
              v-tooltip={props.label ? props.invalidText : ''}
            >
              <span
                class={`font-normal not-italic text-xs leading-normal tracking-0.06 select-none block ${
                  !props.label && props.invalidText ? '' : 'uppercase'
                } ${props.labelClass || ''} ${
                  props.invalidText
                    ? 'text-red dark:text-red'
                    : 'dark:text-light'
                }`}
              >
                {props.label || props.invalidText}
              </span>
              {props.label && props.invalidText && (
                <span class={`w-4 h-4 ${props.invalidTextClass || ''}`}>
                  <span>
                    <BCMSIcon
                      src="/alert-triangle"
                      class="fill-current text-red"
                    />
                  </span>
                </span>
              )}
            </span>
          )}
          <span class="relative w-full">
            {ctx.slots.default ? ctx.slots.default() : ''}
            {props.helperText ? (
              <span
                class={`mt-2.5 text-sm leading-normal pointer-events-none text-grey ${
                  props.helperTextClass || ''
                }`}
                v-html={props.helperText}
              />
            ) : (
              ''
            )}
          </span>
        </label>
      );
    };
  },
});
export default component;
