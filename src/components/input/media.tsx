import {
  computed,
  defineComponent,
  onBeforeUpdate,
  onMounted,
  PropType,
} from 'vue';
import { DefaultComponentProps } from '../_default';
import BCMSImage from '../image';
import BCMSIcon from '../icon';
import BCMSLink from '../link';
import BCMSTextArea from './text-area';
import type { BCMSMedia, BCMSPropValueMediaData } from '@becomes/cms-sdk/types';
import { useTranslation } from '../../translations';

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
    const translations = computed(() => {
      return useTranslation();
    });
    const throwable = window.bcms.util.throwable;
    const store = window.bcms.vue.store;
    const broken = computed(() => {
      if (props.value._id) {
        const m = store.getters.media_findOne((e) => e._id === props.value._id);
        if (!m) {
          return true;
        }
      }
      return false;
    });
    const media = computed<{ data: BCMSMedia; src: string } | undefined>(() => {
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
            <span class="font-normal not-italic text-xs leading-normal tracking-0.06 uppercase select-none mb-1.25 block dark:text-light">
              {props.label}
            </span>
          )}
          <div
            class={`group flex p-2.5 rounded-3.5 border border-dotted  bg-light ${
              props.invalidText && !props.value._id
                ? ' border-red'
                : 'border-green dark:border-yellow'
            } ${props.class} dark:bg-darkGrey`}
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
                    {media.value ? (
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
                        class={`h-auto text-grey fill-current dark:text-light`}
                      />
                    )}
                  </div>
                  <div class="flex flex-col items-start justify-center">
                    {props.invalidText && !media.value?.data._id ? (
                      <div
                        class={`font-medium text-base leading-normal text-center -tracking-0.01 w-full self-center group-hover:underline ${
                          props.invalidText
                            ? 'text-red'
                            : 'text-green dark:text-yellow'
                        }`}
                      >
                        {props.invalidText}
                      </div>
                    ) : (
                      ''
                    )}
                    {broken.value || media.value ? (
                      <div
                        class={`line-clamp-1 break-all ${
                          media.value ? '' : 'text-red'
                        } dark:text-light`}
                      >
                        {media.value
                          ? media.value.src
                          : broken.value
                          ? 'Broken file - file does not exist any more.'
                          : 'No media selected.'}
                      </div>
                    ) : (
                      ''
                    )}
                    <div class="font-medium text-base leading-normal text-left line-clamp-2 -tracking-0.01 text-green mt-2.5 group-hover:underline dark:text-yellow">
                      {translations.value.input.media.selectAnotherMedia}
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
                  class="group-scoped flex items-center justify-center w-15 text-grey hover:text-dark focus:text-dark"
                  onClick={() => {
                    ctx.emit('clear');
                  }}
                >
                  <BCMSIcon
                    src="/trash"
                    class="w-6 h-6 relative fill-current transition-all duration-300 translate-x-1.5 md:opacity-0 md:group-hover:opacity-100 md:group-hover:translate-x-0 md:group-hover:translate-y-0 dark:text-light dark:group-scoped-hover:text-yellow dark:group-scoped-focus-visible:text-yellow"
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
                    props.invalidText
                      ? 'text-red'
                      : 'text-green dark:text-yellow'
                  }`}
                >
                  {' '}
                  HERE
                  {props.invalidText
                    ? translations.value.input.media.error.emptyMedia
                    : translations.value.input.media.selectMedia}
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