<script lang="tsx">
import {
  computed,
  defineComponent,
  onBeforeUpdate,
  onMounted,
  PropType,
} from 'vue';
import { DefaultComponentProps } from '../_default';
import BCMSImage from '../image.vue';
import BCMSIcon from '../icon.vue';
import BCMSLink from '../link.vue';
import BCMSTextArea from './text-area.vue';
import {
  BCMSMedia,
  BCMSMediaType,
  BCMSPropValueMediaData,
} from '@becomes/cms-sdk/types';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    value: {
      type: Object as PropType<BCMSPropValueMediaData>,
      default: () => {
        return {
          _id: '',
        };
      },
    },
    label: {
      type: String,
      default: '',
    },
    showLink: {
      type: Boolean,
      default: true,
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
    altTextChange: (_value: string) => {
      return true;
    },
    captionChange: (_value: string) => {
      return true;
    },
  },
  setup(props, ctx) {
    const throwable = window.bcms.util.throwable;
    const store = window.bcms.vue.store;
    const media = computed<
      { data: BCMSMedia; src: string; type: BCMSMediaType } | undefined
    >(() => {
      const m = store.getters.media_findOne((e) => e._id === props.value._id);
      if (!m) {
        return undefined;
      }
      return {
        data: m,
        src: m.name,
        type: m.type,
      };
    });
    let idBuffer = '' + props.value._id;

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
      if (idBuffer !== props.value._id) {
        idBuffer = props.value._id;
        if (!media.value && idBuffer.length === 24) {
          await getMedia();
        }
      }
    });

    return () => (
      <div class="bcmsMedia">
        <div class="flex flex-col">
          {props.label && (
            <span class="font-normal not-italic text-xs leading-normal tracking-0.06 uppercase select-none mb-1.25 block">
              {props.label}
            </span>
          )}
          <div
            class={`group flex p-2.5 rounded-3.5 border border-dotted  bg-light ${
              props.invalidText && !props.value ? ' border-red' : 'border-green'
            } ${props.class}`}
          >
            {props.value ? (
              <>
                <button
                  onClick={() => {
                    ctx.emit('click');
                  }}
                  class="group flex items-center text-dark text-sm leading-tight flex-grow text-left h-20"
                >
                  <div
                    class={`flex mr-5 flex-shrink-0 ${
                      !media.value ? 'w-8 h-auto' : 'w-14 h-14 md:w-20 md:h-20'
                    }`}
                  >
                    {media.value?.type === BCMSMediaType.IMG ? (
                      <BCMSImage
                        class={`w-full h-full object-cover object-center fill-current rounded-2.5 ${
                          media.value ? 'text-grey' : 'text-red'
                        }`}
                        media={media.value?.data}
                        alt=""
                      />
                    ) : (
                      <BCMSIcon
                        src="/file"
                        class={`h-auto text-grey fill-current`}
                      />
                    )}
                  </div>
                  <div class="flex flex-col items-start justify-center">
                    <div
                      class={`line-clamp-1 break-all ${
                        media.value ? '' : 'text-red'
                      }`}
                    >
                      {media.value
                        ? media.value.src
                        : 'Broken file - file does not exist any more.'}
                    </div>
                    <div class="font-medium text-base leading-normal text-left line-clamp-2 -tracking-0.01 text-green mt-2.5 group-hover:underline">
                      Click to select another media
                    </div>
                  </div>
                </button>
                {media.value && props.showLink ? (
                  <BCMSLink
                    href={`/dashboard/media?search=${encodeURIComponent(
                      media.value.data._id
                    )}`}
                    class="group flex items-center justify-center w-15 text-grey hover:text-dark focus:text-dark"
                  >
                    <BCMSIcon
                      src="/link"
                      class="w-5.5 h-auto relative fill-current transition-all duration-300 translate-x-1.5 md:opacity-0 md:group-hover:opacity-100 md:group-hover:translate-x-0 md:group-hover:translate-y-0"
                    />
                  </BCMSLink>
                ) : (
                  ''
                )}
                <button
                  aria-label="clear"
                  class="group flex items-center justify-center w-15 text-grey hover:text-dark focus:text-dark"
                  onClick={() => {
                    ctx.emit('clear');
                  }}
                >
                  <BCMSIcon
                    src="/trash"
                    class="w-6 h-auto relative fill-current transition-all duration-300 translate-x-1.5 md:opacity-0 md:group-hover:opacity-100 md:group-hover:translate-x-0 md:group-hover:translate-y-0"
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
                  class={`font-medium text-base leading-normal text-center -tracking-0.01 w-full self-center group-hover:underline ${
                    props.invalidText ? 'text-red' : 'text-green'
                  }`}
                >
                  {props.invalidText
                    ? 'Media file is required. Please select one'
                    : 'Click to select a media'}
                </div>
              </button>
            )}
          </div>
        </div>
        <BCMSTextArea
          class="mt-5"
          label="Alt text"
          placeholder="Alt text"
          value={props.value.alt_text}
          onInput={(value) => {
            ctx.emit('altTextChange', value);
          }}
        />
        <BCMSTextArea
          class="mt-5"
          label="Caption"
          placeholder="Caption"
          value={props.value.caption}
          onInput={(value) => {
            ctx.emit('captionChange', value);
          }}
        />
      </div>
    );
  },
});
export default component;
</script>
