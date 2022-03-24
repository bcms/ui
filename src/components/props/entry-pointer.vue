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
import { BCMSMultiSelectItem, BCMSPropValueExtended } from '../../types';
import { BCMSPropValueEntryPointer } from '@becomes/cms-sdk/types';

type PropValueType = BCMSPropValueEntryPointer[];

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
    const throwable = window.bcms.util.throwable;
    const store = window.bcms.vue.store;
    const propsValue = computed(() => {
      return props.prop.data as PropValueType;
    });
    const errors = ref((props.prop.data as PropValueType).map(() => ''));
    // const entriesData = computed<BCMSSelectOption[]>(() => {
    //   return store.getters
    //     .entryLite_find(
    //       (e) =>
    //         !!(props.prop.templateIds as string[]).find(
    //           (t) => t === e.templateId
    //         )
    //     )
    //     .map((e) => {
    //       return {
    //         label: (e.meta[0].props[0].data as string[])[0],
    //         value: `${e.templateId}-${e._id}`,
    //       };
    //     });
    // });
    const entriesData = computed<BCMSMultiSelectItem[]>(() => {
      return store.getters
        .entryLite_find(
          (e) =>
            !!(props.prop.templateIds as string[]).find(
              (t) => t === e.templateId
            )
        )
        .map((e) => {
          return {
            id: `${e.templateId}-${e._id}`,
            title: (e.meta[0].props[0].data as string[])[0],
            imageId: e.meta[0].props[2]
              ? (e.meta[0].props[2].data as string[])[0]
              : undefined,
          };
        });
    });
    const unregisterFromChecker = window.bcms.prop.checker.register(() => {
      let isOk = true;
      if (props.prop.required) {
        for (let i = 0; i < propsValue.value.length; i++) {
          if (!propsValue.value[i]) {
            errors.value[i] = 'Please select an entry';
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
              'This entry is not allowed, please select another.';
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
      unregisterFromChecker();
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
                      onlyOne
                      items={entriesData.value.map((e) => {
                        if (
                          e.id ===
                          `${propsValue.value[entryIdIndex].tid}-${propsValue.value[entryIdIndex].eid}`
                        ) {
                          return {
                            ...e,
                            selected: true,
                          };
                        }
                        return e;
                      })}
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
              onlyOne
              items={entriesData.value.map((e) => {
                if (
                  e.id ===
                  `${propsValue.value[0].tid}-${propsValue.value[0].eid}`
                ) {
                  return {
                    ...e,
                    selected: true,
                  };
                }
                return e;
              })}
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
