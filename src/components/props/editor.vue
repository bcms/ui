<script lang="tsx">
import { defineComponent, PropType, reactive } from 'vue';
import { BCMSProp, BCMSPropType } from '@becomes/cms-sdk/types';
import { DefaultComponentProps } from '../_default';
import { BCMSPropEditorUpdateEventData } from '../../types';
import BCMSPropString from './string.vue';
import BCMSPropNumber from './number.vue';
import BCMSPropBoolean from './boolean.vue';
import BCMSPropData from './date.vue';
import BCMSPropEnum from './enum.vue';
import BCMSPropEntryPointer from './entry-pointer.vue';
import BCMSPropGroupPointer from './group-pointer.vue';
import BCMSPropMedia from './media.vue';

const singleColItems = [
  BCMSPropType.BOOLEAN,
  BCMSPropType.DATE,
  BCMSPropType.ENUMERATION,
  BCMSPropType.NUMBER,
];

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    props: {
      type: Array as PropType<BCMSProp[]>,
      required: true,
    },
    onUpdate: Function as PropType<
      (data: BCMSPropEditorUpdateEventData) => void | Promise<void>
    >,
  },
  emits: {
    update: (_data: BCMSPropEditorUpdateEventData) => {
      return true;
    },
  },
  setup(props, ctx) {
    props = reactive(props);
    let checkNextType = true;

    function isSingleCol(currentProp: BCMSProp, nextProp?: BCMSProp): boolean {
      if (!checkNextType) {
        checkNextType = true;
        return true;
      }
      if (
        !currentProp.array &&
        singleColItems.includes(currentProp.type) &&
        nextProp &&
        !nextProp.array &&
        singleColItems.includes(nextProp.type)
      ) {
        checkNextType = false;
        return true;
      }
      return false;
    }
    return () => (
      <div
        id={props.id}
        class={`entryEditor--props ${props.class}`}
        style={props.style}
        v-cy={props.cyTag ? props.cyTag : 'props'}
      >
        {props.props.map((prop, propIndex) => {
          return (
            <div
              class={`entryEditor--props-row ${
                isSingleCol(prop, props.props[propIndex + 1])
                  ? 'entryEditor--props-row_half'
                  : ''
              }"`}
            >
              {prop.type === BCMSPropType.STRING ? (
                <BCMSPropString
                  prop={prop}
                  onUpdate={(propModified) => {
                    ctx.emit('update', { propIndex, prop: propModified });
                  }}
                />
              ) : prop.type === BCMSPropType.NUMBER ? (
                <BCMSPropNumber
                  prop={prop}
                  onUpdate={(propModified) => {
                    ctx.emit('update', { propIndex, prop: propModified });
                  }}
                />
              ) : prop.type === BCMSPropType.BOOLEAN ? (
                <BCMSPropBoolean
                  prop={prop}
                  onUpdate={(propModified) => {
                    ctx.emit('update', { propIndex, prop: propModified });
                  }}
                />
              ) : prop.type === BCMSPropType.DATE ? (
                <BCMSPropData
                  prop={prop}
                  onUpdate={(propModified) => {
                    ctx.emit('update', { propIndex, prop: propModified });
                  }}
                />
              ) : prop.type === BCMSPropType.ENUMERATION ? (
                <BCMSPropEnum
                  prop={prop}
                  onUpdate={(propModified) => {
                    ctx.emit('update', { propIndex, prop: propModified });
                  }}
                />
              ) : prop.type === BCMSPropType.ENTRY_POINTER ? (
                <BCMSPropEntryPointer
                  prop={prop}
                  onUpdate={(propModified) => {
                    ctx.emit('update', { propIndex, prop: propModified });
                  }}
                />
              ) : prop.type === BCMSPropType.GROUP_POINTER ? (
                <BCMSPropGroupPointer
                  prop={prop}
                  onUpdate={(propModified) => {
                    ctx.emit('update', { propIndex, prop: propModified });
                  }}
                />
              ) : prop.type === BCMSPropType.MEDIA ? (
                <BCMSPropMedia
                  prop={prop}
                  onUpdate={(propModified) => {
                    ctx.emit('update', { propIndex, prop: propModified });
                  }}
                />
              ) : (
                ''
              )}
            </div>
          );
        })}
      </div>
    );
  },
});
export default component;
</script>
