<script lang="tsx">
import { defineComponent, PropType } from 'vue';
import { DefaultComponentProps } from '../_default';
import BCMSButton from '../button.vue';
import type { BCMSPropValueExtended } from '../../types';
import { useI18n } from 'vue-i18n';

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
    const { t: i18n } = useI18n();

    return () => (
      <div class={`${props.class}`}>
        {ctx.slots.default ? <div>{ctx.slots.default()}</div> : ''}
        <BCMSButton
          size="m"
          onClick={() => {
            ctx.emit('add');
          }}
        >
          {i18n('props.wrapperArray.actionName', {
            label: props.prop.label,
          })}
        </BCMSButton>
      </div>
    );
  },
});
export default component;
</script>
