import { defineComponent, onUnmounted, PropType, ref } from 'vue';
import type { BCMSNavItemMergeEvent, BCMSNavItemType } from '../../../types';
import BCMSLink from '../../link';
import BCMSIcon from '../../icon';

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

        const currentTarget = event.currentTarget as HTMLElement;
        if (currentTarget) {
          currentTarget.classList.add('nav-dragging');
        }
      }
    }
    function handleMouseMove(event: MouseEvent) {
      event.preventDefault();
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' &&
        target.getAttribute('data-is-extending') === 'false'
      ) {
        const nextSibling = target?.nextElementSibling as HTMLElement;
        if (nextSibling) {
          nextSibling.classList.remove('hidden');
          nextSibling.classList.add('block');
        }
      }
      if (itemClicked) {
        dragging = true;
      }
    }
    function handleDrop(event: MouseEvent) {
      event.preventDefault();
      if (itemClicked && dragging) {
        // check if we are not dropping item onto itself
        const dropTargetId = findFirstParent(event.target as HTMLElement);
        const dropTargetElement = document.querySelector(
          `[data-drag-id="${dropTargetId}"]`
        );
        if (
          dropTargetElement &&
          dropTargetElement.classList.contains('nav-dragging')
        ) {
          const currentNavDragging = document.querySelector('.nav-dragging');
          if (currentNavDragging) {
            currentNavDragging.classList.remove('nav-dragging');
          }
          document.removeEventListener('mouseup', handleDrop);
          document.removeEventListener('mousemove', handleMouseMove);
          return false;
        }
        ctx.emit('merge', {
          src: props.item,
          targetId: findFirstParent(event.target as HTMLElement),
        });
      }
      itemClicked = false;
      dragging = false;

      const currentNavDragging = document.querySelector('.nav-dragging');
      if (currentNavDragging) {
        currentNavDragging.classList.remove('nav-dragging');
      }
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
    function handleMouseEnter(event: MouseEvent) {
      // Check if there is an active dragged element
      const draggingElement = document.querySelector(
        '.nav-dragging'
      ) as HTMLElement;

      if (!draggingElement) {
        return;
      }
      // Check if that element is me
      const thisElementDragId = (event.currentTarget as HTMLElement).dataset
        .dragId;
      if (thisElementDragId !== draggingElement.dataset.dragId) {
        (event.currentTarget as HTMLElement).classList.add('group-selector');
      }
    }
    function handleMouseLeave(event: MouseEvent) {
      const leavingEl = event.currentTarget as HTMLElement;
      leavingEl.classList.remove('group-selector');
    }
    function handleGroupMouseEnter(event: MouseEvent) {
      const draggingElement = document.querySelector(
        '.nav-dragging'
      ) as HTMLElement;
      if (draggingElement && !draggingElement.closest('.group-selector')) {
        (event.currentTarget as HTMLElement).classList.add('after:opacity-100');
        (event.currentTarget as HTMLElement).classList.remove(
          'after:opacity-0'
        );
      }
    }
    function handleGroupMouseLeave(event: MouseEvent) {
      (event.currentTarget as HTMLElement).classList.remove(
        'after:opacity-100'
      );
    }

    onUnmounted(() => {
      document.removeEventListener('mouseup', handleDrop);
      document.removeEventListener('mousemove', handleMouseMove);
    });

    return () => (
      <>
        {props.item.type === 'parent' ? (
          <li
            data-nav-draggable={props.draggable}
            data-parent
            v-cy={props.cyTag}
            class="mb-[15px] desktop:mb-[25px] list-none relative after:absolute after:pointer-events-none after:top-0 after:-left-6 after:w-[calc(100%+47px)] after:h-full after:border after:border-green after:rounded after:opacity-0 after:duration-0 after:origin-top"
            onMouseenter={handleGroupMouseEnter}
            onMouseleave={handleGroupMouseLeave}
          >
            <button
              data-is-extending={extended.value}
              data-drag-id={props.item.id ? props.item.id : ''}
              class="text-xs leading-normal tracking-0.06 mb-[25px] uppercase w-[calc(100%+15px)] text-left relative flex items-center translate-x-[-15px] dark:text-light"
              onClick={() => {
                extended.value = !extended.value;
              }}
            >
              <span class={`flex mr-3 ${extended.value ? 'rotate-90' : ''}`}>
                <BCMSIcon
                  src="/caret/right"
                  class="w-1 h-2 text-dark fill-current dark:text-light"
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
          </li>
        ) : (
          <>
            {props.item.visible ? (
              <li
                data-child
                data-drag-id={props.item.id ? props.item.id : ''}
                v-cy={props.cyTag}
                class={`relative ${
                  props.item.selected
                    ? 'last:mb-0 desktop:before:absolute desktop:before:w-[5px] desktop:before:h-[5px] desktop:before:rounded-full desktop:before:bg-green desktop:before:top-1/2 desktop:before:left-[-15px] desktop:before:-translate-y-1/2 desktop:dark:before:bg-yellow'
                    : ''
                } after:absolute after:pointer-events-none after:top-0 after:-left-6 after:w-[calc(100%+47px)] after:h-full after:border after:border-green after:rounded after:opacity-0 after:duration-0 after:origin-top`}
                onMousedown={handleDragging}
                onMouseenter={handleMouseEnter}
                onMouseleave={handleMouseLeave}
              >
                {typeof props.item.onClick === 'string' ? (
                  <BCMSLink
                    href={props.item.onClick}
                    disabled={
                      props.item.ignoreSelected ? false : props.item.selected
                    }
                    class="group flex items-center justify-between no-underline py-2.5 mb-1.5 text-dark dark:text-light"
                  >
                    <span
                      data-nav-item-label
                      class={`text-base leading-tight -tracking-0.01 relative after:block after:w-full after:h-px after:absolute after:top-full after:left-0 after:bg-dark after:bg-opacity-0 after:-translate-y-0.5 after:transition-all after:duration-500 after:rounded-sm group-hover:after:bg-opacity-100 group-hover:after:translate-x-0 group-hover:after:translate-y-0 group-focus-visible:after:bg-opacity-100 group-focus-visible::after:translate-x-0 group-focus-visible::after:translate-y-0 ${
                        props.item.selected ? 'font-semibold' : ''
                      } dark:after:bg-yellow dark:after:bg-opacity-0`}
                    >
                      {props.item.name}
                    </span>
                    <span
                      class={`flex items-center ${
                        props.item.selected
                          ? 'text-green dark:text-yellow'
                          : 'text-dark dark:text-light'
                      }`}
                    >
                      {props.item.icon ? (
                        <BCMSIcon
                          src={props.item.icon}
                          class="fill-current transition-all duration-300 w-5 h-5 group-hover:text-green group-focus-visible:text-green desktop:w-6 desktop:h-6 dark:group-hover:text-yellow dark:group-focus-visible:text-yellow"
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
                    class="group flex items-center justify-between no-underline py-2.5 mb-1.5 text-dark dark:text-light"
                  >
                    <span
                      data-nav-item-label
                      class={`text-base leading-tight -tracking-0.01 relative transition-all duration-300 after:block after:w-full after:h-px after:absolute after:top-full after:left-0 after:bg-dark after:bg-opacity-0 after:-translate-y-0.5 after:transition-all after:duration-500 after:rounded-sm group-hover:after:bg-opacity-100 group-hover:after:translate-x-0 group-hover:after:translate-y-0 group-focus-visible:after:bg-opacity-100 group-focus-visible::after:translate-x-0 group-focus-visible::after:translate-y-0 ${
                        props.item.selected ? 'font-semibold' : ''
                      } dark:after:bg-yellow dark:after:bg-opacity-0`}
                    >
                      {props.item.name}
                    </span>
                    <span
                      class={`flex items-center ${
                        props.item.selected
                          ? 'text-green dark:text-yellow'
                          : 'text-dark dark:text-light'
                      }`}
                    >
                      {props.item.icon ? (
                        <BCMSIcon
                          src={props.item.icon}
                          class="fill-current transition-all duration-300 w-5 h-5 group-hover:text-green group-focus-visible:text-green desktop:w-6 desktop:h-6 dark:group-hover:text-yellow dark:group-focus-visible:text-yellow"
                        />
                      ) : (
                        ''
                      )}
                    </span>
                  </BCMSLink>
                )}
              </li>
            ) : (
              ''
            )}
          </>
        )}
      </>
    );
  },
});

export default component;
