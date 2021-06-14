<script lang="tsx">
import { computed, defineComponent, onMounted, PropType, reactive } from 'vue';
import type { BCMSProp, BCMSPropGroupPointer } from '@becomes/cms-sdk/types';
import { DefaultComponentProps } from '../_default';
import {
  BCMSPropWrapper,
  BCMSPropWrapperArray,
  BCMSPropWrapperArrayItem,
} from './_wrapper';
import BCMSPropsEditor from './editor.vue';
import { BCMSStoreMutationTypes } from '../../types';

type PropValueType = BCMSPropGroupPointer;

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
    const store = window.bcms.vue.useStore();
    const propsValue = computed(() => {
      return props.prop.value as PropValueType;
    });
    const group = computed(() => {
      return store.getters.group_findOne(
        (e) => e._id === (props.prop.value as PropValueType)._id
      );
    });

    onMounted(async () => {
      if (!group.value) {
        await window.bcms.services.error.wrapper(
          async () => {
            return await window.bcms.sdk.group.get(
              (props.prop.value as PropValueType)._id
            );
          },
          async (result) => {
            store.commit(BCMSStoreMutationTypes.group_set, result);
          }
        );
      }
    });

    return () => (
      <BCMSPropWrapper
        id={props.id}
        cyTag="prop-group-pointer"
        class={props.class}
        style={props.style}
        prop={props.prop}
      >
        <div class="prop--group-pointer">
          {props.prop.array ? (
            <BCMSPropWrapperArray
              prop={props.prop}
              onAdd={() => {
                const prop = window.bcms.services.general.objectInstance(
                  props.prop
                );
                (prop.value as PropValueType).items[0].props.push();
                ctx.emit('update', prop);
              }}
            >
              {propsValue.value.items.map((_, itemIndex) => {
                return (
                  <BCMSPropWrapperArrayItem
                    arrayLength={propsValue.value.items.length}
                    itemPositionInArray={itemIndex}
                    onMove={(data) => {
                      const replaceValue =
                        propsValue.value.items[
                          data.currentItemPosition + data.direction
                        ];
                      const val = propsValue.value;
                      val.items[data.currentItemPosition + data.direction] =
                        window.bcms.services.general.objectInstance(
                          val.items[data.currentItemPosition]
                        );
                      val.items[data.currentItemPosition] = replaceValue;
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
                      propsValue.value.items.splice(index, 1);
                      ctx.emit('update', prop);
                    }}
                  >
                    {group.value ? (
                      <BCMSPropsEditor
                        props={propsValue.value.items[itemIndex].props}
                        onUpdate={(event) => {
                          const prop =
                            window.bcms.services.general.objectInstance(
                              props.prop
                            );
                          (prop.value as PropValueType).items[itemIndex].props[
                            event.propIndex
                          ] = event.prop;
                          ctx.emit('update', prop);
                        }}
                      />
                    ) : (
                      'Loading...'
                    )}
                  </BCMSPropWrapperArrayItem>
                );
              })}
            </BCMSPropWrapperArray>
          ) : (
            <>
              {group.value ? (
                <BCMSPropsEditor
                  props={propsValue.value.items[0].props}
                  onUpdate={(event) => {
                    const prop = window.bcms.services.general.objectInstance(
                      props.prop
                    );
                    (prop.value as PropValueType).items[0].props[
                      event.propIndex
                    ] = event.prop;
                    ctx.emit('update', prop);
                  }}
                />
              ) : (
                'Loading...'
              )}
            </>
          )}
        </div>
      </BCMSPropWrapper>
    );
  },
});
export default component;
</script>
