<script lang="tsx">
import { defineComponent, PropType, ref } from 'vue';
import { BCMSNavItemType } from '@/types';
import { BCMSIcon, BCMSLink } from '@/components';

const component = defineComponent({
  props: {
    item: { type: Object as PropType<BCMSNavItemType>, required: true },
    cyTag: String,
    onToggle: Function as PropType<(extended: boolean) => void | Promise<void>>,
  },
  emits: {
    toggle: (_: boolean) => {
      return true;
    },
  },
  setup(props, ctx) {
    const extended = ref(props.item.selected);
    return () => (
      <>
        {props.item.type === 'parent' ? (
          <div v-cy={props.cyTag} class="sideNav--section">
            <button
              class={`sideNav--section-toggler ${extended.value ? 'sideNav--section-toggler_active' : ''}`}
              onClick={() => {
                extended.value = !extended.value;
                ctx.emit('toggle', !!extended.value);
              }}
            >
              <BCMSIcon src="/caret/right" />
              <span>{props.item.name}</span>
            </button>
            <ul class="sideNav--section-items">
              {props.item.children
                ? props.item.children.map((child) => (
                    <component
                      item={child}
                      cyTag={`${props.cyTag}-${child.name}`}
                    />
                  ))
                : ''}
            </ul>
          </div>
        ) : (
          <>
            {props.item.visible ? (
              <li
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
                  >
                    <span class="sideNav--section-item-name">
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
                  <BCMSLink href="" disabled onClick={props.item.onClick}>
                    <span class="sideNav--section-item-name">
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
