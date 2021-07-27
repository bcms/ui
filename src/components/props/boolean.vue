<script lang="tsx">
import { computed, defineComponent, PropType } from 'vue';
import { DefaultComponentProps } from '../_default';
import {
  BCMSPropWrapper,
  BCMSPropWrapperArray,
  BCMSPropWrapperArrayItem,
} from './_wrapper';
import { BCMSToggleInput } from '../input';
import { BCMSPropValueExtended } from '../../types';

type PropValueType = boolean[];

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    prop: {
      type: Object as PropType<BCMSPropValueExtended>,
      required: true,
    },
    onUpdate: Function as PropType<
      (prop: BCMSPropValueExtended) => void | Promise<void>
    >,
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

    return () => (
      <BCMSPropWrapper
        id={props.id}
        cyTag="prop-boolean"
        class={props.class}
        style={props.style}
        prop={props.prop}
      >
        <div class="prop--boolean">
          {props.prop.array ? (
            <BCMSPropWrapperArray
              prop={props.prop}
              onAdd={() => {
                const prop = window.bcms.util.object.instance(props.prop);
                (prop.data as PropValueType).push(false);
                ctx.emit('update', prop);
              }}
            >
              {(props.prop.data as PropValueType).map((_, valueIndex) => {
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
                        !!val[data.currentItemPosition];
                      val[data.currentItemPosition] = replaceValue;
                      const prop = window.bcms.util.object.instance(props.prop);
                      prop.data = val;
                      ctx.emit('update', prop);
                    }}
                    onRemove={(index) => {
                      const prop = window.bcms.util.object.instance(props.prop);
                      (prop.data as PropValueType).splice(index, 1);
                      ctx.emit('update', prop);
                    }}
                  >
                    <BCMSToggleInput
                      value={propsValue.value[valueIndex]}
                      onInput={(inputValue) => {
                        const prop = window.bcms.util.object.instance(
                          props.prop
                        );
                        (prop.data as PropValueType)[valueIndex] = inputValue;
                        ctx.emit('update', prop);
                      }}
                    />
                  </BCMSPropWrapperArrayItem>
                );
              })}
            </BCMSPropWrapperArray>
          ) : (
            <BCMSToggleInput
              value={propsValue.value[0]}
              onInput={(value) => {
                const prop = window.bcms.util.object.instance(props.prop);
                (prop.data as PropValueType)[0] = value;
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
