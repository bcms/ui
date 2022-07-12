<script lang="tsx">
import {
  computed,
  defineComponent,
  onMounted,
  PropType,
  ref,
} from '@vue/runtime-core';
import type { SlashCommandItem } from '../../types';
import BCMSIcon from '../icon.vue';
import BCMSImage from '../image.vue';

// const showItems: {
//   ifInList: number[];
// } = {
//   ifInList: [7, 8],
// };

export default defineComponent({
  props: {
    items: {
      type: Array as PropType<SlashCommandItem[]>,
      required: true,
    },
    command: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const list = ref<HTMLElement>();
    const selectedIndex = ref(0);
    const visibleItems = ref([-2]);

    const primaryItems = computed(() => {
      if (visibleItems.value[0] === -1) {
        return props.items.filter((e) => !e.widget);
      } else {
        return props.items.filter(
          (e, i) => !e.widget && visibleItems.value.includes(i)
        );
      }
    });

    const widgetItems = computed(() => {
      if (visibleItems.value[0] === -1) {
        return props.items.filter((e) => e.widget);
      } else {
        return props.items.filter(
          (e, i) => e.widget && visibleItems.value.includes(i)
        );
      }
    });

    function selectItem(index: number) {
      const item = props.items[index];

      if (item) {
        props.command(item);
      }
    }

    function scrollElementToView(index: number) {
      const listRef = list.value;

      if (listRef) {
        const buttons = listRef.querySelectorAll('button');
        if (buttons[index]) {
          buttons[index].scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }
    }

    function upHandler() {
      const activeIndex =
        (selectedIndex.value + props.items.length - 1) % props.items.length;
      selectedIndex.value = activeIndex;
      scrollElementToView(activeIndex);
    }
    function downHandler() {
      const activeIndex = (selectedIndex.value + 1) % props.items.length;
      selectedIndex.value = activeIndex;
      scrollElementToView(activeIndex);
    }
    function enterHandler() {
      selectItem(selectedIndex.value);
    }
    function onKeyDown({ event }: { event: KeyboardEvent }) {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }

      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        event.stopPropagation();
        enterHandler();
        return true;
      }

      return false;
    }

    onMounted(() => {
      // if (window.bcms.editor && window.bcms.editor.value) {
      //   const olAttrs = window.bcms.editor.value.getAttributes('orderedList');
      //   const ulAttrs = window.bcms.editor.value.getAttributes('bulletList');
      //   const liAttrs = window.bcms.editor.value.getAttributes('listItem');
      //   if (olAttrs.start || ulAttrs.start || liAttrs.start) {
      //     visibleItems.value = [-2];
      //     return;
      //   }
      //   const codeAttrs = window.bcms.editor.value.getAttributes('codeBlock');
      //   if (typeof codeAttrs.language !== 'undefined') {
      //     visibleItems.value = [-2];
      //     return;
      //   }
      // }
      visibleItems.value = [-1];
    });

    return {
      list,
      selectedIndex,
      primaryItems,
      widgetItems,

      selectItem,
      scrollElementToView,
      upHandler,
      downHandler,
      enterHandler,
      onKeyDown,
    };
  },

  render() {
    return (
      <div
        ref="list"
        class={[
          'bcmsScrollbar',
          'bg-white',
          'shadow-cardLg',
          'overflow-y-auto',
          'max-h-80',
          'w-screen',
          'max-w-xs',
          'rounded-2.5',
          'z-50',
        ]}
      >
        {this.primaryItems.length > 0 ? (
          <>
            <div
              class={[
                'text-xs',
                'text-dark',
                'uppercase',
                'tracking-0.06',
                'leading-normal',
                'px-5',
                'pt-4',
                'pb-3',
              ]}
            >
              Primary
            </div>
            {this.primaryItems.map((item, index) => {
              return (
                <button
                  class={[
                    'group',
                    'flex',
                    'items-center',
                    'w-full',
                    'px-5',
                    'py-3',
                    'transition-colors',
                    'duration-300',
                    'hover:bg-grey',
                    'hover:bg-opacity-10',
                    'focus:bg-grey',
                    'focus:bg-opacity-10',
                    index === this.selectedIndex ? 'bg-grey bg-opacity-10' : '',
                  ]}
                  onClick={() => this.selectItem(index)}
                >
                  <BCMSIcon
                    src={item.icon}
                    class={[
                      'w-6',
                      'h-6',
                      'fill-current',
                      'mr-3.5',
                      'transition-colors',
                      'duration-300',
                      'group-hover:text-green',
                      'group-focus:text-green',
                      index === this.selectedIndex ? 'text-green' : 'text-grey',
                    ].join(' ')}
                  />
                  <span
                    class={[
                      'pt-1',
                      'line-clamp-2',
                      'text-dark',
                      '-tracking-0.01',
                      'leading-tight',
                      'transition-colors',
                      'duration-300',
                      'text-left',
                      'group-hover:text-green',
                      'group-focus:text-green',
                    ]}
                  >
                    {item.title}
                  </span>
                </button>
              );
            })}
          </>
        ) : (
          ''
        )}
        {this.widgetItems.length > 0 ? (
          <>
            <div
              class={[
                'text-xs',
                'text-dark',
                'uppercase',
                'tracking-0.06',
                'leading-normal',
                'px-5',
                'pt-4',
                'pb-3',
                'mt-3',
              ]}
            >
              Widgets
            </div>
            {this.widgetItems.map((item, index) => {
              return (
                <button
                  class={[
                    'group',
                    'flex',
                    'items-center',
                    'w-full',
                    'px-5',
                    'py-3',
                    'transition-colors',
                    'duration-300',
                    'hover:bg-grey',
                    'hover:bg-opacity-10',
                    'focus:bg-grey',
                    'focus:bg-opacity-10',
                    index + this.primaryItems.length === this.selectedIndex
                      ? 'bg-grey bg-opacity-10'
                      : '',
                  ]}
                  onClick={() => this.selectItem(index + 10)}
                >
                  <BCMSIcon
                    src={item.icon}
                    class={[
                      'w-6',
                      'h-6',
                      'fill-current',
                      'mr-3.5',
                      'transition-colors',
                      'duration-300',
                      'group-hover:text-green',
                      'group-focus:text-green',
                      index + this.primaryItems.length === this.selectedIndex
                        ? 'text-green'
                        : 'text-grey',
                    ].join(' ')}
                  />
                  <span
                    class={[
                      'pt-1',
                      'line-clamp-2',
                      'text-dark',
                      '-tracking-0.01',
                      'leading-tight',
                      'transition-colors',
                      'duration-300',
                      'text-left',
                      'group-hover:text-green',
                      'group-focus:text-green',
                    ]}
                  >
                    {item.title}
                  </span>
                  {item.image ? (
                    <div style={'width: 80px; margin-left: auto;'}>
                      <BCMSImage alt={item.title} media={item.image} />
                    </div>
                  ) : (
                    ''
                  )}
                </button>
              );
            })}
          </>
        ) : (
          ''
        )}
      </div>
    );
  },
});
</script>
