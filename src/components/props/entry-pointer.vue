<script lang="tsx">
import {
  computed,
  defineComponent,
  onBeforeUpdate,
  onMounted,
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
import { BCMSMultiSelect } from '../input';
import type { BCMSMultiSelectItem, BCMSPropValueExtended } from '../../types';
import type {
  BCMSMedia,
  BCMSPropValueEntryPointer,
} from '@becomes/cms-sdk/types';
import { BCMSPropType } from '@becomes/cms-sdk/types';
import { useTranslation } from '../../translations';

type PropValueType = BCMSPropValueEntryPointer[];

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    templateIds: Array as PropType<string[]>,
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
    const throwable = window.bcms.util.throwable;
    const store = window.bcms.vue.store;
    const propsValue = computed(() => {
      return props.prop.data as PropValueType;
    });
    const errors = ref((props.prop.data as PropValueType).map(() => ''));
    const entriesData = computed<BCMSMultiSelectItem[]>(() => {
      const output: BCMSMultiSelectItem[] = [];
      if (props.templateIds) {
        for (let j = 0; j < props.templateIds.length; j++) {
          const templateId = props.templateIds[j];
          const template = store.getters.template_findOne(
            (e) => e._id === templateId
          );
          output.push(
            ...store.getters
              .entryLite_find((e) => e.templateId === templateId)
              .map((entry) => {
                console.log();
                let imageId: string | undefined;
                let subtitle: string | undefined;
                if (template) {
                  for (let i = 2; i < entry.meta[0].props.length; i++) {
                    const prop = entry.meta[0].props[i];
                    const tProp = template.props.find((e) => e.id === prop.id);
                    if (tProp && prop.data) {
                      if (
                        tProp.type === BCMSPropType.MEDIA &&
                        (prop.data as BCMSMedia[])[0]
                      ) {
                        imageId = (prop.data as BCMSMedia[])[0]._id;
                      } else if (tProp.type === BCMSPropType.STRING) {
                        subtitle = (prop.data as string[])[0];
                      }
                    }
                  }
                }
                return {
                  id: `${entry.templateId}-${entry._id}`,
                  title: (entry.meta[0].props[0].data as string[])[0],
                  imageId,
                  subtitle,
                };
              })
          );
        }
      }
      return output;
    });
    const unregisterFromChecker = window.bcms.prop.checker.register(() => {
      let isOk = true;
      if (props.prop.required) {
        for (let i = 0; i < propsValue.value.length; i++) {
          if (!propsValue.value[i]) {
            errors.value[i] =
              translations.value.prop.entryPointer.error.emptyEntry;
            isOk = false;
          } else {
            errors.value[i] = '';
          }
        }
      }
      if (props.prop.templateIds) {
        for (let i = 0; i < propsValue.value.length; i++) {
          const value = propsValue.value[i];
          let found = false;
          for (let j = 0; j < props.prop.templateIds.length; j++) {
            const tid = props.prop.templateIds[j];
            if (tid === value.tid) {
              found = true;
            }
          }
          if (!found) {
            errors.value[i] =
              translations.value.prop.entryPointer.error.notAllowed;
            isOk = false;
          } else {
            errors.value[i] = '';
          }
        }
      }
      return isOk;
    });

    onMounted(async () => {
      if (entriesData.value.length === 0) {
        await throwable(async () => {
          for (
            let i = 0;
            i < (props.prop.templateIds as string[]).length;
            i++
          ) {
            const templateId = (props.prop.templateIds as string[])[i];
            await window.bcms.sdk.entry.getAllLite({
              templateId: templateId,
            });
          }
        });
      }
    });
    onBeforeUpdate(() => {
      const value = props.prop.data as PropValueType;
      if (value.length !== errors.value.length) {
        errors.value = value.map(() => '');
      }
    });
    onUnmounted(() => {
      if (unregisterFromChecker) {
        unregisterFromChecker();
      }
    });

    return () => (
      <BCMSPropWrapper
        id={props.id}
        cyTag="prop-entry-pointer"
        class={props.class}
        style={props.style}
        prop={props.prop}
      >
        <div class="flex flex-wrap items-center justify-between w-full gap-2.5">
          {props.prop.array ? (
            <BCMSPropWrapperArray
              prop={props.prop}
              class="w-full"
              onAdd={() => {
                const prop = window.bcms.util.object.instance(props.prop);
                (prop.data as PropValueType).push({
                  tid: '',
                  eid: '',
                });
                ctx.emit('update', prop);
              }}
            >
              {(props.prop.data as PropValueType).map((_, entryIdIndex) => {
                return (
                  <BCMSPropWrapperArrayItem
                    arrayLength={propsValue.value.length}
                    itemPositionInArray={entryIdIndex}
                    onMove={(data) => {
                      const replaceValue =
                        propsValue.value[
                          data.currentItemPosition + data.direction
                        ];
                      const val = propsValue.value;
                      val[data.currentItemPosition + data.direction] =
                        JSON.parse(
                          JSON.stringify(val[data.currentItemPosition])
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
                    <BCMSMultiSelect
                      title={props.prop.label}
                      onlyOne
                      items={entriesData.value
                        .map((e) => {
                          if (
                            propsValue.value[entryIdIndex] &&
                            e.id ===
                              `${propsValue.value[entryIdIndex].tid}-${propsValue.value[entryIdIndex].eid}`
                          ) {
                            return {
                              ...e,
                              selected: true,
                            };
                          }
                          return e;
                        })
                        .sort((a, b) => (b.title > a.title ? -1 : 1))}
                      onChange={(items) => {
                        const prop = window.bcms.util.object.instance(
                          props.prop
                        );
                        if (items.length === 0) {
                          (prop.data as PropValueType)[entryIdIndex] = {
                            tid: '',
                            eid: '',
                          };
                        } else {
                          const [tid, eid] = items[0].id.split('-');
                          (prop.data as PropValueType)[entryIdIndex] = {
                            tid,
                            eid,
                          };
                        }
                        ctx.emit('update', prop);
                      }}
                    />
                  </BCMSPropWrapperArrayItem>
                );
              })}
            </BCMSPropWrapperArray>
          ) : (
            <BCMSMultiSelect
              title={props.prop.label}
              onlyOne
              items={entriesData.value
                .map((e) => {
                  if (
                    propsValue.value[0] &&
                    e.id ===
                      `${propsValue.value[0].tid}-${propsValue.value[0].eid}`
                  ) {
                    return {
                      ...e,
                      selected: true,
                    };
                  }
                  return e;
                })
                .sort((a, b) => (b.title > a.title ? -1 : 1))}
              onChange={(items) => {
                const prop = window.bcms.util.object.instance(props.prop);
                if (items.length === 0) {
                  prop.data = [];
                } else {
                  const [tid, eid] = items[0].id.split('-');
                  (prop.data as PropValueType)[0] = {
                    tid,
                    eid,
                  };
                }
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
