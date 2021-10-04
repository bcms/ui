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
            <div class={`bcmsModal ${props.class ? props.class : ''}`}>
              <div
                class="bcmsModal--overlay"
                tabindex="0"
                role="button"
                aria-label="Close modal"
                onKeydown={(event) => {
                  if (event.key === 'Enter') {
                    cancel();
                  }
                }}
                onClick={() => {
                  cancel();
                }}
              />
              <div class="bcmsModal--inner">
                <header class="bcmsModal--header mb-50">
                  {ctx.slots.header ? (
                    ctx.slots.header()
                  ) : props.title ? (
                    <div class="bcmsModal--title">{props.title}</div>
                  ) : (
                    ''
                  )}
                  <button
                    aria-label="Close modal"
                    onClick={cancel}
                    class="bcmsModal--close"
                  >
                    <BCMSIcon src="/close" />
                  </button>
                </header>
                <div class="bcmsModal--body bcmsScrollbar">
                  {ctx.slots.default ? ctx.slots.default() : ''}
                </div>
                {props.doNotShowFooter ? (
                  ''
                ) : (
                  <div class="bcmsModal--actions">
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
