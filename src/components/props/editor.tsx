import { defineComponent, PropType, reactive } from 'vue';
import { BCMSPropType } from '@becomes/cms-sdk/types';
import { DefaultComponentProps } from '../_default';
import type {
  BCMSPropEditorUpdateEventData,
  BCMSPropValueExtended,
} from '../../types';
import BCMSPropString from './string';
import BCMSPropNumber from './number';
import BCMSPropBoolean from './boolean';
import BCMSPropDate from './date';
import BCMSPropEnum from './enum';
import BCMSPropEntryPointer from './entry-pointer';
import BCMSPropGroupPointer from './group-pointer';
import BCMSPropMedia from './media';
import BCMSPropRichText from './rich-text';

const singleColItems = [
  BCMSPropType.BOOLEAN,
  BCMSPropType.DATE,
  BCMSPropType.ENUMERATION,
  BCMSPropType.NUMBER,
];

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    lng: String,
    props: {
      type: Array as PropType<BCMSPropValueExtended[]>,
      required: true,
    },
  },
  emits: {
    update: (_data: BCMSPropEditorUpdateEventData) => {
      return true;
    },
  },
  setup(props, ctx) {
    props = reactive(props);
    let checkNextType = true;

    function isSingleCol(
      currentProp: BCMSPropValueExtended,
      nextProp?: BCMSPropValueExtended
    ): boolean {
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
        class={`grid grid-cols-2 gap-4 ${props.class}`}
        style={props.style}
        v-cy={props.cyTag ? props.cyTag : 'props'}
      >
        {props.props.map((prop, propIndex) => {
          return (
            <div
              class={`max-w-full col-span-2 ${
                isSingleCol(prop, props.props[propIndex + 1])
                  ? 'xs:col-span-1'
                  : ''
              }`}
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
                <BCMSPropDate
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
                  templateIds={prop.templateIds}
                  prop={prop}
                  onUpdate={(propModified) => {
                    ctx.emit('update', { propIndex, prop: propModified });
                  }}
                />
              ) : prop.type === BCMSPropType.GROUP_POINTER ? (
                <BCMSPropGroupPointer
                  prop={prop}
                  lng={props.lng}
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
              ) : prop.type === BCMSPropType.RICH_TEXT ? (
                <BCMSPropRichText
                  prop={prop}
                  lng={props.lng}
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
