<script lang="tsx">
import { computed, defineComponent, onUnmounted, PropType, ref } from 'vue';
import type { BCMSProp, BCMSPropEnum } from '@becomes/cms-sdk/types';
import { DefaultComponentProps } from '../_default';
import { BCMSPropWrapper } from './_wrapper';
import { BCMSSelect } from '../input';

type PropValueType = BCMSPropEnum;

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    prop: {
      type: Object as PropType<BCMSProp>,
      required: true,
    },
    onUpdate: Function as PropType<(prop: BCMSProp) => void | Promise<void>>,
  },
  emits: {
    update: (_prop: BCMSProp) => {
      return true;
    },
  },
  setup(props, ctx) {
    const propsValue = computed(() => {
      return props.prop.value as PropValueType;
    });
    const error = ref('');
    const unregisterFromChecker = window.bcms.services.propsChecker.register(
      () => {
        let isOk = true;
        if (props.prop.required) {
          const value = props.prop.value as PropValueType;
          if (!value.selected) {
            error.value = 'Please select an option';
          } else {
            error.value = '';
          }
        }
        return isOk;
      }
    );

    onUnmounted(() => {
      unregisterFromChecker();
    });

    return () => (
      <BCMSPropWrapper
        id={props.id}
        cyTag="prop-enum"
        class={props.class}
        style={props.style}
        prop={props.prop}
      >
        <div class="prop--enum">
          <BCMSSelect
            selected={propsValue.value.selected}
            placeholder={props.prop.label}
            invalidText={error.value}
            options={propsValue.value.items.map((item) => {
              return {
                value: item,
                label: item,
              };
            })}
            onChange={(data) => {
              const prop = window.bcms.services.general.objectInstance(
                props.prop
              );
              (prop.value as PropValueType).selected = data.value;
              ctx.emit('update', prop);
            }}
          />
        </div>
      </BCMSPropWrapper>
    );
  },
});
export default component;
</script>
