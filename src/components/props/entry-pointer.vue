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
import { BCMSSelect } from '../input';
import { BCMSPropValueExtended, BCMSSelectOption } from '../../types';
import { useThrowable } from '../../util';

type PropValueType = string[];

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
    const throwable = useThrowable();
    const store = window.bcms.sdk.store;
    const propsValue = computed(() => {
      return props.prop.data as PropValueType;
    });
    const errors = ref((props.prop.data as PropValueType).map(() => ''));
    const entriesData = computed<BCMSSelectOption[]>(() => {
      return store.getters
        .entryLite_find((e) => e.templateId === props.prop.templateId)
        .map((e) => {
          return {
            label: (e.meta[0].props[0].data as string[])[0],
            value: e._id,
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
      return isOk;
    });

    onMounted(async () => {
      if (entriesData.value.length === 0) {
        await throwable(async () => {
          return await window.bcms.sdk.entry.getAllLite({
            templateId: props.prop.templateId as string,
          });
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
        <div class="prop--entry-pointer">
          {props.prop.array ? (
            <BCMSPropWrapperArray
              prop={props.prop}
              onAdd={() => {
                const prop = window.bcms.util.object.instance(props.prop);
                (prop.data as PropValueType).push('');
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
                    <BCMSSelect
                      cyTag={`prop-entry-pointer-option-${entryIdIndex}`}
                      placeholder="Select an entry"
                      invalidText={errors.value[entryIdIndex]}
                      selected={propsValue.value[entryIdIndex]}
                      options={entriesData.value}
                      onChange={(options) => {
                        const prop = window.bcms.util.object.instance(
                          props.prop
                        );
                        (prop.data as PropValueType)[entryIdIndex] =
                          options.value;
                        ctx.emit('update', prop);
                      }}
                    />
                  </BCMSPropWrapperArrayItem>
                );
              })}
            </BCMSPropWrapperArray>
          ) : (
            <BCMSSelect
              cyTag={`prop-entry-pointer-option`}
              placeholder="Select an entry"
              invalidText={errors.value[0]}
              selected={propsValue.value[0]}
              options={entriesData.value}
              onChange={(options) => {
                const prop = window.bcms.util.object.instance(props.prop);
                (prop.data as PropValueType)[0] = options.value;
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
