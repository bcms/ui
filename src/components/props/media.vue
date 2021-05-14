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
import { BCMSMediaInput } from '../input';

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
              errors.value[i] = 'Media file is required. Please select one.';
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
        cyTag="prop-media"
        class={props.class}
        style={props.style}
        prop={props.prop}
      >
        <div class="prop--media">
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
                    <BCMSMediaInput
                      value={propsValue.value[valueIndex]}
                      invalidText={errors.value[valueIndex]}
                      onClick={() => {
                        window.bcms.services.modal.media.picker.show({
                          title: 'Select media file',
                          onDone: (data) => {
                            const prop =
                              window.bcms.services.general.objectInstance(
                                props.prop
                              );
                            (prop.value as PropValueType)[valueIndex] = data
                              .media.isInRoot
                              ? `/${data.media.name}`
                              : `${data.media.path}/${data.media.name}`;
                            ctx.emit('update', prop);
                          },
                        });
                      }}
                      onClear={() => {
                        const prop =
                          window.bcms.services.general.objectInstance(
                            props.prop
                          );
                        (prop.value as PropValueType)[valueIndex] = '';
                        ctx.emit('update', prop);
                      }}
                    />
                  </BCMSPropWrapperArrayItem>
                );
              })}
            </BCMSPropWrapperArray>
          ) : (
            <>
              <BCMSMediaInput
                value={propsValue.value[0]}
                invalidText={errors.value[0]}
                onClick={() => {
                  window.bcms.services.modal.media.picker.show({
                    title: 'Select media file',
                    onDone: (data) => {
                      const prop = window.bcms.services.general.objectInstance(
                        props.prop
                      );
                      (prop.value as PropValueType)[0] = data.media.isInRoot
                        ? `/${data.media.name}`
                        : `${data.media.path}/${data.media.name}`;
                      ctx.emit('update', prop);
                    },
                  });
                }}
                onClear={() => {
                  const prop = window.bcms.services.general.objectInstance(
                    props.prop
                  );
                  (prop.value as PropValueType)[0] = '';
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
