<script lang="tsx">
import { defineComponent, PropType } from 'vue';
import { DefaultComponentProps } from '../_default';
import BCMSButton from '../button.vue';
import { BCMSPropValueExtended } from '../../types';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    prop: {
      type: Object as PropType<BCMSPropValueExtended>,
      required: true,
    },
  },
  emits: {
    add: () => {
      return true;
    },
  },
  setup(props, ctx) {
    return () => (
      <div class={`entryEditor--prop_ARRAY-wrapper ${props.class}`}>
        {ctx.slots.default ? (
          <div class="entryEditor--prop_ARRAY-inner">{ctx.slots.default()}</div>
        ) : (
          ''
        )}
        <BCMSButton
          size="m"
          onClick={() => {
            ctx.emit('add');
          }}
        >
          Add new item to {props.prop.label}
        </BCMSButton>
      </div>
    );
  },
});
export default component;
</script>
