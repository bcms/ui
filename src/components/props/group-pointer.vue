<script lang="tsx">
import { computed, defineComponent, onMounted, PropType } from 'vue';
import { DefaultComponentProps } from '../_default';
import {
  BCMSPropWrapper,
  BCMSPropWrapperArray,
  BCMSPropWrapperArrayItem,
} from './_wrapper';
import BCMSPropsEditor from './editor.vue';
import type {
  BCMSPropValueExtended,
  BCMSPropValueExtendedGroupPointerData,
} from '../../types';
import { useTranslation } from '../../translations';
import { BCMSButton } from '..';

type PropValueType = BCMSPropValueExtendedGroupPointerData;

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    lng: String,
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
    const group = computed(() => {
      return store.getters.group_findOne(
        (e) => e._id === (props.prop.data as PropValueType)._id
      );
    });

    async function addItem() {
      if (group.value) {
        const prop = window.bcms.util.object.instance(props.prop);
        const itemProps: BCMSPropValueExtended[] = [];
        for (let i = 0; i < group.value.props.length; i++) {
          const groupProp = group.value.props[i];
          const extended = await window.bcms.prop.toPropValueExtended({
            prop: groupProp,
            lang: props.lng || '',
          });
          if (extended) {
            itemProps.push(extended);
          }
        }
        (prop.data as PropValueType).items.push({
          props: itemProps,
        });
        ctx.emit('update', prop);
      }
    }

    function removeItem(index: number) {
      const prop = window.bcms.util.object.instance(props.prop);
      (prop.data as PropValueType).items.splice(index, 1);
      ctx.emit('update', prop);
    }

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
        onRemoveGroup={() => {
          removeItem(0);
        }}
      >
        <div>
          {props.prop.array ? (
            <BCMSPropWrapperArray
              prop={props.prop}
              onAdd={async () => {
                await addItem();
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
                      removeItem(index);
                    }}
                  >
                    {group.value ? (
                      <BCMSPropsEditor
                        props={propsValue.value.items[itemIndex].props}
                        lng={props.lng}
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
                      translations.value.prop.groupPointer.loading
                    )}
                  </BCMSPropWrapperArrayItem>
                );
              })}
            </BCMSPropWrapperArray>
          ) : (
            <>
              {group.value && propsValue.value.items.length > 0 ? (
                <BCMSPropsEditor
                  props={propsValue.value.items[0].props}
                  lng={props.lng}
                  onUpdate={(event) => {
                    const prop = window.bcms.util.object.instance(props.prop);
                    (prop.data as PropValueType).items[0].props[
                      event.propIndex
                    ] = event.prop;
                    ctx.emit('update', prop);
                  }}
                />
              ) : group.value ? (
                <BCMSButton
                  size="m"
                  onClick={async () => {
                    await addItem();
                  }}
                >
                  {translations.value.prop.groupPointer.addGroup(
                    group.value.label
                  )}
                </BCMSButton>
              ) : (
                translations.value.prop.groupPointer.loading
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
