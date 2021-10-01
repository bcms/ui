<script lang="tsx">
import { computed, defineComponent, onBeforeUpdate, onMounted } from 'vue';
import { DefaultComponentProps } from '../_default';
import BCMSImage from '../image.vue';
import BCMSIcon from '../icon.vue';
import BCMSLink from '../link.vue';
import { BCMSMedia } from '@becomes/cms-sdk/types';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    value: {
      type: String,
      default: '',
    },
    invalidText: {
      type: String,
      default: '',
    },
  },
  emits: {
    clear: () => {
      return true;
    },
    click: () => {
      return true;
    },
  },
  setup(props, ctx) {
    const throwable = window.bcms.util.throwable;
    const store = window.bcms.sdk.store;
    const media = computed<{ data: BCMSMedia; src: string } | undefined>(() => {
      const m = store.getters.media_findOne((e) => e._id === props.value);
      if (!m) {
        return undefined;
      }
      return {
        data: m,
        src: m.name,
        // src: window.bcms.media
        //   .getPath({
        //     allMedia: store.getters.media_items,
        //     target: m,
        //   })
        //   .join('/'),
      };
    });
    let idBuffer = '' + props.value;

    async function getMedia() {
      await throwable(
        async () => {
          await window.bcms.sdk.media.getById(idBuffer);
        },
        undefined,
        async () => {
          // Do nothing
        }
      );
    }

    onMounted(async () => {
      if (!media.value && idBuffer) {
        getMedia();
      }
    });
    onBeforeUpdate(async () => {
      if (idBuffer !== props.value) {
        idBuffer = props.value;
        if (!media.value && idBuffer.length === 24) {
          await getMedia();
        }
      }
    });

    return () => (
      <div
        class={`bcmsMedia group flex p-2.5 rounded-3.5 border border-dotted border-green bg-light ${
          props.invalidText && !props.value
            ? 'border border-dotted border-red'
            : ''
        } ${props.class}`}
      >
        {props.value ? (
          <>
            <button
              onClick={() => {
                ctx.emit('click');
              }}
              class="group flex text-dark text-sm leading-tight flex-grow text-left h-20"
            >
              <div
                class={`flex mr-5 flex-shrink-0 ${
                  !media.value ? 'w-8 h-auto' : 'w-20 h-20'
                }`}
              >
                <BCMSImage
                  class={`w-full h-full object-cover object-center fill-current rounded-2.5 ${
                    media.value ? 'text-grey' : 'text-red'
                  }`}
                  media={media.value?.data}
                  alt=""
                />
              </div>
              <div class="flex flex-col items-start justify-center">
                <div
                  class={`bcmsMedia--details-path ${
                    media.value ? '' : 'text-red'
                  }`}
                >
                  {media.value
                    ? media.value.src
                    : 'Broken file - file does not exist any more.'}
                </div>
                <div class="font-medium text-base leading-normal text-center -tracking-0.01 text-green mt-2.5 group-hover:underline">
                  Click to select another media
                </div>
              </div>
            </button>
            {media.value ? (
              <BCMSLink
                href={`/dashboard/media?search=${encodeURIComponent(
                  media.value.data._id
                )}`}
                class="group flex items-center justify-center w-15"
              >
                <BCMSIcon
                  src="/link"
                  class="w-5.5 h-auto relative opacity-0 text-grey fill-current transition-all duration-300 translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0"
                />
              </BCMSLink>
            ) : (
              ''
            )}
            <button
              aria-label="clear"
              class="group flex items-center justify-center w-15"
              onClick={() => {
                ctx.emit('clear');
              }}
            >
              <BCMSIcon
                src="/trash"
                class="w-6 h-auto relative opacity-0 text-grey fill-current transition-all duration-300 translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0"
              />
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              ctx.emit('click');
            }}
            class="group flex text-dark text-sm leading-tight flex-grow text-left h-20"
          >
            <div
              class={`font-medium text-base leading-normal text-center -tracking-0.01 text-green w-full self-center group-hover:underline ${
                props.invalidText ? 'text-red' : ''
              }`}
            >
              {props.invalidText
                ? 'Media file is required. Please select one'
                : 'Click to select a media'}
            </div>
          </button>
        )}
      </div>
    );
  },
});
export default component;
</script>
