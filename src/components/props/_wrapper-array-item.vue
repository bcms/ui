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
        class={`entryEditor--prop rounded-2.5 border border-solid border-pink pt-9 px-2.5 pb-6 relative border-t-0 rounded-t-none mb-10 sm:px-5 ${
          props.itemPositionInArray === 0 ? 'mb-10' : 'last:mb-10'
        } entryEditor--prop_ARRAY_ITEM ${props.class}`}
      >
        <div class="entryEditor--prop-header absolute -top-2.5 -left-px flex items-center justify-between">
          <div class="entryEditor--prop-header-inner flex items-center pb-1.5 relative w-full justify-between">
            <div class="entryEditor--prop-header-details flex items-center relative w-full pl-4 pr-3.5 translate-x-0 translate-y-[-7px]">
              <div class="entryEditor--prop-header-label text-xs leading-normal tracking-0.06 uppercase text-pink flex-grow-0 mr-1 flex-shrink-0">
                Item {props.itemPositionInArray + 1}
              </div>
            </div>
            <div class="entryEditor--prop-header-actions flex items-center flex-nowrap flex-shrink-0 pr-4 -mt-4">
              {props.itemPositionInArray > 0 ? (
                <button
                  class="p-1.25"
                  onClick={() => {
                    ctx.emit('move', {
                      direction: -1,
                      currentItemPosition: props.itemPositionInArray,
                    });
                  }}
                >
                  <BCMSIcon
                    src="/arrow/up"
                    class="w-6 h-auto block text-pink fill-current"
                  />
                </button>
              ) : (
                ''
              )}
              {props.itemPositionInArray < props.arrayLength - 1 ? (
                <button
                  class="p-1.25"
                  onClick={() => {
                    ctx.emit('move', {
                      direction: 1,
                      currentItemPosition: props.itemPositionInArray,
                    });
                  }}
                >
                  <BCMSIcon
                    src="/arrow/down"
                    class="w-6 h-auto block text-pink fill-current"
                  />
                </button>
              ) : (
                ''
              )}
              <button
                class="p-1.25"
                onClick={() => {
                  ctx.emit('remove', props.itemPositionInArray);
                }}
              >
                <BCMSIcon
                  src="/trash"
                  class="w-6 h-auto block text-pink fill-current"
                />
              </button>
            </div>
          </div>
        </div>
        <div class="entryEditor--prop_ARRAY_ITEM-content justify-between flex-wrap gap-2.5 -mt-2.5">
          {ctx.slots.default ? ctx.slots.default() : ''}
        </div>
      </div>
    );
  },
});
export default component;
</script>
