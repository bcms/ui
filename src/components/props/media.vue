<script lang="tsx">
import {
  computed,
  defineComponent,
  onBeforeUpdate,
  onUnmounted,
  PropType,
  ref,
} from 'vue';
import { DefaultComponentProps } from '../_default';
import {
  BCMSPropWrapper,
  BCMSPropWrapperArray,
  BCMSPropWrapperArrayItem,
} from './_wrapper';
import { BCMSMediaInput } from '../input';
import type { BCMSPropValueExtended } from '../../types';
import type { BCMSPropValueMediaData } from '@becomes/cms-sdk/types';
import { useTranslation } from '../../translations';

type PropValueType = BCMSPropValueMediaData[];

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
    const propsValue = computed(() => {
      return props.prop.data as PropValueType;
    });
    const errors = ref((props.prop.data as PropValueType).map(() => ''));
    const unregisterFromChecker = window.bcms.prop.checker.register(() => {
      let isOk = true;
      if (props.prop.required) {
        if (propsValue.value.length === 0) {
          errors.value[0] = translations.value.prop.media.error.emptyMedia;
          isOk = false;
        } else {
          for (let i = 0; i < propsValue.value.length; i++) {
            if (!propsValue.value[i]._id) {
              errors.value[i] = translations.value.prop.media.error.emptyMedia;
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
        cyTag="prop-media"
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
                (prop.data as PropValueType).push({
                  _id: '',
                });
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
                      const val = window.bcms.util.object.instance(
                        propsValue.value
                      );
                      val[data.currentItemPosition + data.direction] =
                        window.bcms.util.object.instance(
                          val[data.currentItemPosition]
                        );
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
                    <BCMSMediaInput
                      value={propsValue.value[valueIndex]}
                      invalidText={errors.value[valueIndex]}
                      onClick={() => {
                        window.bcms.modal.media.picker.show({
                          title:
                            translations.value.modal.mediaPicker.selectedTitle,
                          media: window.bcms.vue.store.getters.media_findOne(
                            (parent) =>
                              parent._id ===
                              window.bcms.vue.store.getters.media_findOne(
                                (e) =>
                                  e._id === propsValue.value[valueIndex]?._id
                              )?.parentId
                          ),
                          onDone: (data) => {
                            const prop = window.bcms.util.object.instance(
                              props.prop
                            );
                            (prop.data as PropValueType)[valueIndex] = {
                              _id: data.media._id,
                            };
                            ctx.emit('update', prop);
                          },
                        });
                      }}
                      onClear={() => {
                        const prop = window.bcms.util.object.instance(
                          props.prop
                        );
                        (prop.data as PropValueType)[valueIndex] = { _id: '' };
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
                  window.bcms.modal.media.picker.show({
                    title: '', // i18n('modal.mediaPicker.selectedTitle'),
                    media: window.bcms.vue.store.getters.media_findOne(
                      (parent) =>
                        parent._id ===
                        window.bcms.vue.store.getters.media_findOne(
                          (e) => e._id === propsValue.value[0]?._id
                        )?.parentId
                    ),
                    onDone: (data) => {
                      const prop = window.bcms.util.object.instance(props.prop);
                      (prop.data as PropValueType)[0] = { _id: data.media._id };
                      ctx.emit('update', prop);
                    },
                  });
                }}
                onClear={() => {
                  const prop = window.bcms.util.object.instance(props.prop);
                  (prop.data as PropValueType)[0] = {
                    _id: '',
                  };
                  ctx.emit('update', prop);
                }}
                onAltTextChange={(value) => {
                  const prop = window.bcms.util.object.instance(props.prop);
                  if (!(prop.data as PropValueType)[0]) {
                    (prop.data as PropValueType)[0] = { _id: '' };
                  }
                  (prop.data as PropValueType)[0].alt_text = value;
                  ctx.emit('update', prop);
                }}
                onCaptionChange={(value) => {
                  const prop = window.bcms.util.object.instance(props.prop);
                  if (!(prop.data as PropValueType)[0]) {
                    (prop.data as PropValueType)[0] = { _id: '' };
                  }
                  (prop.data as PropValueType)[0].caption = value;
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
