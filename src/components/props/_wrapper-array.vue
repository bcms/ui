<script lang="tsx">
import { computed, defineComponent, PropType } from 'vue';
import { DefaultComponentProps } from '../_default';
import BCMSButton from '../button.vue';
import type { BCMSPropValueExtended } from '../../types';
import { useTranslation } from '../../translations';

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
    const translations = computed(() => {
      return useTranslation();
    });

    return () => (
      <div class={`${props.class}`}>
        {ctx.slots.default ? <div>{ctx.slots.default()}</div> : ''}
        <BCMSButton
          size="m"
          onClick={() => {
            ctx.emit('add');
          }}
        >
          {translations.value.prop.wrapperArray.actionName({
            label: props.prop.label,
          })}
        </BCMSButton>
      </div>
    );
  },
});
export default component;
</script>
