<script lang="tsx">
import { defineComponent, PropType } from 'vue';
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
      (item: BCMSManagerNavItemType) => void | Promise<void>
    >,
  },
  emits: {
    open: (item: BCMSManagerNavItemType) => {
      return true;
    },
  },
  setup(props, ctx) {
    return () => (
      <li
        class={`sideNav--section-item ${
          props.item.selected ? 'sideNav--section-item_selected' : ''
        }`}
      >
        <BCMSLink
          href={props.item.link}
          onClick={() => {
            ctx.emit('open', props.item);
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
