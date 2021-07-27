<script lang="tsx">
import { defineComponent, PropType, reactive, ref, Transition } from 'vue';
import BCMSIcon from '../icon.vue';
import { DefaultComponentProps } from '../_default';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    onClick: Function as PropType<() => void>,
  },
  emits: {
    click: () => {
      return true;
    },
  },
  setup(props, ctx) {
    props = reactive(props);
    const helpContainer = ref<HTMLDivElement | null>(null);
    const show = ref(false);
    const toggler = ref<HTMLButtonElement | null>(null);

    function handleClick() {
      if (!show.value) {
        show.value = true;
      } else {
        show.value = false;
      }
    }

    return () => {
      return (
        <div class={`help ${props.class || ''}`} v-cy={props.cyTag}>
          <button
            onClick={() => {
              handleClick();
              ctx.emit('click');
            }}
            class="help--btn"
            title="Help, feedback, and \n keyboard shortcuts"
            ref={toggler}
          >
            <span>?</span>
          </button>
          <Transition name="fade">
            {show.value === true && (
              <div
                class="help--container"
                ref={helpContainer}
                v-clickOutside={() => (show.value = false)}
              >
                <button class="help--container-item">
                  <BCMSIcon src="/file" class="help--container-item-svg" />
                  <span>Help & support guide</span>
                </button>
                <button class="help--container-item">
                  <BCMSIcon src="/file" class="help--container-item-svg" />
                  <span>Send us a message</span>
                </button>
                <div class="help--container-divider" />
                <button class="help--container-item">Keyboard shortcuts</button>
                <button class="help--container-item">What's new?</button>
                <button class="help--container-item">Join us</button>
                <div class="help--container-divider" />
                <a
                  href="https://twitter.com/thebcms"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="help--container-item help--container-item_sm"
                  onClick={handleClick}
                >
                  Twitter - @thebcms
                </a>
                <button class="help--container-item help--container-item_sm">
                  Terms & privacy
                </button>
                <button class="help--container-item help--container-item_sm">
                  Status
                </button>
                <div class="help--container-divider" />
                <div class="help--container-item help--container-item_info">
                  Notion 2.10
                </div>
                <div class="help--container-item help--container-item_info">
                  Desktop 2.0.17
                </div>
                <div class="help--container-item help--container-item_info">
                  Updated 2 days ago
                </div>
              </div>
            )}
          </Transition>
        </div>
      );
    };
  },
});
export default component;
</script>
