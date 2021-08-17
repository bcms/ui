<script lang="tsx">
import { computed, defineComponent, onMounted, PropType, ref } from 'vue';
import { BCMSMedia, BCMSMediaType } from '@becomes/cms-sdk/types';
import BCMSMediaControls from './controls.vue';
import BCMSMediaItem from './item.vue';
import BCMSMediaBreadcrumb from './breadcrumb.vue';
import { BCMSMediaControlFilters } from '../../types';
import BCMSIcon from '../icon.vue';
import type { UppyFile } from '@uppy/core';
import { BCMSSpinner } from '../spinner';
import { useRoute, useRouter } from 'vue-router';

interface MediaInView {
  dirs: BCMSMedia[];
  files: BCMSMedia[];
}

const CHUNK_SIZE = 18;
const lastState = {
  mediaId: '',
};
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
    if (filters && filters.search.name) {
      if (filters.search.name) {
        for (let i = 0; i < media.length; i++) {
          const item = media[i];
          if (
            item.name
              .toLowerCase()
              .includes(filters.search.name.trim().toLowerCase()) ||
            item._id === filters.search.name
          ) {
            m.push(item);
          }
        }
      } else {
        m = media;
      }
    } else {
      if (targetMediaId) {
        m = media.filter((e) => e.parentId === targetMediaId);
      } else {
        m = media.filter((e) => e.isInRoot);
      }
    }
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
    media: Object as PropType<BCMSMedia>,
    onSelect: Function as PropType<(media: BCMSMedia) => void | Promise<void>>,
  },
  emits: {
    select: (_value: BCMSMedia) => {
      return true;
    },
  },
  setup(props, ctx) {
    const throwable = window.bcms.util.throwable;
    const router = useRouter();
    const route = useRoute();
    const store = window.bcms.sdk.store;
    const media = computed(() => {
      return store.getters.media_items;
    });
    const mediaId = ref(props.media ? props.media._id : lastState.mediaId);
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
    const uploadSpinnerData = ref({
      active: false,
      fileName: '',
      progress: 0,
    });

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
          if (filters.value) {
            filters.value = filters.value.clear();
          }
          mediaInView.value = await getMedia(
            mediaId.value,
            media.value,
            filters.value,
            sortDirection.value
          );
        } else {
          window.open(
            window.location.href.split('/').slice(0, 3).join('/') +
              `/api/media/${item._id}/bin/act?act=${window.bcms.sdk.storage.get(
                'at'
              )}`,
            '_blank'
          );
        }
      }
    }
    async function createDir(name: string) {
      const parentId = mediaId.value ? mediaId.value : undefined;
      await throwable(
        async () => {
          await window.bcms.sdk.media.createDir({
            name,
            parentId,
          });
        },
        async () => {
          mediaInView.value = await getMedia(
            mediaId.value,
            media.value,
            filters.value,
            sortDirection.value
          );
        }
      );
    }
    async function removeMedia(target: BCMSMedia) {
      if (
        await window.bcms.confirm(
          `Delete "${target.name}"`,
          `Are you sure you want to delete <strong>${target.name}</strong>?
          This action is irreversable and all child media will be also deleted.`
        )
      ) {
        await throwable(
          async () => {
            await window.bcms.sdk.media.deleteById(target._id);
          },
          async () => {
            mediaInView.value = await getMedia(
              mediaId.value,
              media.value,
              filters.value,
              sortDirection.value
            );
            window.bcms.notification.success('Media successfully removed.');
          }
        );
      }
    }
    async function preProcessFiles(files: UppyFile[]) {
      await createFiles(
        files.map((e) => {
          if (e.data instanceof Blob) {
            return new File([e.data as Blob], e.name, {
              type: e.type,
            });
          }
          return e.data as File;
        })
      );
    }
    async function createFiles(files: File[]) {
      uploadSpinnerData.value.active = true;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        await throwable(async () => {
          await window.bcms.sdk.media.createFile({
            file,
            parentId: mediaId.value,
            onProgress(event: {
              fileName: string;
              loaded: number;
              total: number;
            }) {
              uploadSpinnerData.value.fileName = event.fileName;
              uploadSpinnerData.value.progress =
                (event.loaded * 100) / event.total;
            },
          });
        });
      }
      mediaInView.value = await getMedia(
        mediaId.value,
        media.value,
        filters.value,
        sortDirection.value
      );
      uploadSpinnerData.value.active = false;
    }

    onMounted(async () => {
      await throwable(async () => {
        await window.bcms.sdk.media.getAll();
      });
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
            window.bcms.modal.media.upload.show({
              title: 'Upload files',
              onDone: async (data) => {
                await preProcessFiles(data.files);
              },
            });
            // ModalService.open.mediaUploader({
            //   async onDone(files) {
            //     await preProcessFiles(files);
            //   },
            // });
          }}
          onCreateFolder={() => {
            window.bcms.modal.media.addUpdateDir.show({
              title: 'Create new folder',
              mode: 'add',
              takenNames: mediaInView.value.dirs.map((e) => e.name),
              onDone: async (data) => {
                await createDir(data.name);
              },
            });
          }}
          onFilter={async (_filters) => {
            filters.value = _filters;
            mediaInView.value = await getMedia(
              mediaId.value,
              media.value,
              filters.value,
              sortDirection.value
            );
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
                    onRemove={async () => {
                      await removeMedia(item);
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
                      onRemove={async () => {
                        await removeMedia(item);
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
        <BCMSSpinner show={uploadSpinnerData.value.active}>
          <div class="media--upload-filename">
            Uploading: {uploadSpinnerData.value.fileName}
          </div>
          <div class="media--upload-wrapper">
            <div
              class="media--upload-bar"
              style={`width: ${uploadSpinnerData.value.progress}%;`}
            />
          </div>
        </BCMSSpinner>
      </>
    );
  },
});
export default component;
</script>
