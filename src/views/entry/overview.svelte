<script lang="ts">
  import { onMount, onDestroy, beforeUpdate } from 'svelte';
  import { fade } from 'svelte/transition';
  import type { EntryLite, Language, Template } from '@becomes/cms-sdk';
  import {
    GeneralService,
    LocalStorageService,
    sdk,
    StoreService,
  } from '../../services';
  import { popup, Spinner, Button, Select, SelectItem } from '../../components';

  export let templateId: string;

  const templateStoreUnsub = StoreService.subscribe(
    'template',
    async (value: Template[]) => {
      if (value) {
        const temp = value.find((e) => e._id === templateId);
        if (!temp) {
          popup.error(`
            Template that you were looking at was deleted by another user
            and because of this you have been redirected to because page 
            does no longer exist.`);
          GeneralService.navigate(`/dashboard`);
          return;
        } else {
          template = temp;
        }
      }
    }
  );
  const entryStoreUnsub = StoreService.subscribe(
    'entry',
    async (value: EntryLite[]) => {
      if (value) {
        entriesLite = value;
      }
    }
  );
  const languageStoreUnsub = StoreService.subscribe(
    'language',
    async (value: Language[]) => {
      if (value) {
        languages = value;
        let langCode: string = LocalStorageService.get('lang');
        if (!langCode) {
          langCode = 'en';
        }
        if (!language) {
          language = languages.find((e) => e.code === langCode);
        } else {
          const lang = languages.find((e) => e._id === language._id);
          if (!lang) {
            popup.error(`
              Language in which you are viewing the page has been deleted
              and because of this language was switched to the default one.
            `);
            language = languages.find((e) => e.code === langCode);
          } else {
            language = lang;
          }
        }
      }
    }
  );
  const buffer = {
    id: '',
  };
  let template: Template;
  let entriesLite: EntryLite[] = [];
  let languages: Language[] = [];
  let language: Language;

  function addEntry() {
    GeneralService.navigate(`${window.location.pathname}/-`);
  }
  function selectLanguage(id: string) {
    language = languages.find((e) => e._id === id);
    LocalStorageService.set('lang', language.code);
  }

  onMount(async () => {
    buffer.id = templateId;
    await GeneralService.errorWrapper(
      async () => {
        return {
          templates: await sdk.template.getAll(),
          entries: await sdk.entry.getAllLite(templateId),
          languages: await sdk.language.getAll(),
        };
      },
      async (value: {
        templates: Template[];
        entries: EntryLite[];
        languages: Language[];
      }) => {
        StoreService.update('template', value.templates);
        StoreService.update('entry', value.entries);
        StoreService.update('language', value.languages);
      }
    );
  });
  beforeUpdate(async () => {
    if (buffer.id !== templateId) {
      buffer.id = templateId;
      await GeneralService.errorWrapper(
        async () => {
          return {
            templates: await sdk.template.getAll(),
            entries: await sdk.entry.getAllLite(templateId),
          };
        },
        async (value: { templates: Template[]; entries: EntryLite[] }) => {
          StoreService.update('template', value.templates);
          StoreService.update('entry', value.entries);
        }
      );
    }
  });
  onDestroy(() => {
    templateStoreUnsub();
    entryStoreUnsub();
    languageStoreUnsub();
  });
</script>

<div class="entry-overview">
  <div in:fade={{ delay: 250 }} class="entry-overview--wrapper">
    {#if template && language}
      <div class="entry-overview--top">
        <h3>{template.label}</h3>
        <h4>{entriesLite.length} entries found</h4>
        <Button
          class="mt--20"
          icon="fas fa-plus"
          on:click={() => {
            addEntry();
          }}>
          Add new Entry
        </Button>
        <Select
          class="mt--20"
          label="View language"
          on:change={(event) => {
            selectLanguage(event.detail);
          }}>
          {#each languages as lang}
            <SelectItem
              text="{lang.name} | {lang.nativeName}"
              value={lang._id}
              selected={lang._id === language._id ? true : false} />
          {/each}
        </Select>
      </div>
      {#if entriesLite.length > 0}
        <div class="entry-overview--entries">
          {#each entriesLite as entry}{entry.templateId}{/each}
        </div>
      {:else}
        <div class="entry-overview--entries-none">
          <div class="message">There are no entries available.</div>
          <Button
            class="mt--50px"
            kind="ghost"
            icon="fas fa-plus"
            on:click={() => {
              addEntry();
            }}>
            Add new Entry
          </Button>
        </div>
      {/if}
    {/if}
  </div>
</div>
<Spinner show={template && language ? false : true} />
