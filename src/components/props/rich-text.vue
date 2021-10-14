<script lang="tsx">
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
import { BCMSPropValueExtended } from '../../types';
import { BCMSPropValueRichTextData } from '@becomes/cms-sdk/types';

type PropValueType = BCMSPropValueRichTextData[];

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
    props = reactive(props);
    const errors = ref((props.prop.data as PropValueType).map(() => ''));
    const unregisterFromChecker = window.bcms.prop.checker.register(() => {
      let isOk = true;
      if (props.prop.required) {
        if ((props.prop.data as PropValueType).length === 0) {
          errors.value[0] = 'Input must contain some text.';
          isOk = false;
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
                  nodes: [],
                });
                ctx.emit('update', prop);
              }}
            >
              {(props.prop.data as PropValueType).map((_, valueIndex) => {
                return (
                  <BCMSPropWrapperArrayItem
                    arrayLength={(props.prop.data as PropValueType).length}
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
                      content={{
                        lng: '',
                        nodes: (props.prop.data as PropValueType)[valueIndex]
                          .nodes,
                      }}
                      allowedWidgetIds={[]}
                      onEditorReady={(editor) => {
                        editor.on('update', () => {
                          const prop = window.bcms.util.object.instance(
                            props.prop
                          );
                          (prop.data as PropValueType)[valueIndex].nodes =
                            editor.getJSON().content;
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
                  lng: '',
                  nodes: (props.prop.data as PropValueType)[0].nodes,
                }}
                allowedWidgetIds={[]}
                onEditorReady={(editor) => {
                  editor.on('update', () => {
                    const prop = window.bcms.util.object.instance(props.prop);
                    (prop.data as PropValueType)[0].nodes =
                      editor.getJSON().content;
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
