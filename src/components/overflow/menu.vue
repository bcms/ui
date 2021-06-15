<script lang="tsx">
import { defineComponent, PropType, ref } from 'vue';
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
    const toggler = ref<HTMLButtonElement | null>(null);

    function handleClick() {
      if (!show.value) {
        show.value = true;
      } else {
        show.value = false;
      }
    }

    function closeDropdown(element: HTMLElement) {
      if (!toggler.value?.contains(element)) {
        show.value = false;
      }
    }
    return () => {
      return (
        <div
          id={props.id}
          class={`overflowMenu ${props.class}`}
          style={props.style}
          v-cy={props.cyTag}
          ref={menuContainer}
        >
          <button
            class="overflowMenu--trigger"
            onClick={handleClick}
            ref={toggler}
          >
            {props.orientation === 'vertical' ? (
              <BCMSIcon src="/more-vertical" />
            ) : (
              <BCMSIcon src="/more-horizontal" />
            )}
            {show.value ? (
              <div
                class={`overflowMenu--items overflowMenu--items-${props.position}`}
                v-clickOutside={closeDropdown}
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
