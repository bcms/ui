<script lang="tsx">
import { defineComponent } from 'vue';
import { DefaultComponentProps } from '../_default';
import { BCMSArrayPropMoveEventData } from '../../types';
import { BCMSIcon } from '../index';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    arrayLength: {
      type: Number,
      default: 0,
    },
    itemPositionInArray: {
      type: Number,
      required: true,
    },
  },
  emits: {
    move: (_data: BCMSArrayPropMoveEventData) => {
      return true;
    },
    remove: (_itemPosition: number) => {
      return true;
    },
  },
  setup(props, ctx) {
    return () => (
      <div
        class={`entryEditor--prop entryEditor--prop_ARRAY_ITEM ${props.class}`}
      >
        <div class="entryEditor--prop-header">
          <div class="entryEditor--prop-header-inner">
            <div class="entryEditor--prop-header-details">
              <div class="entryEditor--prop-header-label">
                Item {props.itemPositionInArray + 1}
              </div>
            </div>
            <div class="entryEditor--prop-header-actions">
              {props.itemPositionInArray > 0 ? (
                <button
                  onClick={() => {
                    ctx.emit('move', {
                      direction: -1,
                      currentItemPosition: props.itemPositionInArray,
                    });
                  }}
                >
                  <BCMSIcon src="/arrow/up" />
                </button>
              ) : (
                ''
              )}
              {props.itemPositionInArray < props.arrayLength - 1 ? (
                <button
                  onClick={() => {
                    ctx.emit('move', {
                      direction: 1,
                      currentItemPosition: props.itemPositionInArray,
                    });
                  }}
                >
                  <BCMSIcon src="/arrow/down" />
                </button>
              ) : (
                ''
              )}
              <button
                onClick={() => {
                  ctx.emit('remove', props.itemPositionInArray);
                }}
              >
                <BCMSIcon src="/trash" />
              </button>
            </div>
          </div>
        </div>
        <div class="entryEditor--prop_ARRAY_ITEM-content">
          {ctx.slots.default ? ctx.slots.default() : ''}
        </div>
      </div>
    );
  },
});
export default component;
</script>
