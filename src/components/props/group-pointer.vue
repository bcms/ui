<script lang="tsx">
import { computed, defineComponent, onMounted, PropType } from 'vue';
import { DefaultComponentProps } from '../_default';
import {
  BCMSPropWrapper,
  BCMSPropWrapperArray,
  BCMSPropWrapperArrayItem,
} from './_wrapper';
import BCMSPropsEditor from './editor.vue';
import {
  BCMSPropValueExtended,
  BCMSPropValueExtendedGroupPointerData,
} from '../../types';

type PropValueType = BCMSPropValueExtendedGroupPointerData;

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
    const store = window.bcms.sdk.store;
    const propsValue = computed(() => {
      return props.prop.data as PropValueType;
    });
    const group = computed(() => {
      return store.getters.group_findOne(
        (e) => e._id === (props.prop.data as PropValueType)._id
      );
    });

    onMounted(async () => {
      if (!group.value) {
        await throwable(async () => {
          return await window.bcms.sdk.group.get(
            (props.prop.data as PropValueType)._id
          );
        });
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
                const prop = window.bcms.util.object.instance(props.prop);
                // TODO: (prop.data as PropValueType).items.push();
                (prop.data as PropValueType).items[0].props.push();
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
                        window.bcms.util.object.instance(
                          val.items[data.currentItemPosition]
                        );
                      val.items[data.currentItemPosition] = replaceValue;
                      const prop = window.bcms.util.object.instance(props.prop);
                      prop.data = val;
                      ctx.emit('update', prop);
                    }}
                    onRemove={(index) => {
                      const prop = window.bcms.util.object.instance(props.prop);
                      (prop.data as PropValueType).items.splice(index, 1);
                      ctx.emit('update', prop);
                    }}
                  >
                    {group.value ? (
                      <BCMSPropsEditor
                        props={propsValue.value.items[itemIndex].props}
                        onUpdate={(event) => {
                          const prop = window.bcms.util.object.instance(
                            props.prop
                          );
                          (prop.data as PropValueType).items[itemIndex].props[
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
                    const prop = window.bcms.util.object.instance(props.prop);
                    (prop.data as PropValueType).items[0].props[
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
