import { computed, defineComponent, PropType, ref, Teleport } from 'vue';
import { DefaultComponentProps } from '../_default';
import BCMSIcon from '../icon';
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

    const listRef = ref<HTMLDivElement | null>(null);
    const menuContainer = ref<HTMLDivElement | null>(null);
    const show = ref(false);
    const toggler = ref<HTMLButtonElement | null>(null);

    function calcPosition() {
      if (listRef.value && menuContainer.value) {
        const parent = menuContainer.value;
        const parentBB = parent.getBoundingClientRect();
        const el = listRef.value;
        const style: string[] = [];
        console.log(parentBB);
        if (parentBB.top + el.offsetHeight > window.innerHeight) {
          style.push(
            `top: ${
              parentBB.top - el.offsetHeight + document.body.scrollTop
            }px !important;`
          );
        } else {
          style.push(
            `top: ${
              parentBB.bottom + 15 + document.body.scrollTop
            }px !important;`
          );
        }
        if (parentBB.left + el.offsetWidth > window.innerWidth) {
          style.push(
            `left: ${
              parentBB.left - el.offsetWidth + parent.offsetWidth
            }px !important;`
          );
        } else {
          style.push(`left: ${parentBB.left + el.offsetWidth}px !important;`);
        }
        el.setAttribute('style', style.join(' '));
        console.log(parentBB.top + el.offsetHeight, window.innerWidth);
      }
    }

    function handleClick() {
      if (!show.value) {
        show.value = true;
        setTimeout(() => {
          calcPosition();
        }, 20);
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
          <button
            class="group-scope flex items-center"
            onClick={handleClick}
            ref={toggler}
          >
            {props.orientation === 'vertical' ? (
              <BCMSIcon
                src="/more-vertical"
                class="w-6 h-6 text-grey fill-current transition-colors duration-300 group-scope-hover:text-dark group-scope-focus:text-dark dark:group-scope-hover:text-light dark:group-scope-focus:text-light"
              />
            ) : (
              <BCMSIcon
                src="/more-horizontal"
                class="w-6 h-6 text-grey fill-current transition-colors duration-300 group-scope-hover:text-dark group-scope-focus:text-dark dark:group-scope-hover:text-light dark:group-scope-focus:text-light"
              />
            )}
            {show.value ? (
              <Teleport to="#bcmsOverflowList">
                <div
                  ref={listRef}
                  class="z-[1000000] flex flex-col absolute top-full bg-white shadow-cardLg overflow-hidden w-[215px] select-none rounded-2.5 dark:bg-darkGrey"
                  v-clickOutside={() => (show.value = false)}
                  onClick={() => {
                    show.value = false;
                  }}
                >
                  <div class="text-xs uppercase leading-normal tracking-0.06 pt-4 px-4 pb-1.5 text-left cursor-default dark:text-light">
                    {props.title ||
                      translations.value.prop.viewer.overflowItems.title}
                  </div>
                  {ctx.slots.default ? ctx.slots.default() : ''}
                </div>
              </Teleport>
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
