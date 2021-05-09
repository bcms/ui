<script lang="tsx">
import { defineComponent, PropType, reactive } from 'vue';
import { BCMSRoleName } from '@becomes/cms-sdk/types';
import { DefaultComponentProps } from '../_default';
import BCMSLink from '../link.vue';
import BCMSIcon from '../icon.vue';
import { BCMSManagerNavItemType } from '../../types';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    item: { type: Object as PropType<BCMSManagerNavItemType>, required: true },
    onOpen: Function as PropType<
      (event: Event, item: BCMSManagerNavItemType) => void | Promise<void>
    >,
  },
  emits: {
    open: (_event: Event, _item: BCMSManagerNavItemType) => {
      return true;
    },
  },
  setup(props, ctx) {
    props = reactive(props);

    return () => (
      <li
        class={`sideNav--section-item ${
          props.item.selected ? 'sideNav--section-item_selected' : ''
        }`}
      >
        <BCMSLink
          href={props.item.link}
          onClick={(event) => {
            event.preventDefault();
            if (props.item.onClick) {
              props.item.onClick(event, props.item);
            } else {
              ctx.emit('open', event, props.item);
            }
          }}
        >
          <span class="sideNav--section-item-name"> {props.item.name} </span>
          {props.item.role && props.item.role === BCMSRoleName.ADMIN ? (
            <span class="sideNav--section-item-icon">
              <BCMSIcon src="/administration/admin" />
            </span>
          ) : (
            ''
          )}
        </BCMSLink>
      </li>
    );
  },
});
export default component;
</script>
