<script lang="ts">
  import { onMount, onDestroy, beforeUpdate } from 'svelte';
  import { fade } from 'svelte/transition';
  import type { EntryLite, Language, Prop, Template } from '@becomes/cms-sdk';
  import type { EntryLiteModifiedMeta } from '../../types';
  import { EntryUtil } from '../../util';
  import {
    GeneralService,
    LocalStorageService,
    sdk,
    StoreService,
  } from '../../services';
  import {
    popup,
    Spinner,
    Button,
    Select,
    SelectItem,
    OverflowMenu,
    OverflowMenuItem,
    EntryFullModelModal,
  } from '../../components';

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
        entriesLiteModified = value.map((e) => {
          return EntryUtil.liteToModifiedMeta(e);
        });
        entriesLiteModified.sort((a, b) => b.createdAt - a.createdAt);
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
  let entriesLiteModified: EntryLiteModifiedMeta[] = [];
  let entryInFocus: EntryLiteModifiedMeta;
  let languages: Language[] = [];
  let language: Language;

  async function removeEntry(id: string) {
    if (confirm('Are you sure you want to dete an entry.')) {
      await GeneralService.errorWrapper(
        async () => {
          await sdk.entry.deleteById({
            id,
            templateId,
          });
        },
        async () => {
          StoreService.update('entry', await sdk.entry.getAllLite(templateId));
        }
      );
    }
  }

  function addEntry() {
    GeneralService.navigate(`${window.location.pathname}/-`);
  }
  function selectLanguage(id: string) {
    language = languages.find((e) => e._id === id);
    LocalStorageService.set('lang', language.code);
  }
  function getDescriptionProp(props: Prop[]) {
    const descProp = props.find((e) => e.name === 'description');
    if (!descProp) {
      return '';
    }
    return descProp.value[0];
  }

  onMount(async () => {
    buffer.id = templateId;
    await GeneralService.errorWrapper(
      async () => {
        return {
          // templates: await sdk.template.getAll(),
          // entries: await sdk.entry.getAllLite(templateId),
          languages: await sdk.language.getAll(),
        };
      },
      async (value: {
        // templates: Template[];
        // entries: EntryLite[];
        languages: Language[];
      }) => {
        // StoreService.update('template', value.templates);
        // StoreService.update('entry', value.entries);
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
        <h4>{entriesLiteModified.length} entries found</h4>
        <Button
          class="mt--20"
          icon="fas fa-plus"
          on:click={() => {
            addEntry();
          }}>
          Add new Entry
        </Button>
        <Select
          class="mt--20 w--max-300"
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
      {#if entriesLiteModified.length > 0}
        <div class="entry-overview--entries">
          <table>
            <thead>
              <tr>
                <th />
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {#each entriesLiteModified as entryLiteModified, i}
                <tr>
                  <td class="number">{entriesLiteModified.length - i}.</td>
                  <td class="id">{entryLiteModified._id}</td>
                  <td class="title">
                    {entryLiteModified.meta[language.code][0].value[0]}
                  </td>
                  <td class="desc">
                    {getDescriptionProp(entryLiteModified.meta[language.code])}
                  </td>
                  <td class="actions">
                    <OverflowMenu position="right">
                      <OverflowMenuItem
                        text="Edit"
                        on:click={() => {
                          GeneralService.navigate(`/dashboard/template/${template._id}/entry/${entryLiteModified._id}`);
                        }} />
                      <OverflowMenuItem
                        text="View model"
                        on:click={() => {
                          entryInFocus = entryLiteModified;
                          StoreService.update('EntryFullModelModal', true);
                        }} />
                      <OverflowMenuItem
                        text="Remove"
                        danger
                        on:click={() => {
                          removeEntry(entryLiteModified._id);
                        }} />
                    </OverflowMenu>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
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
<EntryFullModelModal
  entryId={entryInFocus ? entryInFocus._id : ''}
  templateId={template ? template._id : ''} />
