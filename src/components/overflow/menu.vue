<script lang="tsx">
import { defineComponent, onUnmounted, PropType, ref } from 'vue';
import { DefaultComponentProps } from '../_default';
import BCMSIcon from '../icon.vue';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    position: {
      type: String as PropType<'left' | 'right'>,
      default: 'left',
    },
    orientation: {
      type: String as PropType<'vertical' | 'horizontal'>,
      default: 'vertical',
    },
    title: {
      type: String,
      default: 'Options',
    },
  },
  setup(props, ctx) {
    const menuContainer = ref<HTMLDivElement | null>(null);
    const show = ref(false);

    function closeOnClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target) return;
      if (show.value) {
        setTimeout(() => {
          show.value = false;
        }, 50);
      }
      if (menuContainer.value) {
        if (!menuContainer.value.contains(target)) {
          show.value = false;
          document.body.removeEventListener('click', closeOnClickOutside, true);
        }
      }
    }
    function handleClick() {
      if (!show.value) {
        show.value = true;
        document.body.addEventListener('click', closeOnClickOutside, true);
      } else {
        show.value = false;
        document.body.removeEventListener('click', closeOnClickOutside, true);
      }
    }

    onUnmounted(() => {
      document.body.removeEventListener('click', closeOnClickOutside);
    });
    return () => {
      return (
        <div
          id={props.id}
          class={`overflowMenu ${props.class}`}
          style={props.style}
          v-cy={props.cyTag}
          ref={menuContainer}
        >
          <button class="overflowMenu--trigger" onClick={handleClick}>
            {props.orientation === 'vertical' ? (
              <BCMSIcon src="/more-vertical" />
            ) : (
              <BCMSIcon src="/more-horizontal" />
            )}
            {show.value ? (
              <div
                class={`overflowMenu--items overflowMenu--items-${props.position}`}
              >
                <div class="overflowMenu--items-title">{props.title}</div>
                {ctx.slots.default ? ctx.slots.default() : ''}
              </div>
            ) : (
              ''
            )}
          </button>
        </div>
      );
    };
  },
});
export default component;
</script>
