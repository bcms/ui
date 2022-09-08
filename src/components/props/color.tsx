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
import { BCMSColorPickerInput } from '../input';
import type {
  BCMSPropValueExtended,
  BCMSPropValueExtendedColorPicker,
} from '../../types';
import { useTranslation } from '../../translations';

type PropValueType = BCMSPropValueExtendedColorPicker;

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    prop: {
      type: Object as PropType<BCMSPropValueExtended>,
      required: true,
    },
    lng: {
      type: String,
      default: 'en',
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

    const propData = computed(() => {
      return props.prop.data as PropValueType;
    });

    const errors = ref(propData.value.value.map(() => ''));
    const unregisterFromChecker = window.bcms.prop.checker.register(() => {
      let isOk = true;
      if (props.prop.required) {
        if (propData.value.value.length === 0) {
          errors.value[0] = translations.value.prop.input.error.emptyValue;
          isOk = false;
        } else {
          for (let i = 0; i < propData.value.value.length; i++) {
            if (!propData.value.value[i]) {
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
      const value = propData.value.value;
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
                (prop.data as PropValueType).value.push('');
                ctx.emit('update', prop);
              }}
            >
              {propData.value.value.map((_, valueIndex) => {
                return (
                  <BCMSPropWrapperArrayItem
                    arrayLength={propData.value.value.length}
                    itemPositionInArray={valueIndex}
                    onMove={(data) => {
                      const replaceValue =
                        propData.value.value[
                          data.currentItemPosition + data.direction
                        ];
                      const val = propData.value.value;
                      val[data.currentItemPosition + data.direction] =
                        '' + val[data.currentItemPosition];
                      val[data.currentItemPosition] = replaceValue;
                      const prop = window.bcms.util.object.instance(props.prop);
                      (prop.data as PropValueType).value = val;
                      ctx.emit('update', prop);
                    }}
                    onRemove={(index) => {
                      const prop = window.bcms.util.object.instance(props.prop);
                      (prop.data as PropValueType).value.splice(index, 1);
                      ctx.emit('update', prop);
                    }}
                  >
                    <BCMSColorPickerInput
                      value={propData.value.value[valueIndex]}
                      view="entry"
                      onChange={(inputValue) => {
                        const prop = window.bcms.util.object.instance(
                          props.prop
                        );
                        (prop.data as PropValueType).value[valueIndex] =
                          inputValue;
                        ctx.emit('update', prop);
                      }}
                    />
                  </BCMSPropWrapperArrayItem>
                );
              })}
            </BCMSPropWrapperArray>
          ) : (
            <>
              <BCMSColorPickerInput
                value={propData.value.value[0] || ''}
                view="entry"
                allowCustom={propData.value.options.allowCustom}
                allowGlobal={propData.value.options.allowGlobal}
                onChange={(inputValue) => {
                  const prop = window.bcms.util.object.instance(props.prop);

                  (prop.data as PropValueType).value[0] = inputValue;
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
