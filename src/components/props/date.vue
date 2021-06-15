<script lang="tsx">
import { computed, defineComponent, PropType } from 'vue';
import type { BCMSProp } from '@becomes/cms-sdk/types';
import { DefaultComponentProps } from '../_default';
import {
  BCMSPropWrapper,
  BCMSPropWrapperArray,
  BCMSPropWrapperArrayItem,
} from './_wrapper';
import { BCMSDateInput } from '../input';

type PropValueType = number[];

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

    return () => (
      <BCMSPropWrapper
        id={props.id}
        cyTag="prop-string"
        class={props.class}
        style={props.style}
        prop={props.prop}
      >
        <div class="prop--string">
          {props.prop.array ? (
            <BCMSPropWrapperArray
              prop={props.prop}
              onAdd={() => {
                const prop = window.bcms.services.general.objectInstance(
                  props.prop
                );
                (prop.value as PropValueType).push(Date.now());
                ctx.emit('update', prop);
              }}
            >
              {(props.prop.value as PropValueType).map((_, valueIndex) => {
                return (
                  <BCMSPropWrapperArrayItem
                    arrayLength={propsValue.value.length}
                    itemPositionInArray={valueIndex}
                    onMove={(data) => {
                      const replaceValue =
                        propsValue.value[
                          data.currentItemPosition + data.direction
                        ];
                      const val = propsValue.value;
                      val[data.currentItemPosition + data.direction] =
                        0 + val[data.currentItemPosition];
                      val[data.currentItemPosition] = replaceValue;
                      const prop = window.bcms.services.general.objectInstance(
                        props.prop
                      );
                      prop.value = val;
                      ctx.emit('update', prop);
                    }}
                    onRemove={(index) => {
                      const prop = window.bcms.services.general.objectInstance(
                        props.prop
                      );
                      (prop.value as PropValueType).splice(index, 1);
                      ctx.emit('update', prop);
                    }}
                  >
                    <BCMSDateInput
                      value={propsValue.value[valueIndex]}
                      onInput={(inputValue) => {
                        const prop =
                          window.bcms.services.general.objectInstance(
                            props.prop
                          );
                        (prop.value as PropValueType)[valueIndex] = inputValue;
                        ctx.emit('update', prop);
                      }}
                    />
                  </BCMSPropWrapperArrayItem>
                );
              })}
            </BCMSPropWrapperArray>
          ) : (
            <BCMSDateInput
              value={propsValue.value[0]}
              onInput={(value) => {
                const prop = window.bcms.services.general.objectInstance(
                  props.prop
                );
                (prop.value as PropValueType)[0] = value;
                ctx.emit('update', prop);
              }}
            />
          )}
        </div>
      </BCMSPropWrapper>
    );
  },
});
export default component;
</script>
