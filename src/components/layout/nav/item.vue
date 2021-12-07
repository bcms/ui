<script lang="tsx">
import { defineComponent, onUnmounted, PropType, ref } from 'vue';
import { BCMSNavItemMergeEvent, BCMSNavItemType } from '../../../types';
import BCMSLink from '../../link.vue';
import BCMSIcon from '../../icon.vue';

const component = defineComponent({
  props: {
    item: { type: Object as PropType<BCMSNavItemType>, required: true },
    cyTag: String,
    draggable: Boolean,
  },
  emits: {
    toggle: (_: boolean) => {
      return true;
    },
    merge: (_: BCMSNavItemMergeEvent) => {
      return true;
    },
  },
  setup(props, ctx) {
    const extended = ref(props.item.selected);
    let itemClicked = false;
    let dragging = false;

    function handleDragging(event: MouseEvent) {
      if (props.draggable) {
        event.preventDefault();
        itemClicked = true;
        document.addEventListener('mouseup', handleDrop);
        document.addEventListener('mousemove', handleMouseMove);
      }
    }
    function handleMouseMove(event: MouseEvent) {
      event.preventDefault();
      if (itemClicked) {
        event.preventDefault();
        dragging = true;
      }
    }
    function handleDrop(event: MouseEvent) {
      event.preventDefault();
      if (itemClicked && dragging) {
        ctx.emit('merge', {
          src: props.item,
          targetId: findFirstParent(event.target as HTMLElement),
        });
      }
      itemClicked = false;
      dragging = false;
      document.removeEventListener('mouseup', handleDrop);
      document.removeEventListener('mousemove', handleMouseMove);
    }
    function findFirstParent(target: HTMLElement | undefined): string {
      if (!target) {
        return 'root';
      }
      let dragId = target.getAttribute('data-drag-id');
      if (dragId) {
        return dragId;
      }
      const parent = target.parentElement as HTMLElement | undefined;
      if (!parent) {
        return 'root';
      }
      dragId = target.getAttribute('data-drag-id');
      return dragId ? dragId : findFirstParent(parent);
    }

    onUnmounted(() => {
      document.removeEventListener('mouseup', handleDrop);
      document.removeEventListener('mousemove', handleMouseMove);
    });

    return () => (
      <>
        {props.item.type === 'parent' ? (
          <div v-cy={props.cyTag} class="mb-[15px] desktop:mb-[25px]">
            <button
              data-drag-id={props.item.id ? props.item.id : ''}
              class="text-xs leading-normal tracking-0.06 mb-[25px] uppercase w-[calc(100%+15px)] text-left relative flex items-center translate-x-[-15px]"
              onClick={() => {
                extended.value = !extended.value;
                ctx.emit('toggle', !!extended.value);
              }}
            >
              <span class={`flex mr-3 ${extended.value ? 'rotate-90' : ''}`}>
                <BCMSIcon
                  src="/caret/right"
                  class="w-1 h-auto text-dark fill-current"
                />
              </span>
              <span class="pointer-events-none">{props.item.name}</span>
            </button>
            <ul
              data-drag-id={props.item.id ? props.item.id : ''}
              class={`list-none ${extended.value ? 'block' : 'hidden'}`}
            >
              {props.item.children
                ? props.item.children.map((child) => (
                    <component
                      item={child}
                      cyTag={`${props.cyTag}-${child.name}`}
                      draggable={props.draggable}
                      onMerge={(event: BCMSNavItemMergeEvent) => {
                        ctx.emit('merge', event);
                      }}
                    />
                  ))
                : ''}
            </ul>
          </div>
        ) : (
          <>
            {props.item.visible ? (
              <li
                data-drag-id={props.item.id ? props.item.id : ''}
                v-cy={props.cyTag}
                class={`${
                  props.item.selected
                    ? 'relative last:mb-0 desktop:before:absolute desktop:before:w-[5px] desktop:before:h-[5px] desktop:before:rounded-full desktop:before:bg-green desktop:before:top-1/2 desktop:before:left-[-15px] desktop:before:-translate-y-1/2'
                    : ''
                }`}
              >
                {typeof props.item.onClick === 'string' ? (
                  <BCMSLink
                    href={props.item.onClick}
                    disabled={
                      props.item.ignoreSelected ? false : props.item.selected
                    }
                    onMouseDown={handleDragging}
                    class="group flex items-center justify-between no-underline py-2.5 mb-1.5 text-dark"
                  >
                    <span
                      class={`text-base leading-tight -tracking-0.01 relative after:block after:w-full after:h-px after:absolute after:top-full after:left-0 after:bg-dark after:bg-opacity-0 after:-translate-y-0.5 after:transition-all after:duration-500 after:rounded-sm group-hover:after:bg-opacity-100 group-hover:after:translate-x-0 group-hover:after:translate-y-0 group-focus-visible:after:bg-opacity-100 group-focus-visible::after:translate-x-0 group-focus-visible::after:translate-y-0 ${
                        props.item.selected ? 'font-semibold' : ''
                      }`}
                      onMousedown={handleDragging}
                    >
                      {props.item.name}
                    </span>
                    <span class="flex items-center text-dark">
                      {props.item.icon ? (
                        <BCMSIcon
                          src={props.item.icon}
                          class="fill-current transition-all duration-300 w-5 group-hover:text-green group-focus-visible:text-green desktop:w-6"
                        />
                      ) : (
                        ''
                      )}
                    </span>
                  </BCMSLink>
                ) : (
                  <BCMSLink
                    href={props.item.href ? props.item.href : ''}
                    disabled
                    clickOverride={true}
                    onClick={props.item.onClick}
                    onMouseDown={handleDragging}
                    class="group flex items-center justify-between no-underline py-2.5 mb-1.5 text-dark"
                  >
                    <span
                      class={`text-base leading-tight -tracking-0.01 relative after:block after:w-full after:h-px after:absolute after:top-full after:left-0 after:bg-dark after:bg-opacity-0 after:-translate-y-0.5 after:transition-all after:duration-500 after:rounded-sm group-hover:after:bg-opacity-100 group-hover:after:translate-x-0 group-hover:after:translate-y-0 group-focus-visible:after:bg-opacity-100 group-focus-visible::after:translate-x-0 group-focus-visible::after:translate-y-0 ${
                        props.item.selected ? 'font-semibold' : ''
                      }`}
                      onMousedown={handleDragging}
                    >
                      {props.item.name}
                    </span>
                    <span class="flex items-center text-dark">
                      {props.item.icon ? (
                        <BCMSIcon
                          src={props.item.icon}
                          class="fill-current transition-all duration-300 w-5 group-hover:text-green group-focus-visible:text-green desktop:w-6"
                        />
                      ) : (
                        ''
                      )}
                    </span>
                  </BCMSLink>
                )}
              </li>
            ) : (
              'Not visible'
            )}
          </>
        )}
      </>
    );
  },
});
export default component;
</script>
