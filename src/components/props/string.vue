<script lang="tsx">
import {
  computed,
  defineComponent,
  onBeforeUpdate,
  onUnmounted,
  PropType,
  reactive,
  ref,
} from 'vue';
import { DefaultComponentProps } from '../_default';
import {
  BCMSPropWrapper,
  BCMSPropWrapperArray,
  BCMSPropWrapperArrayItem,
} from './_wrapper';
import { BCMSTextAreaInput } from '../input';
import type { BCMSPropValueExtended } from '../../types';
import { useTranslation } from '../../translations';

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
    const translations = computed(() => {
      return useTranslation();
    });
    props = reactive(props);
    // const propsValue = computed(() => {
    //   return props.prop.data as PropValueType;
    // });
    const errors = ref((props.prop.data as PropValueType).map(() => ''));
    const unregisterFromChecker = window.bcms.prop.checker.register(() => {
      let isOk = true;
      if (props.prop.required) {
        if ((props.prop.data as PropValueType).length === 0) {
          errors.value[0] = translations.value.prop.input.error.emptyValue;
          isOk = false;
        } else {
          for (let i = 0; i < (props.prop.data as PropValueType).length; i++) {
            if (!(props.prop.data as PropValueType)[i]) {
              errors.value[i] = translations.value.prop.input.error.emptyValue;
              isOk = false;
            } else {
              errors.value[i] = '';
            }
          }
        }
      }
      return isOk;
    });

    onBeforeUpdate(() => {
      const value = props.prop.data as PropValueType;
      if (value.length !== errors.value.length) {
        errors.value = value.map(() => '');
      }
    });
    onUnmounted(() => {
      unregisterFromChecker();
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
                const prop = window.bcms.util.object.instance(props.prop);
                (prop.data as PropValueType).push('');
                ctx.emit('update', prop);
              }}
            >
              {(props.prop.data as PropValueType).map((_, valueIndex) => {
                return (
                  <BCMSPropWrapperArrayItem
                    arrayLength={(props.prop.data as PropValueType).length}
                    itemPositionInArray={valueIndex}
                    onMove={(data) => {
                      const replaceValue = (props.prop.data as PropValueType)[
                        data.currentItemPosition + data.direction
                      ];
                      const val = props.prop.data as PropValueType;
                      val[data.currentItemPosition + data.direction] =
                        '' + val[data.currentItemPosition];
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
                    <BCMSTextAreaInput
                      value={(props.prop.data as PropValueType)[valueIndex]}
                      placeholder={props.prop.label}
                      invalidText={errors.value[valueIndex]}
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
            <>
              <BCMSTextAreaInput
                value={(props.prop.data as PropValueType)[0]}
                placeholder={props.prop.label}
                invalidText={errors.value[0]}
                onInput={(value) => {
                  const prop = window.bcms.util.object.instance(props.prop);
                  (prop.data as PropValueType)[0] = value;
                  ctx.emit('update', prop);
                }}
              />
            </>
          )}
        </div>
      </BCMSPropWrapper>
    );
  },
});
export default component;
</script>
