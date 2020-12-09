<script lang="ts">
  import { onMount } from 'svelte';
  import {
    ClickOutsideService,
    ConfirmService,
    GeneralService,
    LanguageService,
    sdk,
  } from '../../services';
  import { Layout, Select } from '../../components';
  import type { Language } from '@becomes/cms-sdk';
  import Spinner from '../../components/spinner.svelte';
  import * as uuid from 'uuid';
  import { CloseIcon, PlusIcon } from '../../components/icons';

  const closeDropdown = ClickOutsideService.bind(() => {
    isDropdownVisible = false;
  });

  let languages: Language[] = [];
  let languageCode = {
    label: '',
    value: '',
    error: '',
  };
  let isDropdownVisible: boolean = false;
  let searchInput = '';
  let loginInProcess: boolean = false;
  let languagesDropdownData: {
    el: HTMLDivElement;
    id: string;
    x: number;
    y: number;
  } = {
    el: undefined,
    id: uuid.v4(),
    x: 0,
    y: 0,
  };

  async function addLanguage() {
    if (languageCode.value === '') {
      languageCode.error = 'Please select a language to add.';
      return;
    }
    loginInProcess = true;
    languageCode.error = '';
    const isoLanguage = LanguageService.get(languageCode.value);
    await GeneralService.errorWrapper(
      async () => {
        return await sdk.language.add(isoLanguage);
      },
      async (value: Language) => {
        languages = [...languages, value];
        languageCode = {
          label: '',
          value: '',
          error: '',
        };
      }
    );
    isDropdownVisible = false;
    searchInput = '';
    loginInProcess = false;
  }
  async function removeLanguage(langId: string) {
    if (
      await ConfirmService.confirm(
        'Delete Language',
        `Are you sure you want to delete this language?`
      )
    ) {
      loginInProcess = true;
      await GeneralService.errorWrapper(
        async () => {
          await sdk.language.deleteById(langId);
        },
        async () => {
          languages = languages.filter((e) => e._id !== langId);
        }
      );
      loginInProcess = false;
    }
  }

  function checkForDropdownOverflow() {
    setTimeout(() => {
      const el = languagesDropdownData.el;

      const rect = el.getBoundingClientRect();

      const xDiff = rect.right - window.innerWidth;
      const yDiff = rect.bottom - window.innerHeight;

      if (xDiff > 5) {
        languagesDropdownData.x = xDiff + 10;
      }
      if (yDiff > 5) {
        languagesDropdownData.y = yDiff + 10;
      }
    }, 0);
  }

  onMount(async () => {
    languages = await sdk.language.getAll();
    if (languages.length === 0) {
      let language = await sdk.language.add(LanguageService.get('en'));
      language = await sdk.language.update({
        _id: language._id,
        def: true,
      });
      languages = [language];
    }
  });
</script>

<Layout>
  <div class="view languages">
    <header class="view--header">
      <h2 class="view--title">Language</h2>
      <p class="view--description">
        Add languages that will be available for entries
      </p>
    </header>
    <div class="view--content">
      <div class="languages--buttons">
        {#each languages as language, i}
          <button class="languages--button">
            <img
              src={`/assets/flags/${language.code}.jpg`}
              class="languages--flag"
              alt={language.name} />
            <h4 class="languages--name" on:click|self>{language.name}</h4>
            <button
              on:click={() => {
                removeLanguage(language._id);
              }}
              class="languages--icon languages--icon_close">
              <CloseIcon />
            </button>
          </button>
        {/each}
        <button
          on:click|self={() => {
            isDropdownVisible = !isDropdownVisible;
            if (!isDropdownVisible) {
              searchInput = '';
            } else {
              languagesDropdownData.x = 0;
              languagesDropdownData.y = 0;
              checkForDropdownOverflow();
              searchInput = '';
            }
          }}
          class="languages--button languages--button_add">
          <span class="languages--icon languages--icon_add">
            <PlusIcon />
          </span>
          <span class="languages--name">Add</span>
          {#if isDropdownVisible}
            <div
              use:closeDropdown
              id={languagesDropdownData.id}
              class="languages--dropdown"
              bind:this={languagesDropdownData.el}
              style="transform: translate({-languagesDropdownData.x}px, {-languagesDropdownData.y}px);">
              <Select
                label="Language"
                hasSearch={true}
                options={LanguageService.getAll()
                  .filter((e) => {
                    return !languages.find((lng) => lng.code === e.code) && `${e.name} ${e.nativeName}`
                        .toLowerCase()
                        .includes(searchInput);
                  })
                  .map((e) => {
                    return { label: `${e.name} | ${e.nativeName}`, value: e.code, imgUrl: `/assets/flags/${e.code}.jpg` };
                  })}
                on:change={(event) => {
                  languageCode.label = event.detail.label;
                  languageCode.value = event.detail.value;
                  addLanguage();
                }}
                on:search={(event) => {
                  searchInput = event.detail;
                }} />
            </div>
          {/if}
        </button>
      </div>
    </div>
  </div>
</Layout>
<Spinner show={loginInProcess} />
