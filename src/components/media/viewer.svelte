<script context="module" lang="ts">
  export const chunkSize = 18;
  export const lastState = {
    mediaId: '',
  };
  export const filterMedia = (media: Media[], filter: MediaFilterType) => {
    if (filter.search.name.length > 2) {
      media = media.filter((item) =>
        item.name
          .toLowerCase()
          .includes(filter.search.name.trim().toLowerCase())
      );
    }
    for (const i in filter.options) {
      const option = filter.options[i];
      if (option.dropdown && option.dropdown.selected.value !== '') {
        media = media.filter(
          (item) => item.type === option.dropdown.selected.value
        );
      } else if (option.date && option.date.year !== -1) {
        media = media.filter((item) => {
          const date = new Date(item.updatedAt);
          return (
            date.getFullYear() === option.date.year &&
            date.getMonth() + 1 === option.date.month &&
            date.getDate() === option.date.day
          );
        });
      }
    }
    return media;
  };
</script>

<script lang="ts">
  import {
    beforeUpdate,
    createEventDispatcher,
    onDestroy,
    onMount,
  } from 'svelte';
  import { Media, MediaType } from '@becomes/cms-sdk';
  import {
    ConfirmService,
    GeneralService,
    MediaService,
    NotificationService,
    sdk,
    StoreService,
  } from '../../services';
  import { Breadcrumb } from '../index';
  import { MediaAddUpdateFolderModal, MediaRemoveFileModal } from '../modals';
  import { Uppload, en, Local, Preview, Crop, Flip, Rotate } from 'uppload';
  import MediaItem from './item.svelte';
  import type { MediaFilter as MediaFilterType } from '../../types';
  import MediaFilter, { MediaFilterActions } from './filter.svelte';
  import { ArrowUpIcon } from '../icons';

  export let mediaId: string;
  export let isItemSelect: boolean = false;

  interface MediaInView {
    dirs: Media[];
    files: Media[];
  }

  const mediaStoreUnsub = StoreService.subscribe(
    'media',
    async (value: Media[]) => {
      if (value) {
        mediaInView = await getMedia(value);
      }
    }
  );
  const dispatch = createEventDispatcher();
  const buffer = {
    mediaId: !mediaId ? undefined : '' + mediaId,
  };
  let mediaInView: MediaInView = {
    dirs: [],
    files: [],
  };
  let sortData = {
    name: {
      direction: -1,
    },
  };
  let selectedItem: Media;
  let chunk = 0;
  let showFilesToIndex = chunkSize + chunk * chunkSize;

  function sortMedia(media: MediaInView, toggle?: boolean): MediaInView {
    if (toggle) {
      if (sortData.name.direction === -1) {
        sortData.name.direction = 1;
      } else {
        sortData.name.direction = -1;
      }
    }
    return {
      dirs: media.dirs.sort((a, b) =>
        a.name > b.name ? sortData.name.direction : -sortData.name.direction
      ),
      files: media.files.sort((a, b) =>
        a.name > b.name ? sortData.name.direction : -sortData.name.direction
      ),
    };
  }
  async function createFiles(mediaId: string, name: string, files: File[]) {
    const errors = await MediaService.createFiles(mediaId, name, files);
    if (errors.length > 0) {
      console.error(errors);
      NotificationService.error(
        'Upload completed with errors.' +
          ' See console for more information.' +
          ' This files were not uploaded: ' +
          errors.map((e) => e.filename).join(', ')
      );
    } else {
      NotificationService.success('Files uploaded successfully.');
    }
    StoreService.update('media', await sdk.media.getAll());
    dispatch('file');
  }
  async function handleMediaClick(item: Media) {
    if (isItemSelect) {
      if (item.type === MediaType.DIR) {
        mediaId = item._id;
        lastState.mediaId = mediaId;
        mediaInView = await getMedia();
      } else {
        selectedItem = item;
        dispatch('selected', item);
      }
    } else {
      if (item.type === MediaType.DIR) {
        if (item._id) {
          GeneralService.navigate(`/dashboard/media/editor/${item._id}`, {
            replace: true,
          });
        } else {
          GeneralService.navigate('/dashboard/media/editor/-', {
            replace: true,
          });
        }
      } else {
        const buffer: Buffer = await GeneralService.errorWrapper(
          async () => {
            return await sdk.media.getBinary(item._id);
          },
          async (value: Buffer) => {
            return value;
          }
        );

        const link = document.createElement('a');

        const blob = new Blob([buffer], { type: item.mimetype });
        const objectURL = URL.createObjectURL(blob);

        link.href = objectURL;
        link.href = URL.createObjectURL(blob);
        link.setAttribute('target', '_blank');

        if (item.size > 11572000) {
          link.download = item.name;
        }
        link.click();
      }
    }
  }
  async function getMedia(
    _media?: Media[],
    filter?: MediaFilterType
  ): Promise<MediaInView> {
    chunk = 0;
    showFilesToIndex = chunkSize + chunk * chunkSize;
    const output: MediaInView = {
      dirs: [],
      files: [],
    };
    let m: Media[] = [];
    if (_media) {
      if (mediaId) {
        m = _media.filter((e) => e.parentId === mediaId);
      } else {
        m = _media.filter((e) => e.isInRoot);
      }
    } else {
      m = await GeneralService.errorWrapper(
        async () => {
          if (filter) {
            if (
              filter.search.name.length > 2 ||
              filter.options.find((option) => {
                if (option.dropdown && option.dropdown.selected.value) {
                  return true;
                } else if (option.date && option.date.year !== -1) {
                  return true;
                }
                return false;
              })
            ) {
              return await sdk.media.getAll();
            }
          }
          if (mediaId) {
            return (await sdk.media.getAll()).filter(
              (e) => e.parentId === mediaId
            );
          }
          return (await sdk.media.getAll()).filter((e) => e.isInRoot);
        },
        async (value: Media[]) => {
          return value;
        }
      );
    }
    if (filter) {
      m = filterMedia(m, filter);
    }
    m.forEach((media) => {
      if (media.type === MediaType.DIR) {
        output.dirs.push(media);
      } else {
        output.files.push(media);
      }
    });
    return sortMedia(output);
  }
  async function createFolder(name: string, parentId?: string) {
    if (parentId === '') {
      parentId = undefined;
    }
    await GeneralService.errorWrapper(
      async () => {
        await sdk.media.addDir({
          name,
          parentId,
        });
      },
      async () => {
        mediaInView = await getMedia();
        NotificationService.success('Folder successfully created.');
      }
    );
  }
  async function remove(media: Media) {
    if (
      await ConfirmService.confirm(
        `Delete "${media.name}"`,
        `Are you sure you want to delete <strong>${media.name}</strong>?
          This action is irreversable and all child media will be also deleted.`
      )
    ) {
      await GeneralService.errorWrapper(
        async () => {
          await sdk.media.deleteById(media._id);
        },
        async () => {
          StoreService.update('media', await sdk.media.getAll());
          NotificationService.success('Media successfully removed.');
        }
      );
    }
  }

  onMount(async () => {
    mediaInView = await getMedia();
    if (lastState.mediaId) {
      mediaId = lastState.mediaId;
    }
    if (!isItemSelect && mediaId) {
      GeneralService.navigate(`/dashboard/media/editor/${mediaId}`, {
        replace: true,
      });
    }
    const uploaderFunction: any = async (data: File[] | File) => {
      const filesArray: File[] = [];
      if (data instanceof Array) {
        for (let i = 0; i < data.length; i++) {
          filesArray.push(data[i]);
        }
      } else {
        filesArray.push(data);
      }

      const fileNameParts = filesArray[0].name.split('.');

      await createFiles(
        mediaId ? mediaId : '',
        GeneralService.string.toUri(
          fileNameParts.splice(0, fileNameParts.length - 1).join('.')
        ),
        filesArray
      );
      MediaFilterActions.reset();
      return '';
    };
    const uploader = new Uppload({
      lang: en,
      call: '.uploadFileToggler',
      multiple: true,
    });
    uploader.uploader = uploaderFunction;
    // Services
    [Crop, Flip, Rotate, Preview].forEach((service) => {
      uploader.use(new service());
    });
    uploader.use(
      new Local({
        maxFileSize: 100000000,
        mimeTypes: [
          'image/png',
          'image/jpg',
          'image/jpeg',
          'video/mp4',
          'image/svg+xml',
          'application/pdf',
          'application/x-javascript',
        ],
      })
    );
  });
  beforeUpdate(async () => {
    if (buffer.mediaId !== mediaId) {
      buffer.mediaId = !mediaId ? undefined : '' + mediaId;
      lastState.mediaId = mediaId;
      mediaInView = await getMedia();
    }
  });
  onDestroy(() => {
    mediaStoreUnsub();
  });
</script>

<MediaFilter
  on:reset={async (event) => {
    mediaInView = await getMedia(undefined, event.detail);
  }}
  on:filter={async (event) => {
    mediaInView = await getMedia(undefined, event.detail);
  }} />
<div class="view--content">
  <div class="view--content-details">
    {#if mediaId}
      <Breadcrumb
        {mediaId}
        on:open={(event) => {
          handleMediaClick({
            _id: event.detail ? event.detail : undefined,
            type: MediaType.DIR,
            createdAt: 0,
            updatedAt: 0,
            hasChildren: false,
            isInRoot: false,
            mimetype: '',
            name: '',
            parentId: '',
            path: '',
            size: 0,
            userId: '',
          });
        }} />
    {:else}
      <h2 class="view--title">Media manager</h2>
    {/if}
    {#if mediaInView.dirs.length > 0 || mediaInView.files.length > 0}
      <button
        on:click={() => {
          mediaInView = sortMedia(mediaInView, true);
        }}
        class="media--sort-toggler {sortData.name.direction === 1 ? 'media--sort-toggler_asc' : ''}">
        <span class="mr-5">Name</span>
        <ArrowUpIcon />
      </button>
    {/if}
  </div>
  {#if mediaInView.dirs.length > 0 || mediaInView.files.length > 0}
    <ul class="media--list">
      {#each mediaInView.dirs as item}
        <MediaItem
          {item}
          on:remove={() => {
            remove(item);
          }}
          on:open={() => {
            handleMediaClick(item).catch((error) => {
              console.error(error);
            });
          }} />
      {/each}
      {#each mediaInView.files as item, itemIndex}
        {#if itemIndex < showFilesToIndex}
          <MediaItem
            {item}
            selected={selectedItem && selectedItem._id === item._id}
            on:remove={() => {
              remove(item);
            }}
            on:open={() => {
              handleMediaClick(item).catch((error) => {
                console.error(error);
              });
            }} />
        {/if}
      {/each}
      {#if mediaInView.files.length > showFilesToIndex}
        <button
          class="media--item-click media--item-click_more"
          on:click={() => {
            chunk = chunk + 1;
            showFilesToIndex = chunkSize + chunk * chunkSize;
          }}>Show More</button>
      {/if}
    </ul>
  {:else}
    <div>
      <h3 class="media--list_empty">
        Upload your first files to see them here
      </h3>
    </div>
  {/if}
  <MediaRemoveFileModal
    on:cancel={() => {}}
    on:done={async (event) => {
      if (event.detail) {
        await GeneralService.errorWrapper( async () => {
            await sdk.media.deleteById(event.detail);
          }, async () => {
            StoreService.update('media', await sdk.media.getAll());
            NotificationService.success('Media successfully removed.');
          } );
      }
    }} />
</div>
<MediaAddUpdateFolderModal
  on:done={(event) => {
    createFolder(event.detail.name, mediaId ? mediaId : '');
  }} />
