<script context="module" lang="ts">
  export const cache: Array<{
    id: string;
    b64: string;
  }> = [];
</script>

<script lang="ts">
  import {
    onMount,
    beforeUpdate,
    onDestroy,
    createEventDispatcher,
  } from 'svelte';
  import { MediaAggregate, MediaType } from '@becomes/cms-sdk';
  import {
    GeneralService,
    MediaService,
    sdk,
    StoreService,
    popup,
  } from '../../services';
  import { Link, Button, Breadcrumb } from '../index';
  import { MediaAddUpdateFolderModal, MediaAddFileModal } from '../modals';
  import Spinner from '../spinner.svelte';
  import ProgressBar from '../progress-bar.svelte';
  import { MediaRemoveFileModal } from '../modals/media';

  export let inModal: boolean = false;
  export let searchInput: string;
  export let filterOptions: {
    isOpen: boolean;
    filters: {
      label: string;
      type: string;
      options: { label: string; value: string }[];
      value: {};
    }[];
  };

  const dispatch = createEventDispatcher();
  const mediaStoreUnsub = StoreService.subscribe(
    'media',
    async (value: MediaAggregate[]) => {
      if (value) {
        mediaFiles = value;
        if (mediaFile) {
          setActiveView(mediaFile._id);
        } else {
          setActiveView();
        }
      }
    }
  );
  const editFolderData = {
    id: '',
    name: '',
  };
  const editFileData = {
    id: '',
    name: '',
  };

  let inModalSelectedMediaId: string = '';
  let mediaFiles: MediaAggregate[] = [];
  let mediaFile: MediaAggregate & {
    parentId: string;
    dirs: MediaAggregate[];
    files: MediaAggregate[];
  };
  let uploadStatus = {
    show: false,
    progress: 0,
    filename: '',
  };
  let openMediaSpinner = false;
  const filesCount = 12;
  let showFilesCount = 0 + filesCount;
  let sortApplied = false;
  let sortValue = 0;
  let mediaToRemoveId = '';

  async function remove(id: string) {
    await GeneralService.errorWrapper(
      async () => {
        await sdk.media.deleteById(id);
      },
      async () => {
        StoreService.update('media', await sdk.media.getAllAggregated());
        setActiveView(mediaFile._id);
      }
    );
  }
  function mediaToBase64Image(media: MediaAggregate) {
    GeneralService.errorWrapper(
      async () => {
        const cached = cache.find((e) => e.id === media._id);
        if (cached) {
          return { fromCache: true, b64: cached.b64 };
        }
        return {
          fromCache: false,
          b64: await sdk.media.getBinary(media._id, 'small'),
        };
      },
      async (data: { fromCache: boolean; b64: string | Buffer }) => {
        let b64: string;
        if (data.fromCache) {
          b64 = data.b64 as string;
        } else {
          b64 = GeneralService.b64.fromBuffer(data.b64 as Buffer);
          cache.push({
            id: media._id,
            b64,
          });
        }
        const el = document.getElementById(media._id);
        const fullB64 = `data:${media.mimetype};base64,${b64}`;

        el.setAttribute('src', fullB64);
        if (el.parentElement.tagName === 'A') {
          el.parentElement.setAttribute('href', fullB64);
        }
      }
    );
    return media._id;
  }
  async function setActiveView(dirId?: string) {
    if (typeof dirId === 'undefined') {
      dirId = '';
    }
    if (dirId === '') {
      mediaFile = {
        _id: '',
        createdAt: 0,
        isInRoot: true,
        mimetype: '',
        name: '',
        path: 'root',
        size: 0,
        state: false,
        type: MediaType.DIR,
        updatedAt: 0,
        userId: '',
        children: [],
        parentId: '',
        ...splitMedia(
          mediaFiles.map((e) => {
            const output: MediaAggregate = JSON.parse(JSON.stringify(e));
            output.children = undefined;
            return output;
          })
        ),
      };
    } else {
      const media = await sdk.media.getAggregated(dirId);
      const parent = await sdk.media.get(media._id);
      mediaFile = {
        ...media,
        parentId: parent.parentId,
        ...splitMedia(
          media.children.map((e) => {
            const output: MediaAggregate = JSON.parse(JSON.stringify(e));
            output.children = undefined;
            return output;
          })
        ),
      };
    }
  }
  function splitMedia(media: MediaAggregate[]) {
    const dirs: MediaAggregate[] = [];
    const files: MediaAggregate[] = [];
    for (const i in media) {
      if (media[i].type === MediaType.DIR) {
        dirs.push(media[i]);
      } else {
        files.push(media[i]);
      }
    }
    dirs.sort((a, b) => {
      if (a.name > b.name) return 1;
      else if (a.name < b.name) return -1;
      return 0;
    });
    // files.sort((a, b) => {
    //   if (a.name > b.name) return 1;
    //   else if (a.name < b.name) return -1;
    //   return 0;
    // });
    return {
      dirs,
      files,
    };
  }

  function getMediaId(): string {
    return window.location.pathname.split('/')[4];
  }

  function sortMedia() {
    if (!sortApplied) sortApplied = true;
    if (sortValue === 1) {
      sortValue = 0;
      mediaFiles = mediaFiles.sort((a, b) => (a.name > b.name ? -1 : 1));
    } else {
      sortValue = 1;
      mediaFiles = mediaFiles.sort((a, b) => (a.name > b.name ? 1 : -1));
    }
  }

  function currentMediaFiltered() {
    // const media = this.currentMedia
    //   .filter(media => {
    //     let passesAllFilters = [];
    //     passesAllFilters.push(
    //       media.name
    //         .trim()
    //         .toLowerCase()
    //         .includes(this.searchInput.toLowerCase()),
    //     );

    //     this.filterOptions.filters.forEach(filter => {
    //       if (typeof filter.value === 'object') {
    //         passesAllFilters.push(
    //           media.type.includes(filter.value.value || ''),
    //         );
    //       }
    //     });

    //     return passesAllFilters.every(e => e);
    //   })
    //   .sort((a, b) => {
    //     if (this.sortApplied) {
    //       if (this.sortValue === 0) {
    //         return a.name > b.name ? 1 : -1;
    //       } else {
    //         return a.name > b.name ? -1 : 1;
    //       }
    //     }
    //   });

    // return [
    //   ...media.filter(e => e.type === 'DIR'),
    //   ...media.filter(e => e.type !== 'DIR'),
    // ];
    return [];
  }

  beforeUpdate(() => {
    mediaFiles = [
      ...mediaFiles.filter((e) => e.type === 'DIR'),
      ...mediaFiles.filter((e) => e.type !== 'DIR'),
    ];
  });

  onMount(async () => {
    await GeneralService.errorWrapper(
      async () => {
        let media = await sdk.media.getAll();
        media = media
          .filter(
            (e) => e.parentId === (window.location.pathname.split('/')[4] || '')
          )
          .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
        return media;
      },
      async (media: MediaAggregate[]) => {
        StoreService.update('media', media);
        setActiveView();
      }
    );
  });
  onDestroy(async () => {
    mediaStoreUnsub();
  });
</script>

<!-- <div class="media-viewer">
  {#if mediaFile}
    <div class="media-viewer--location">
      /media{mediaFile.path === 'root' ? '' : mediaFile.path}
    </div>
    <div class="media-viewer--actions">
      <Button
        icon="fas fa-file"
        on:click={() => {
          StoreService.update('MediaAddFileModal', true);
        }}>
        Upload file
      </Button>
      <Button
        class="ml--10"
        kind="secondary"
        icon="fas fa-folder"
        on:click={() => {
          StoreService.update('MediaAddUpdateFolderModal', true);
        }}>
        Create folder
      </Button>
      {#if mediaFile._id !== ''}
        <Button
          class="ml--10"
          kind="ghost"
          icon="fas fa-chevron-left"
          on:click={() => {
            showFilesCount = 0 + filesCount;
            setActiveView(mediaFile.parentId);
          }}>
          Go back
        </Button>
      {/if}
    </div>
    {#if mediaFile.dirs.length === 0 && mediaFile.files.length === 0}
      <div class="media-viewer--no-files">
        <div class="message">This folder is empty.</div>
      </div>
    {:else}
      {#if mediaFile.dirs.length > 0}
        <h4 class="mt--50">Folders</h4>
        <div class="media-viewer--grid">
          {#each mediaFile.dirs as media}
            <div class="media-viewer--dir">
              <button
                class="open"
                on:click={() => {
                  showFilesCount = 0 + filesCount;
                  setActiveView(media._id);
                }}>
                <div class="fas fa-folder icon" />
                <div class="name">
                  {GeneralService.string.toShort(media.name, 40)}
                </div>
              </button>
              <Button
                kind="ghost"
                icon="fas fa-times"
                onlyIcon={true}
                on:click={() => {
                  remove(media._id);
                }} />
            </div>
          {/each}
        </div>
      {/if}
      {#if mediaFile.files.length > 0}
        <h4 class="mt--50">Files</h4>
        <div class="media-viewer--grid">
          {#each mediaFile.files as media, i}
            {#if showFilesCount > i}
              <div
                class="media-viewer--file {inModal ? (inModalSelectedMediaId === media._id ? 'media-viewer--file-selected' : '') : ''}">
                <div class="heading">
                  <button
                    class="open"
                    on:click={() => {
                      if (inModal) {
                        inModalSelectedMediaId = media._id;
                        dispatch('selected', media);
                      } else {
                        openMedia(media);
                      }
                    }}>
                    <div class="fas fa-file icon" />
                    <div class="name">
                      {GeneralService.string.toShort(media.name, 40)}
                    </div>
                  </button>
                  <Button
                    class="ml--auto"
                    kind="ghost"
                    icon="fas fa-times"
                    onlyIcon={true}
                    on:click={() => {
                      remove(media._id);
                    }} />
                </div>
                {#if media.type === MediaType.IMG}
                  <div class="img-wrapper">
                    <img
                      id={mediaToBase64Image(media)}
                      src=""
                      alt="Loading..."
                      on:click={() => {
                        if (inModal) {
                          inModalSelectedMediaId = media._id;
                          dispatch('selected', media);
                        } else {
                          openMedia(media);
                        }
                      }} />
                  </div>
                {/if}
              </div>
            {/if}
          {/each}
        </div>
        {#if mediaFile.files.length > showFilesCount}
          <div class="media-viewer--show-more">
            <Button
              kind="ghost"
              icon="fas fa-chevron-circle-down"
              on:click={() => {
                showMoreFiles();
              }}>
              Show more
            </Button>
          </div>
        {/if}
      {/if}
    {/if}
  {/if}
</div>
<MediaAddUpdateFolderModal
  id={editFolderData.id}
  name={editFolderData.name}
  on:cancel={() => {
    editFolderData.id = '';
    editFolderData.name = '';
  }}
  on:done={(event) => {
    if (editFolderData.id !== '') {
      editFolderData.id = '';
      editFolderData.name = '';
      updateFolder(event.detail.id, event.detail.name);
    } else {
      createFolder(event.detail.name, mediaFile._id);
    }
  }} />
<MediaAddFileModal
  parentId={mediaFile ? mediaFile._id : ''}
  on:done={(event) => {
    createFiles(event.detail.parentId, event.detail.name, event.detail.files);
  }} />
<Spinner show={openMediaSpinner} />
<Spinner show={uploadStatus.show}>
  <div class="media-viewer--upload-file-name">{uploadStatus.filename}</div>
  <ProgressBar class="ml--auto mr--auto" progress={uploadStatus.progress} />
</Spinner> -->

<div class="view--content">
    {#if !getMediaId()}
    <div>
      <h2 class="view--title">Media manager</h2>
      <button
      on:click={sortMedia}
        class="media--sort-toggler {sortValue === 1 ? 'media--sort-toggler_asc' : ''}"
      >
        <span class="mr--5">Name</span>
        <i class="fas fa-arrow-up"></i>
      </button>
    </div>
    {:else}
    <Breadcrumb {sortValue} on:sort={sortMedia}/>
    {/if}
    {#if mediaFiles.length}
    <ul class="media--list">
      {#each mediaFiles as item}
      <li class="media--list-item">
        {#if item.type === "DIR"}
          <Link href={`/dashboard/media/editor/${item._id}`}  class="media--item media--item_folder">
          <i class="fas fa-folder"></i>
          <span class="media--item-name">{item.name}</span>
        </Link>
        {:else if item.mimetype.split('/')[0] !== 'image'}
        <div v-else-if="fileMimetype(item) !== 'image'" class="media--item media--item_file">
          <i class="fas fa-file-alt"></i>
          <div>
            <span class="media--item-name">{item.name}</span>
            <button on:click={() => {
              StoreService.update('MediaRemoveFileModal', true);
              mediaToRemoveId = item._id
            }}>
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        {:else}
        <a
          target="_blank"
          download={item.name}
          class="media--item media--item_file"
        >
        {#if item.mimetype.split('/')[0] === 'image'}
        <img id={mediaToBase64Image(item)} alt={item.name} />
        {:else}
        <i class="fas fa-file-alt"></i>
        {/if}
          <div>
            <span class="media--item-name">{item.name}</span>
            <button on:click|preventDefault={() => {
              StoreService.update('MediaRemoveFileModal', true);
              mediaToRemoveId = item._id
            }}>
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </a>
        {/if}
      </li>
      {/each}
    </ul>
    {:else}
      <div>
        <h3 class="media--list_empty">There is no media to be displayed.</h3>
      </div>
    {/if}
    <MediaRemoveFileModal
    on:cancel={() => {
      mediaToRemoveId = ''
    }}
    on:done={() => {
      remove(mediaToRemoveId)
      StoreService.update('MediaRemoveFileModal', false);
    }} />
    <!-- <bcms-modal @close="toggleCreateNewFolderModal" v-if="createNewFolderModal.isOpen">
      <template v-slot:header>
        <h2 class="bcmsModal--title">Create new folder</h2>
      </template>
      <validation-observer v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(onSubmitCreateFolder)">
          <div class="bcmsModal--row mb-15">
            <validation-provider rules="required" v-slot="{ errors }">
              <bcms-input
                ref="input"
                label="Name"
                placeholder="Template's name"
                v-model="createNewFolderModal.form.name"
                :status="{
              name: errors[0] ? 'error' : '',
              message: errors[0]
            }"
              />
            </validation-provider>
          </div>
          <div class="bcmsModal--row bcmsModal--row_submit mt-40">
            <bcms-button type="primary" textContent="Done" />
            <button @click.prevent="toggleCreateNewFolderModal" class="color_pink ml-25">Cancel</button>
          </div>
        </form>
      </validation-observer>
    </bcms-modal>
    <bcms-modal @close="toggleDeleteFileModal" v-if="deleteFileModal.isOpen">
      <template v-slot:header>
        <h2 class="bcmsModal--title">Delete File</h2>
      </template>
      <div class="bcmsModal--row bcmsModal--row_submit mt-40">
        <bcms-button @click.native="deleteFile" type="primary" textContent="Delete" />
        <button @click="toggleDeleteFileModal" class="color_pink ml-25">Cancel</button>
      </div>
    </bcms-modal> -->
  </div>
