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
import { BCMSEmptyStateIllustration } from '..';

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
    if (filters && filters.options) {
      filters.options.forEach((option) => {
        if (option.dropdown?.selected.value) {
          m = m.filter((e) => e.type === option.dropdown?.selected.value);
        } else if (option.date && option.date.year !== -1) {
          m = m.filter((e) => {
            const date = new Date(e.updatedAt);
            return (
              date.getFullYear() === option.date?.year &&
              date.getMonth() + 1 === option.date.month &&
              date.getDate() === option.date.day
            );
          });
        }
      });
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
    const store = window.bcms.vue.store;
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
          This action is irreversible${
            target.type === BCMSMediaType.DIR
              ? ' and all child media will be also deleted'
              : ''
          }.`
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
        <div class="mt-15 pb-7.5">
          <div
            class={`flex items-center justify-between ${
              props.mode === 'select' ? '' : 'mb-10'
            }`}
          >
            {mediaId.value ? (
              <BCMSMediaBreadcrumb
                targetMediaId={mediaId.value}
                onClick={async (data) => {
                  await handleMediaClick(data);
                }}
                class={`${props.mode === 'select' ? 'mb-5' : ''}`}
              />
            ) : (
              props.mode !== 'select' && (
                <h2 class="text-3xl leading-none font-normal -tracking-0.01">
                  Media manager
                </h2>
              )
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
                class="group flex items-center text-dark transition-colors duration-300 hover:text-opacity-60 focus-visible:text-opacity-60"
              >
                <span class="text-xs leading-normal uppercase mr-1.5">
                  Name
                </span>
                <div class={sortDirection.value === 1 ? 'rotate-180' : ''}>
                  <BCMSIcon
                    src="/arrow/up"
                    class="w-3 fill-current transition-colors duration-300"
                  />
                </div>
              </button>
            ) : (
              ''
            )}
          </div>
          {mediaInView.value.dirs.length > 0 ||
          mediaInView.value.files.length > 0 ? (
            <ul
              class={`list-none grid  ${
                props.mode === 'select'
                  ? 'grid-cols-[repeat(auto-fill,minmax(80px,1fr))] mt-7.5 gap-2.5 p-[5px]'
                  : 'grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-[15px] desktop:gap-x-5 desktop:gap-y-7.5'
              }`}
            >
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
                    mode={props.mode}
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
                      mode={props.mode}
                      class={`${itemIndex === 0 ? 'col-start-1' : ''}`}
                    />
                  );
                } else {
                  return <li style="display: none;" />;
                }
              })}
            </ul>
          ) : (
            <>
              {props.mode === 'view' ? (
                <BCMSEmptyStateIllustration
                  src="/media.png"
                  maxWidth="350px"
                  maxHeight="315px"
                  class="mt-20 md:absolute md:bottom-32 md:right-32"
                />
              ) : (
                <div class="text-grey text-lg mt-3">
                  There is no media in this folder
                </div>
              )}
            </>
          )}
        </div>
        <BCMSSpinner show={uploadSpinnerData.value.active}>
          <div class="text-light text-[22px]">
            Uploading: {uploadSpinnerData.value.fileName}
          </div>
          <div class="border border-light rounded-[5px] p-px flex max-w-[350px] w-full mt-2.5 mx-auto">
            <div
              class="bg-light h-[5px] rounded-[5px]"
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
