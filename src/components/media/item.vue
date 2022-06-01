<script lang="tsx">
import { defineComponent, PropType, reactive } from 'vue';
import type { BCMSMedia } from '@becomes/cms-sdk/types';
import { BCMSMediaType } from '@becomes/cms-sdk/types';
import { DefaultComponentProps } from '../_default';
import BCMSIcon from '../icon.vue';
import BCMSImage from '../image.vue';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    selected: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String as PropType<'view' | 'select'>,
      default: 'view',
    },
    item: {
      type: Object as PropType<BCMSMedia>,
      required: true,
    },
    disableRemove: Boolean,
  },
  emits: {
    open: () => {
      return true;
    },
    remove: () => {
      return true;
    },
  },
  setup(props, ctx) {
    props = reactive(props);

    return () => (
      <li
        class={`media--item media--item_${
          props.item.type
        } overflow-hidden shadow-input self-start transition-shadow duration-300 hover:shadow-inputHover focus-within:shadow-inputHover ${
          props.mode === 'select' ? 'rounded-md' : 'rounded-3xl'
        } ${props.selected ? 'outline-green' : ''} ${
          props.mode === 'select' && props.item.type === BCMSMediaType.DIR
            ? 'col-span-2'
            : ''
        } ${props.class}`}
      >
        <button
          class={`relative text-base leading-relaxed -tracking-0.01 w-full focus:outline-none ${
            props.mode === 'select' ? 'block h-full' : ''
          }`}
          title={[
            props.item.name,
            props.item.type === BCMSMediaType.IMG
              ? `\n\nWidth: ${props.item.width || 'N/A'}\nHeight: ${
                  props.item.height || 'N/A'
                }`
              : '',
          ].join('')}
          onClick={() => {
            ctx.emit('open');
          }}
        >
          {props.item.type !== BCMSMediaType.DIR ? (
            <div
              class={`relative before:block ${
                props.mode === 'select'
                  ? 'before:pt-[100%]'
                  : 'before:pt-[50%] sm:before:pt-[73.63%]'
              }`}
            >
              <div
                class={`absolute top-0 left-0 flex items-center justify-center w-full h-full bg-light`}
              >
                {props.item.type === BCMSMediaType.IMG ||
                props.item.type === BCMSMediaType.VID ||
                props.item.type === BCMSMediaType.GIF ? (
                  <>
                    <BCMSImage
                      media={props.item}
                      alt={props.item.name}
                      class="block w-full h-full object-cover object-center absolute top-0 left-0"
                    />
                    <div class="absolute bottom-0 left-0 py-0.5 px-2.5 rounded-tr-2.5 bg-dark bg-opacity-40 text-white text-center font-medium">
                      {props.item.type}
                    </div>
                  </>
                ) : (
                  <BCMSIcon
                    src="/file"
                    class={`${
                      props.mode === 'select' ? 'w-8' : 'w-15'
                    } h-auto text-grey fill-current mt-2`}
                  />
                )}
              </div>
            </div>
          ) : (
            ''
          )}
          <div
            class={`flex items-center bg-white relative ${
              props.mode === 'select' && props.item.type !== BCMSMediaType.DIR
                ? 'hidden'
                : ''
            }`}
          >
            {props.item.type === BCMSMediaType.DIR ? (
              <BCMSIcon
                class="text-dark stroke-current w-6 h-6 relative z-20 my-5 ml-5 flex-shrink-0 flex"
                src="/folder"
              />
            ) : (
              ''
            )}
            <span
              class={`text-left truncate z-10 relative ml-5 ${
                props.mode === 'select' ? 'mr-2.5' : ''
              }`}
            >
              {props.item.name}
            </span>
            <button
              class={`${
                props.mode === 'select'
                  ? 'hidden'
                  : 'group p-5 flex ml-auto bg-white relative z-20 flex-shrink-0'
              } disabled:cursor-not-allowed`}
              disabled={props.disableRemove}
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                ctx.emit('remove');
              }}
            >
              <BCMSIcon
                src="/trash"
                class={`w-6 h-6 text-dark fill-current transition-colors duration-300 ${
                  props.disableRemove
                    ? ''
                    : 'group-hover:text-red group-focus-visible:text-red'
                } group-disabled:text-grey`}
              />
            </button>
          </div>
        </button>
      </li>
    );
  },
});
export default component;
</script>
