<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import {
    Layout,
    MediaViewer,
    Button,
    MediaAddUpdateFolderModal,
    SelectItem,
  } from '../../components';
  import { Uppload, en, Local, Preview, Crop, Flip, Rotate } from 'uppload';
  import {
    GeneralService,
    MediaService,
    popup,
    sdk,
    StoreService,
  } from '../../services';
  import Select from '../../components/input/select/select.svelte';

  let uppload = null;
  let searchInput = '';

  const filterOptions = {
    isOpen: false,
    filters: [
      {
        label: 'Type',
        type: 'dropdown',
        options: [
          { label: 'Image', value: 'IMG' },
          { label: 'Video', value: 'VID' },
          { label: 'Directory', value: 'DIR' },
        ],
        value: {},
      },
    ],
  };
  const editFolderData = {
    id: '',
    name: '',
  };

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
        StoreService.update('media', await sdk.media.getAllAggregated());
        popup.success('Folder successfully created.');
      }
    );
  }
  async function createFiles(parentId: string, name: string, files: File[]) {
    const errors = await MediaService.createFiles(parentId, name, files);
    if (errors.length > 0) {
      console.error(errors);
      popup.error(
        'Upload completed with errors.' +
          ' See console for more information.' +
          ' This files were not uploaded: ' +
          errors.map((e) => e.filename).join(', ')
      );
    } else {
      popup.success('Files uploaded successfully.');
    }
    StoreService.update('media', await sdk.media.getAllAggregated());
  }

  onMount(async () => {
    const uploader = new Uppload({
      lang: en,
      call: '.uploadFileToggler',
      multiple: true,
      uploader: (data: File | File[]) =>
        new Promise(async (resolve, reject) => {
          const filesArray: File[] = [];
          if (!Array.isArray(data)) {
            filesArray.push(data);
          } else {
            for (let i = 0; i < data.length; i++) {
              filesArray.push(data[i]);
            }
          }
          const imageFile = filesArray.find((e) => e.type.startsWith('image'));
          if (imageFile) {
            try {
              resolve();
            } catch (error) {
              console.log(error);
              popup.error(
                'Some error occurred while parsing. See console for more information.'
              );
              reject();
            }
          }
          const parentId = window.location.pathname.split('/')[4] || '';
          createFiles(parentId, '', filesArray);
        }),
    });

    // Services
    [Crop, Flip, Rotate].forEach((service) => {
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
        ],
      })
    );
  });
</script>

<Layout>
  <div class="view media">
    <div in:fade={{ delay: 250 }} class="media--animation">
      <header class="view--cols mb-10">
        <div class="media--search view--left">
          <i class="fas fa-search" />
          <input
            class="media--search-input"
            type="text"
            placeholder="Search"
            bind:value={searchInput} />
          <button
            on:click={() => {
              filterOptions.isOpen = !filterOptions.isOpen;
            }}
            class="media--search-toggler {filterOptions.isOpen ? 'media--search-toggler_active' : ''}">
            <i class="fas fa-chevron-down" />
          </button>
          <!-- TODO: v--clickOutside="closeFilterOptions" -->
          {#if filterOptions.isOpen}
            <div class="media--filters">
              {#each filterOptions.filters as filter, filterIndex}
                <div class="media--filter">
                  <Select
                    label={filter.label}
                    on:change={(event) => {
                      filterOptions.filters[filterIndex].value = { label: event.detail, value: event.detail };
                    }}>
                    <SelectItem
                      selected={filter.options.length === 0}
                      text={filter.options.length === 0 ? 'Nothing to select' : 'Select one'}
                      value="" />
                    {#each filter.options as option}
                      <SelectItem
                        selected={filter.value.label === option.value}
                        text={option.label}
                        value={option.value} />
                    {/each}
                  </Select>
                </div>
              {/each}
            </div>
          {/if}
        </div>
        <div class="view--right">
          <Button class="mr--20 uploadFileToggler">Upload file</Button>
          <Button
            kind="secondary"
            on:click={() => {
              StoreService.update('MediaAddUpdateFolderModal', true);
            }}>
            Create new folder
          </Button>
        </div>
      </header>
      <MediaViewer {searchInput} {filterOptions} />
    </div>
  </div>
  <MediaAddUpdateFolderModal
    id={editFolderData.id}
    name={editFolderData.name}
    on:cancel={() => {
      editFolderData.id = '';
      editFolderData.name = '';
    }}
    on:done={(event) => {
      createFolder(event.detail.name, window.location.pathname.split('/')[4]);
    }} />
</Layout>
