<script lang="ts">
  import { onMount } from 'svelte';
  import { GeneralService, LanguageService, sdk } from '../../services';
  import { Layout, Select, RadioInput } from '../../components';
  import type { Language } from '@becomes/cms-sdk';

  let languages: Language[] = [];
  let languageCode = {
    label: '',
    value: '',
    error: '',
  };
  let isDropdownVisible: boolean = false;
  let searchInput = '';

  async function addLanguage() {
    if (languageCode.value === '') {
      languageCode.error = 'Please select a language to add.';
      return;
    }
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
  }
  async function removeLanguage(lang: Language) {
    if (confirm('Are you sure you want to delete the language.')) {
      await GeneralService.errorWrapper(
        async () => {
          await sdk.language.deleteById(lang._id);
        },
        async () => {
          languages = languages.filter((e) => e._id !== lang._id);
        }
      );
    }
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
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="languages--button-label">
              <RadioInput name="language" value={i === 0} disabled={true}>
                <i slot="checkmark" class="fas fa-check" />
              </RadioInput>
            </label>
            <img
              src={`/assets/flags/${language.code}.jpg`}
              class="languages--flag"
              alt={language.name} />
            <h4 class="languages--name" on:click|self>{language.name}</h4>
            {#if language.code !== 'en'}
              <button
                on:click={() => {
                  removeLanguage(language);
                }}
                class="languages--icon languages--icon_close">
                <i class="fas fa-times" />
              </button>
            {/if}
          </button>
        {/each}
        <button
          on:click|self={() => {
            isDropdownVisible = !isDropdownVisible;
            if (!isDropdownVisible) {
              searchInput = '';
            }
          }}
          class="languages--button languages--button_add">
          <span class="languages--icon languages--icon_add">
            <i class="fas fa-plus" />
          </span>
          <span class="languages--name">Add</span>
          {#if isDropdownVisible}
            <div class="languages--dropdown">
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
                    return { label: `${e.name} | ${e.nativeName}`, value: e.code };
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
