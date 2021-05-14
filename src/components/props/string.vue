<script lang="tsx">
import {
  computed,
  defineComponent,
  onBeforeUpdate,
  onUnmounted,
  PropType, reactive,
  ref
} from 'vue';
import type { BCMSProp } from '@becomes/cms-sdk/types';
import { DefaultComponentProps } from '../_default';
import {
  BCMSPropWrapper,
  BCMSPropWrapperArray,
  BCMSPropWrapperArrayItem,
} from './_wrapper';
import { BCMSTextAreaInput } from '../input';

type PropValueType = string[];

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
    props = reactive(props);
    const propsValue = computed(() => {
      return props.prop.value as PropValueType;
    });
    const errors = ref((props.prop.value as string[]).map(() => ''));
    const unregisterFromChecker = window.bcms.services.propsChecker.register(
      () => {
        let isOk = true;
        if (props.prop.required) {
          for (let i = 0; i < propsValue.value.length; i++) {
            if (!propsValue.value[i]) {
              errors.value[i] = 'Input must contain some text.';
              isOk = false;
            } else {
              errors.value[i] = '';
            }
          }
        }
        return isOk;
      }
    );

    onBeforeUpdate(() => {
      const value = props.prop.value as PropValueType;
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
        <div class="prop--string">
          {props.prop.array ? (
            <BCMSPropWrapperArray
              prop={props.prop}
              onAdd={() => {
                const prop = window.bcms.services.general.objectInstance(
                  props.prop
                );
                (prop.value as PropValueType).push('');
                ctx.emit('update', prop);
              }}
            >
              {(props.prop.value as PropValueType).map((value, valueIndex) => {
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
                        '' + val[data.currentItemPosition];
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
                    <BCMSTextAreaInput
                      value={propsValue.value[valueIndex]}
                      placeholder={props.prop.label}
                      invalidText={errors.value[valueIndex]}
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
            <>
              <BCMSTextAreaInput
                value={propsValue.value[0]}
                placeholder={props.prop.label}
                invalidText={errors.value[0]}
                onInput={(value) => {
                  const prop = window.bcms.services.general.objectInstance(
                    props.prop
                  );
                  (prop.value as PropValueType)[0] = value;
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
