<script lang="tsx">
import { defineComponent, PropType, Transition } from 'vue';
import { BCMSIcon, BCMSButton } from '../../components';

const component = defineComponent({
  props: {
    class: String,
    show: {
      type: Boolean,
      required: true,
    },
    title: String,
    actionName: String,
    beforeDone: Function as PropType<() => boolean>,
    doNotShowFooter: Boolean,
    confirmDisabledButton: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: {
    done: (_?: unknown) => {
      return true;
    },
    cancel: (_?: unknown) => {
      return true;
    },
  },

  setup(props, ctx) {
    function cancel() {
      ctx.emit('cancel');
    }
    function done() {
      if (props.beforeDone) {
        if (!props.beforeDone()) {
          return;
        }
      }
      ctx.emit('done');
    }

    return () => {
      return (
        <Transition name="modal">
          {props.show && (
            <div
              class={`bcmsModal fixed top-0 left-0 w-full h-full z-1000000 ${
                props.class ? props.class : ''
              }`}
            >
              <div
                aria-label="Close modal"
                class="bcmsModal--overlay absolute w-full h-full bg-dark bg-opacity-30 cursor-pointer transition-all duration-300 focus:after:content-[attr(aria-label)] focus:after:absolute focus:after:top-5 focus:after:right-5 focus:after:text-base focus:after:leading-normal focus:after:bg-white focus:after:rounded focus:after:py-1 focus:after:px-2"
                tabindex="0"
                role="button"
                onKeydown={(event) => {
                  if (event.key === 'Enter') {
                    cancel();
                  }
                }}
                onClick={() => {
                  cancel();
                }}
              />
              <div class="bcmsModal--inner fixed w-[95%] max-w-[500px] rounded-2.5 top-1/2 left-1/2 bg-white transform -translate-x-1/2 -translate-y-1/2 shadow-cardLg z-10 max-h-[90vh] pb-0 flex flex-col transition-all duration-500">
                <header class="bcmsModal--header pt-7.5 px-7.5 flex items-start justify-between leading-none mb-12 xs:pt-10 xs:px-10">
                  {ctx.slots.header ? (
                    ctx.slots.header()
                  ) : props.title ? (
                    <div class="text-dark text-4xl -tracking-0.03 font-normal line-break-anywhere w-full">
                      {props.title}
                    </div>
                  ) : (
                    ''
                  )}
                  <button
                    aria-label="Close modal"
                    onClick={cancel}
                    class="bcmsModal--close group ml-auto pt-[5px]"
                  >
                    <BCMSIcon
                      src="/close"
                      class="text-dark fill-current w-6 transition-all duration-200 group-hover:text-red group-focus:text-red"
                    />
                  </button>
                </header>
                <div class="bcmsModal--body overflow-y-auto px-7.5 bcmsScrollbar xs:px-10">
                  {ctx.slots.default ? ctx.slots.default() : ''}
                </div>
                {props.doNotShowFooter ? (
                  ''
                ) : (
                  <div class="bcmsModal--actions flex flex-row-reverse items-center pb-7.5 px-7.5 pt-10 rounded-b-2.5 xs:pb-10 xs:px-10">
                    {ctx.slots.actions ? (
                      ctx.slots.actions()
                    ) : (
                      <>
                        <BCMSButton
                          onClick={done}
                          disabled={props.confirmDisabledButton}
                        >
                          <span>
                            {props.actionName ? props.actionName : 'Done'}
                          </span>
                        </BCMSButton>
                        <BCMSButton
                          kind="ghost"
                          class="text-pink hover:text-red hover:shadow-none focus:text-red focus:shadow-none"
                          onClick={cancel}
                        >
                          Cancel
                        </BCMSButton>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </Transition>
      );
    };
  },
});
export default component;
</script>

<style lang="scss">
.bcmsModal {
  &--title {
    &_sm {
      @apply text-xs uppercase leading-normal tracking-0.06;
    }
  }
  &--subtitle {
    font-size: 22px;
    @apply font-normal text-grey border-b border-grey;
  }
  &--actions {
    background: linear-gradient(
      0deg,
      rgba(var(--white), 1) 80%,
      rgba(255, 255, 255, 0) 100%
    );
  }
}
</style>
