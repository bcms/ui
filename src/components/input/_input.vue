<script lang="tsx">
import { defineComponent, PropType, Ref } from 'vue';
import BCMSIcon from '../icon.vue';

const component = defineComponent({
  props: {
    class: String,
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
          ref={props.containerRef}
        >
          {props.label ? (
            <span class="font-normal not-italic text-xs leading-normal tracking-0.06 uppercase select-none mb-1.25 block dark:text-light">
              {props.label}
            </span>
          ) : (
            ''
          )}
          <span class="relative w-full">
            {ctx.slots.default ? ctx.slots.default() : ''}
            {props.invalidText ? (
              <div
                class="absolute right-3 top-2.5 w-6 h-6 z-10"
                v-tooltip={props.invalidText}
              >
                <span>
                  <BCMSIcon
                    src="/alert-triangle"
                    class="text-red fill-current"
                  />
                </span>
              </div>
            ) : (
              ''
            )}
          </span>
          {props.helperText ? (
            <span
              class="mt-2.5 text-sm leading-normal pointer-events-none text-grey"
              v-html={props.helperText}
            />
          ) : (
            ''
          )}
        </label>
      );
    };
  },
});
export default component;
</script>
