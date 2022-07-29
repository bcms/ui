<script lang="tsx">
import { computed, defineComponent, PropType } from 'vue';
import { DefaultComponentProps } from '../_default';
import {
  BCMSPropWrapper,
  BCMSPropWrapperArray,
  BCMSPropWrapperArrayItem,
} from './_wrapper';
import { BCMSDateInput } from '../input';
import type {
  BCMSArrayPropMoveEventData,
  BCMSPropValueExtended,
} from '../../types';

type PropValueType = number[];

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    prop: {
      type: Object as PropType<BCMSPropValueExtended>,
      required: true,
    },
    basePropPath: String,
  },
  emits: {
    update: (_value: number, _propPath: string) => {
      return true;
    },
    add: (_propPath: string) => {
      return true;
    },
    move: (_propPath: string, _moveData: BCMSArrayPropMoveEventData) => {
      return true;
    },
    remove: (_propPath: string) => {
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
        cyTag="prop-string"
        class={props.class}
        style={props.style}
        prop={props.prop}
      >
        <div>
          {props.prop.array ? (
            <BCMSPropWrapperArray
              prop={props.prop}
              onAdd={() => {
                ctx.emit('add', props.basePropPath + '.data');
                // const prop = window.bcms.util.object.instance(props.prop);
                // (prop.data as PropValueType).push(Date.now());
                // ctx.emit('update', prop);
              }}
            >
              {(props.prop.data as PropValueType).map((_, valueIndex) => {
                return (
                  <BCMSPropWrapperArrayItem
                    arrayLength={propsValue.value.length}
                    itemPositionInArray={valueIndex}
                    onMove={(data) => {
                      ctx.emit('move', props.basePropPath + '.data', data);
                      // const replaceValue =
                      //   propsValue.value[
                      //     data.currentItemPosition + data.direction
                      //   ];
                      // const val = propsValue.value;
                      // val[data.currentItemPosition + data.direction] =
                      //   0 + val[data.currentItemPosition];
                      // val[data.currentItemPosition] = replaceValue;
                      // const prop = window.bcms.util.object.instance(props.prop);
                      // prop.data = val;
                      // ctx.emit('update', prop);
                    }}
                    onRemove={(index) => {
                      ctx.emit('remove', props.basePropPath + '.data.' + index);
                      // const prop = window.bcms.util.object.instance(props.prop);
                      // (prop.data as PropValueType).splice(index, 1);
                      // ctx.emit('update', prop);
                    }}
                  >
                    <BCMSDateInput
                      propPath={props.basePropPath + '.data.' + valueIndex}
                      value={
                        propsValue.value[valueIndex]
                          ? propsValue.value[valueIndex]
                          : Date.now()
                      }
                      onInput={(inputValue) => {
                        ctx.emit(
                          'update',
                          inputValue,
                          props.basePropPath + '.data.' + valueIndex
                        );
                        // const prop = window.bcms.util.object.instance(
                        //   props.prop
                        // );
                        // (prop.data as PropValueType)[valueIndex] = inputValue;
                        // ctx.emit('update', prop);
                      }}
                    />
                  </BCMSPropWrapperArrayItem>
                );
              })}
            </BCMSPropWrapperArray>
          ) : (
            <BCMSDateInput
              propPath={props.basePropPath + '.data.0'}
              value={propsValue.value[0] ? propsValue.value[0] : Date.now()}
              onInput={(value) => {
                ctx.emit('update', value, props.basePropPath + '.data.0');
                // const prop: BCMSPropValueExtended = JSON.parse(
                //   JSON.stringify(props.prop)
                // );
                // (prop.data as PropValueType)[0] = value;
                // ctx.emit('update', prop);
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
