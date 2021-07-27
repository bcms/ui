<script lang="tsx">
import { defineComponent, onUnmounted, PropType, ref } from 'vue';
import { BCMSNavItemMergeEvent, BCMSNavItemType } from '../../../types';
import BCMSLink from '../../link.vue';
import BCMSIcon from '../../icon.vue';

const component = defineComponent({
  props: {
    item: { type: Object as PropType<BCMSNavItemType>, required: true },
    cyTag: String,
    onToggle: Function as PropType<(extended: boolean) => void | Promise<void>>,
    onMerge: Function as PropType<
      (event: BCMSNavItemMergeEvent) => void | Promise<void>
    >,
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
          <div v-cy={props.cyTag} class="sideNav--section">
            <button
              data-drag-id={props.item.id ? props.item.id : ''}
              class={`sideNav--section-toggler ${
                extended.value ? 'sideNav--section-toggler_active' : ''
              }`}
              onClick={() => {
                extended.value = !extended.value;
                ctx.emit('toggle', !!extended.value);
              }}
            >
              <BCMSIcon src="/caret/right" />
              <span>{props.item.name}</span>
            </button>
            <ul
              data-drag-id={props.item.id ? props.item.id : ''}
              class="sideNav--section-items"
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
                class={`sideNav--section-item ${
                  props.item.selected ? 'sideNav--section-item_selected' : ''
                }`}
              >
                {typeof props.item.onClick === 'string' ? (
                  <BCMSLink
                    href={props.item.onClick}
                    disabled={
                      props.item.ignoreSelected ? false : props.item.selected
                    }
                    onMouseDown={handleDragging}
                  >
                    <span
                      class="sideNav--section-item-name"
                      onMousedown={handleDragging}
                    >
                      {props.item.name}
                    </span>
                    <span class="sideNav--section-item-icon">
                      {props.item.icon ? (
                        <BCMSIcon src={props.item.icon} />
                      ) : (
                        ''
                      )}
                    </span>
                  </BCMSLink>
                ) : (
                  <BCMSLink
                    href={props.item.href ? props.item.href : ''}
                    disabled
                    onClick={props.item.onClick}
                    onMouseDown={handleDragging}
                  >
                    <span
                      class="sideNav--section-item-name"
                      onMousedown={handleDragging}
                    >
                      {props.item.name}
                    </span>
                    <span class="sideNav--section-item-icon">
                      {props.item.icon ? (
                        <BCMSIcon src={props.item.icon} />
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
