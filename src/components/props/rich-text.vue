<script lang="tsx">
import { v4 as uuidv4 } from 'uuid';
import {
  defineComponent,
  onBeforeUpdate,
  onUnmounted,
  PropType,
  reactive,
  ref,
} from 'vue';
import { DefaultComponentProps } from '../_default';
import {
  BCMSPropWrapper,
  BCMSPropWrapperArray,
  BCMSPropWrapperArrayItem,
} from './_wrapper';
import { BCMSContentEditor } from '../content';
import type {
  BCMSPropValueExtended,
  BCMSPropValueExtendedRichTextData,
} from '../../types';
import type { JSONContent } from '@tiptap/core';

type PropValueType = BCMSPropValueExtendedRichTextData[];

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
    props = reactive(props);
    const errors = ref((props.prop.data as PropValueType).map(() => ''));

    const unregisterFromChecker = window.bcms.prop.checker.register(() => {
      let isOk = true;
      if (props.prop.required) {
        if ((props.prop.data as PropValueType).length === 0) {
          errors.value[0] = 'Input must contain some text.';
          isOk = false;
        } else {
          for (let i = 0; i < (props.prop.data as PropValueType).length; i++) {
            if ((props.prop.data as PropValueType)[i].nodes.length === 0) {
              errors.value[i] = 'Input must contain some text.';
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
        cyTag="prop-richText"
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
                  id: uuidv4(),
                  nodes: [],
                });
                ctx.emit('update', prop);
              }}
            >
              {(props.prop.data as PropValueType).map((_, valueIndex) => {
                return (
                  <BCMSPropWrapperArrayItem
                    arrayLength={(props.prop.data as PropValueType).length}
                    immovable={true}
                    itemPositionInArray={valueIndex}
                    onMove={(data) => {
                      const replaceValue = (props.prop.data as PropValueType)[
                        data.currentItemPosition + data.direction
                      ];
                      const val = props.prop.data as PropValueType;
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
                    <BCMSContentEditor
                      id={(props.prop.data as PropValueType)[valueIndex].id}
                      content={{
                        lng: props.lng || '',
                        nodes: (props.prop.data as PropValueType)[valueIndex]
                          .nodes,
                      }}
                      inMeta={true}
                      invalidText={errors.value[valueIndex]}
                      allowedWidgetIds={[]}
                      onEditorReady={(editor) => {
                        editor.on('update', () => {
                          const prop = window.bcms.util.object.instance(
                            props.prop
                          );
                          (prop.data as PropValueType)[valueIndex].nodes =
                            editor.getJSON().content as JSONContent[];
                          ctx.emit('update', prop);
                        });
                      }}
                    />
                  </BCMSPropWrapperArrayItem>
                );
              })}
            </BCMSPropWrapperArray>
          ) : (
            <>
              <BCMSContentEditor
                content={{
                  lng: props.lng || '',
                  nodes: (props.prop.data as PropValueType)[0].nodes,
                }}
                allowedWidgetIds={[]}
                inMeta={true}
                invalidText={errors.value[0]}
                onEditorReady={(editor) => {
                  editor.on('update', () => {
                    const prop = window.bcms.util.object.instance(props.prop);
                    (prop.data as PropValueType)[0].nodes = editor.getJSON()
                      .content as JSONContent[];
                    ctx.emit('update', prop);
                  });
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
