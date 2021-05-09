<script lang="tsx">
import {
  computed,
  defineComponent,
  onBeforeUpdate,
  onMounted,
  PropType,
  ref,
} from 'vue';
import type { BCMSMedia } from '@becomes/cms-sdk/types';
import { BCMSMediaType } from '@becomes/cms-sdk/types';
import BCMSMediaControls from './controls.vue';
import BCMSMediaItem from './item.vue';
import BCMSMediaBreadcrumb from './breadcrumb.vue';
import { BCMSMediaControlFilters } from '../../types';
import { MutationTypes, useStore } from '../../store';
import { useRoute, useRouter } from 'vue-router';
import BCMSIcon from '../icon.vue';

interface MediaInView {
  dirs: BCMSMedia[];
  files: BCMSMedia[];
}

const CHUNK_SIZE = 18;
const lastState = {
  mediaId: '',
};
function filterMedia(media: BCMSMedia[], filters: BCMSMediaControlFilters) {
  if (filters.search.name.length > 2) {
    media = media.filter((item) =>
      item.name.toLowerCase().includes(filters.search.name.trim().toLowerCase())
    );
  }
  for (const i in filters.options) {
    const option = filters.options[i];
    if (option.dropdown && option.dropdown.selected.value !== '') {
      media = media.filter(
        (item) => item.type === option.dropdown?.selected.value
      );
    } else if (option.date && option.date.year !== -1) {
      media = media.filter((item) => {
        const date = new Date(item.updatedAt);
        return (
          option.date &&
          date.getFullYear() === option.date.year &&
          date.getMonth() + 1 === option.date.month &&
          date.getDate() === option.date.day
        );
      });
    }
  }
  return media;
}
async function getMedia(
  targetMediaId?: string,
  media?: BCMSMedia[],
  filters?: BCMSMediaControlFilters,
  sortDirection?: -1 | 1
): Promise<MediaInView> {
  const output: MediaInView = {
    dirs: [],
    files: [],
  };
  let m: BCMSMedia[] = [];
  if (media) {
    if (targetMediaId) {
      m = media.filter((e) => e.parentId === targetMediaId);
    } else {
      m = media.filter((e) => e.isInRoot);
    }
  } else {
    const temp = await window.bcms.services.error.wrapper(
      async () => {
        if (filters) {
          if (
            filters.search.name.length > 2 ||
            filters.options.find((option) => {
              if (option.dropdown && option.dropdown.selected.value) {
                return true;
              } else if (option.date && option.date.year !== -1) {
                return true;
              }
              return false;
            })
          ) {
            return await window.bcms.sdk.media.getAll();
          }
        }
        if (targetMediaId) {
          return (await window.bcms.sdk.media.getAll()).filter(
            (e) => e.parentId === targetMediaId
          );
        }
        return (await window.bcms.sdk.media.getAll()).filter((e) => e.isInRoot);
      },
      async (value) => {
        return value;
      }
    );
    if (temp) {
      m = temp;
    }
  }
  if (filters) {
    m = filterMedia(m, filters);
  }
  m.forEach((item) => {
    if (item.type === BCMSMediaType.DIR) {
      output.dirs.push(item);
    } else {
      output.files.push(item);
    }
  });
  return sortMedia(output, sortDirection ? sortDirection : 1);
}
function sortMedia(media: MediaInView, direction: -1 | 1): MediaInView {
  return {
    dirs: media.dirs.sort((a, b) => (a.name > b.name ? direction : -direction)),
    files: media.files.sort((a, b) =>
      a.name > b.name ? direction : -direction
    ),
  };
}

const component = defineComponent({
  props: {
    mode: {
      type: String as PropType<'view' | 'select'>,
      default: 'view',
    },
    onSelect: Function as PropType<(media: BCMSMedia) => void | Promise<void>>,
  },
  emits: {
    select: (_value: BCMSMedia) => {
      return true;
    },
  },
  setup(props, ctx) {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const media = computed(() => {
      return store.getters.media_items;
    });
    const mediaId = ref(lastState.mediaId);
    const mediaInView = ref<MediaInView>({
      dirs: [],
      files: [],
    });
    const filters = ref<BCMSMediaControlFilters | undefined>(undefined);
    const selectedMedia = ref<BCMSMedia | null>(null);
    const atChunk = ref(0);
    const showToIndex = computed(() => {
      return CHUNK_SIZE + atChunk.value * CHUNK_SIZE;
    });
    const sortDirection = ref<1 | -1>(1);

    async function handleMediaClick(item: BCMSMedia) {
      if (props.mode === 'select') {
        if (item.type === BCMSMediaType.DIR) {
          mediaId.value = item._id;
          lastState.mediaId = mediaId.value;
          mediaInView.value = await getMedia(
            mediaId.value,
            media.value,
            filters.value,
            sortDirection.value
          );
        } else {
          selectedMedia.value = item;
          ctx.emit('select', item);
        }
      } else if (props.mode === 'view') {
        if (item.type === BCMSMediaType.DIR) {
          if (item._id) {
            lastState.mediaId = item._id;
            mediaId.value = item._id;
            await router.push({
              path: `/dashboard/media/${item._id}`,
              replace: true,
            });
          } else {
            lastState.mediaId = '';
            mediaId.value = '';
            await router.push({
              path: '/dashboard/media',
              replace: true,
            });
          }
          mediaInView.value = await getMedia(
            mediaId.value,
            media.value,
            filters.value,
            sortDirection.value
          );
        } else {
          const mediaLink = await window.bcms.sdk.media.getUrlWithAccessToken(
            item
          );
          window.open(
            window.location.href.split('/').slice(0, 3).join('/') + mediaLink,
            '_blank'
          );
        }
      }
    }

    onMounted(async () => {
      if (media.value.length === 0) {
        await window.bcms.services.error.wrapper(
          async () => {
            return await window.bcms.sdk.media.getAll();
          },
          async (result) => {
            store.commit(MutationTypes.media_set, result);
          }
        );
      }
      if (route.path.startsWith('/dashboard/media')) {
        if (
          !lastState.mediaId &&
          route.params.id &&
          route.params.id !== lastState.mediaId
        ) {
          lastState.mediaId = route.params.id as string;
          mediaId.value = lastState.mediaId;
          await router.push({
            path: `/dashboard/media/${lastState.mediaId}`,
            replace: true,
          });
        } else if (
          !route.params.id &&
          lastState.mediaId &&
          route.params.id !== lastState.mediaId
        ) {
          mediaId.value = lastState.mediaId;
          await router.push({
            path: `/dashboard/media/${lastState.mediaId}`,
            replace: true,
          });
        }
      }
      mediaInView.value = await getMedia(
        mediaId.value,
        media.value,
        filters.value,
        sortDirection.value
      );
    });

    return () => (
      <>
        <BCMSMediaControls
          onUploadFile={() => {
            // ModalService.open.mediaUploader({
            //   async onDone(files) {
            //     await preProcessFiles(files);
            //   },
            // });
          }}
          onFilter={async (_filters) => {
            // mediaInView = await getMedia(undefined, event.detail);
          }}
        />
        <div class="view--content">
          <div class="view--content-details">
            {mediaId.value ? (
              <BCMSMediaBreadcrumb
                targetMediaId={mediaId.value}
                onClick={async (data) => {
                  await handleMediaClick(data);
                }}
              />
            ) : (
              <h2 class="view--title">Media manager</h2>
            )}
            {mediaInView.value.dirs.length > 0 ||
            mediaInView.value.files.length > 0 ? (
              <button
                onClick={() => {
                  sortDirection.value = sortDirection.value === 1 ? -1 : 1;
                  mediaInView.value = sortMedia(
                    mediaInView.value,
                    sortDirection.value
                  );
                }}
                class={`media--sort-toggler ${
                  sortDirection.value === 1 ? 'media--sort-toggler_asc' : ''
                }`}
              >
                <span class="mr-5">Name</span>
                <BCMSIcon src="/arrow/up" />
              </button>
            ) : (
              ''
            )}
          </div>
          {mediaInView.value.dirs.length > 0 ||
          mediaInView.value.files.length > 0 ? (
            <ul class="media--list">
              {mediaInView.value.dirs.map((item) => {
                return (
                  <BCMSMediaItem
                    item={item}
                    onRemove={() => {
                      // remove(item);
                    }}
                    onOpen={async () => {
                      await handleMediaClick(item);
                    }}
                  />
                );
              })}
              {mediaInView.value.files.map((item, itemIndex) => {
                if (itemIndex < showToIndex.value) {
                  return (
                    <BCMSMediaItem
                      item={item}
                      selected={
                        !!selectedMedia.value &&
                        selectedMedia.value._id === item._id
                      }
                      onRemove={() => {
                        // remove(item);
                      }}
                      onOpen={async () => {
                        await handleMediaClick(item);
                      }}
                    />
                  );
                } else {
                  return <li style="display: none;" />;
                }
              })}
            </ul>
          ) : (
            <div>
              <h3 class="media--list_empty">
                Upload your first files to see them here
              </h3>
            </div>
          )}
        </div>
      </>
    );
  },
});
export default component;
</script>
