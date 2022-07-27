<script lang="tsx">
import { computed, defineComponent, PropType, ref } from 'vue';
import { DefaultComponentProps } from '../_default';
import BCMSIcon from '../icon.vue';
import { useTranslation } from '../../translations';

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
      default: '',
    },
  },
  setup(props, ctx) {
    const translations = computed(() => {
      return useTranslation();
    });

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

    return () => {
      return (
        <div
          id={props.id}
          class={`relative flex ${props.class}`}
          style={props.style}
          v-cy={props.cyTag}
          ref={menuContainer}
        >
          <button class="group-scope flex" onClick={handleClick} ref={toggler}>
            {props.orientation === 'vertical' ? (
              <BCMSIcon
                src="/more-vertical"
                class="w-6 h-6 text-grey fill-current transition-colors duration-300 group-scope-hover:text-dark group-scope-focus:text-dark"
              />
            ) : (
              <BCMSIcon
                src="/more-horizontal"
                class="w-6 h-6 text-grey fill-current transition-colors duration-300 group-scope-hover:text-dark group-scope-focus:text-dark"
              />
            )}
            {show.value ? (
              <div
                class={`z-[1] flex flex-col absolute top-full bg-white shadow-cardLg overflow-hidden w-[215px] select-none rounded-2.5 ${
                  props.position === 'left' ? 'left-0' : 'right-0'
                }`}
                v-clickOutside={() => (show.value = false)}
              >
                <div class="text-xs uppercase leading-normal tracking-0.06 pt-4 px-4 pb-1.5 text-left cursor-default">
                  {props.title ||
                    translations.value.prop.viewer.overflowItems.title}
                </div>
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
