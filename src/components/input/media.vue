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
import { BCMSMedia } from '@becomes/cms-sdk/types';
import { useThrowable } from '../../util';

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
    onClick: Function as PropType<() => void | Promise<void>>,
    onClear: Function as PropType<() => void | Promise<void>>,
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
    const throwable = useThrowable();
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
        class={`bcmsMedia--inner ${
          props.invalidText && !props.value ? 'bcmsMedia--inner_isError' : ''
        } ${props.class}`}
      >
        {props.value ? (
          <>
            <button
              onClick={() => {
                ctx.emit('click');
              }}
              class="bcmsMedia--details"
            >
              <div class="bcmsMedia--details-visual">
                <BCMSImage
                  class={media.value ? 'visual' : 'broken'}
                  media={media.value?.data}
                  alt=""
                />
              </div>
              <div class="bcmsMedia--details-info">
                <div
                  class={`bcmsMedia--details-path${
                    media.value ? '' : ' bcmsMedia--details-path_broken'
                  }`}
                >
                  {media.value
                    ? media.value.src
                    : 'Broken file - file does not exist any more.'}
                </div>
                <div class="bcmsMedia--details-cta">
                  Click to select another media
                </div>
              </div>
            </button>
            {media.value ? (
              <BCMSLink
                href={`/dashboard/media?search=${encodeURIComponent(
                  media.value.data._id
                )}`}
                class="bcmsMedia--actions"
              >
                <BCMSIcon src="/link" />
              </BCMSLink>
            ) : (
              ''
            )}
            <button
              aria-label="clear"
              class="bcmsMedia--actions"
              onClick={() => {
                ctx.emit('clear');
              }}
            >
              <BCMSIcon src="/trash" />
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              ctx.emit('click');
            }}
            class="bcmsMedia--details"
          >
            <div class="bcmsMedia--details-cta">
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
