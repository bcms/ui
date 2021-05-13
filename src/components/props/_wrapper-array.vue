<script lang="tsx">
import { defineComponent, PropType } from 'vue';
import type { BCMSProp } from '@becomes/cms-sdk/types';
import { DefaultComponentProps } from '../_default';
import BCMSButton from '../button.vue';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    prop: {
      type: Object as PropType<BCMSProp>,
      required: true,
    },
    onAdd: Function as PropType<() => void | Promise<void>>,
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
