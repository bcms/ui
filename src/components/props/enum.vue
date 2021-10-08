<script lang="tsx">
import { computed, defineComponent, onUnmounted, PropType, ref } from 'vue';
import { DefaultComponentProps } from '../_default';
import { BCMSPropWrapper } from './_wrapper';
import { BCMSSelect } from '../input';
import { BCMSPropValueExtended } from '../../types';

type PropValueType = string[];

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    prop: {
      type: Object as PropType<BCMSPropValueExtended>,
      required: true,
    },
  },
  emits: {
    update: (_prop: BCMSPropValueExtended) => {
      return true;
    },
  },
  setup(props, ctx) {
    const propsValue = computed(() => {
      return props.prop.data as PropValueType;
    });
    const error = ref('');
    const unregisterFromChecker = window.bcms.prop.checker.register(() => {
      let isOk = true;
      if (props.prop.required) {
        const value = props.prop.data as PropValueType;
        if (!value[0]) {
          error.value = 'Please select an option';
        } else {
          error.value = '';
        }
      }
      return isOk;
    });

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
        <div>
          <BCMSSelect
            selected={propsValue.value[0]}
            placeholder={props.prop.label}
            invalidText={error.value}
            options={(props.prop.enumItems as string[]).map((item) => {
              return {
                value: item,
                label: item,
              };
            })}
            onChange={(data) => {
              const prop = window.bcms.util.object.instance(props.prop);
              (prop.data as PropValueType)[0] = data.value;
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
