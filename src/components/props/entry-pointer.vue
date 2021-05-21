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
import type { BCMSProp, BCMSPropEntryPointer } from '@becomes/cms-sdk/types';
import { DefaultComponentProps } from '../_default';
import {
  BCMSPropWrapper,
  BCMSPropWrapperArray,
  BCMSPropWrapperArrayItem,
} from './_wrapper';
import { BCMSSelect } from '../input';
import { BCMSSelectOption, BCMSStoreMutationTypes } from '../../types';

type PropValueType = BCMSPropEntryPointer;

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
    const store = window.bcms.vue.useStore();
    const propsValue = computed(() => {
      return props.prop.value as PropValueType;
    });
    const errors = ref(
      (props.prop.value as PropValueType).entryIds.map(() => '')
    );
    const entriesData = computed<BCMSSelectOption[]>(() => {
      return store.getters
        .entryLite_find(
          (e) => e.templateId === (props.prop.value as PropValueType).templateId
        )
        .map((e) => {
          return {
            label: (e.meta[0].props[0].value as string[])[0],
            value: e._id,
          };
        });
    });
    const unregisterFromChecker = window.bcms.services.propsChecker.register(
      () => {
        let isOk = true;
        if (props.prop.required) {
          for (let i = 0; i < propsValue.value.entryIds.length; i++) {
            if (!propsValue.value.entryIds[i]) {
              errors.value[i] = 'Please select an entry';
              isOk = false;
            } else {
              errors.value[i] = '';
            }
          }
        }
        return isOk;
      }
    );

    onMounted(async () => {
      if (entriesData.value.length === 0) {
        await window.bcms.services.error.wrapper(
          async () => {
            return await window.bcms.sdk.entry.getAllLite(
              (props.prop.value as PropValueType).templateId
            );
          },
          async (result) => {
            store.commit(BCMSStoreMutationTypes.entryLite_set, result);
          }
        );
      }
    });
    onBeforeUpdate(() => {
      const value = props.prop.value as PropValueType;
      if (value.entryIds.length !== errors.value.length) {
        errors.value = value.entryIds.map(() => '');
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
        <div class="prop--entry-pointer">
          {props.prop.array ? (
            <BCMSPropWrapperArray
              prop={props.prop}
              onAdd={() => {
                const prop = window.bcms.services.general.objectInstance(
                  props.prop
                );
                (prop.value as PropValueType).entryIds.push('');
                ctx.emit('update', prop);
              }}
            >
              {(props.prop.value as PropValueType).entryIds.map(
                (entryId, entryIdIndex) => {
                  return (
                    <BCMSPropWrapperArrayItem
                      arrayLength={propsValue.value.entryIds.length}
                      itemPositionInArray={entryIdIndex}
                      onMove={(data) => {
                        const replaceValue =
                          propsValue.value.entryIds[
                            data.currentItemPosition + data.direction
                          ];
                        const val = propsValue.value;
                        val.entryIds[
                          data.currentItemPosition + data.direction
                        ] = '' + val.entryIds[data.currentItemPosition];
                        val.entryIds[data.currentItemPosition] = replaceValue;
                        const prop =
                          window.bcms.services.general.objectInstance(
                            props.prop
                          );
                        prop.value = val;
                        ctx.emit('update', prop);
                      }}
                      onRemove={(index) => {
                        const prop =
                          window.bcms.services.general.objectInstance(
                            props.prop
                          );
                        (prop.value as PropValueType).entryIds.splice(index, 1);
                        ctx.emit('update', prop);
                      }}
                    >
                      <BCMSSelect
                        cyTag={`prop-entry-pointer-option-${entryIdIndex}`}
                        placeholder="Select an entry"
                        invalidText={errors.value[entryIdIndex]}
                        selected={propsValue.value.entryIds[entryIdIndex]}
                        options={entriesData.value}
                        onChange={(options) => {
                          const prop =
                            window.bcms.services.general.objectInstance(
                              props.prop
                            );
                          (prop.value as BCMSPropEntryPointer).entryIds[
                            entryIdIndex
                          ] = options.value;
                          ctx.emit('update', prop);
                        }}
                      />
                    </BCMSPropWrapperArrayItem>
                  );
                }
              )}
            </BCMSPropWrapperArray>
          ) : (
            <BCMSSelect
              cyTag={`prop-entry-pointer-option`}
              placeholder="Select an entry"
              invalidText={errors.value[0]}
              selected={propsValue.value.entryIds[0]}
              options={entriesData.value}
              onChange={(options) => {
                const prop = window.bcms.services.general.objectInstance(
                  props.prop
                );
                (prop.value as BCMSPropEntryPointer).entryIds[0] =
                  options.value;
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
