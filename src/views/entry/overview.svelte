<script lang="ts">
  import { onMount, onDestroy, beforeUpdate } from 'svelte';
  import type { EntryLite, Language, Template } from '@becomes/cms-sdk';
  import type {
    EntryFilter as EntryFilterType,
    EntryLiteModified,
  } from '../../types';
  import { DateUtil, EntryUtil } from '../../util';
  import {
    GeneralService,
    LocalStorageService,
    sdk,
    StoreService,
    NotificationService,
    ConfirmService,
  } from '../../services';
  import {
    Spinner,
    Select,
    OverflowMenu,
    OverflowMenuItem,
    EntryFullModelModal,
    EntryFilterComponent,
    Link,
  } from '../../components';
  import { EditIcon } from '../../components/icons';
  import { Router } from '../../router';

  export let params: {
    templateId?: string;
  } = {};

  const templateStoreUnsub = StoreService.subscribe(
    'template',
    async (value: Template[]) => {
      if (value) {
        const temp = value.find((e) => e._id === params.templateId);
        if (!temp) {
          NotificationService.error(`
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
        entriesLiteModified = await getEntries(
          value
            .map((e) => {
              return EntryUtil.liteToModified(e);
            })
            .sort((a, b) => b.createdAt - a.createdAt)
        );
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
          langCode = languages[0].code;
        }
        if (!language) {
          language = languages.find((e) => e.code === langCode);
        } else {
          const lang = languages.find((e) => e._id === language._id);
          if (!lang) {
            NotificationService.error(`
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
  let entriesLiteModified: EntryLiteModified[] = [];
  let entryInFocus: EntryLiteModified;
  let languages: Language[] = [];
  let language: Language;

  async function getEntries(
    _entries?: EntryLiteModified[],
    filter?: EntryFilterType
  ): Promise<EntryLiteModified[]> {
    let output: EntryLiteModified[] = [];
    output = await GeneralService.errorWrapper(
      async () => {
        if (filter) {
          if (
            filter.search.name.length > 2 ||
            filter.options.find((option) => {
              if (option.dateCreated && option.dateCreated.year !== -1) {
                return true;
              } else if (option.dateUpdated && option.dateUpdated.year !== -1) {
                return true;
              }
              return false;
            })
          ) {
            return (await sdk.entry.getAllLite(params.templateId)).map((e) => {
              return EntryUtil.liteToModified(e);
            });
          }
        }
        return (await sdk.entry.getAllLite(params.templateId)).map((e) => {
          return EntryUtil.liteToModified(e);
        });
      },
      async (value: EntryLiteModified[]) => {
        return value;
      }
    );
    if (filter) {
      output = filterEntries(output, filter);
    }
    return output.sort((a, b) => b.createdAt - a.createdAt);
  }

  function filterEntries(
    entries: EntryLiteModified[],
    filter: EntryFilterType
  ) {
    if (filter.search.name.length > 2) {
      entries = entries.filter((item) => {
        return `${item._id} ${item.meta[language.code][0].value[0]}`
          .toLowerCase()
          .includes(filter.search.name.trim().toLowerCase());
      });
    }
    for (const i in filter.options) {
      const option = filter.options[i];
      if (option.dateCreated && option.dateCreated.year !== -1) {
        entries = entries.filter((item) => {
          const date = new Date(item.createdAt);
          return (
            date.getFullYear() === option.dateCreated.year &&
            date.getMonth() + 1 === option.dateCreated.month &&
            date.getDate() === option.dateCreated.day
          );
        });
      } else if (option.dateUpdated && option.dateUpdated.year !== -1) {
        entries = entries.filter((item) => {
          const date = new Date(item.updatedAt);
          return (
            date.getFullYear() === option.dateUpdated.year &&
            date.getMonth() + 1 === option.dateUpdated.month &&
            date.getDate() === option.dateUpdated.day
          );
        });
      }
    }
    return entries;
  }

  async function removeEntry(id: string) {
    if (
      await ConfirmService.confirm(
        'Delete Entry',
        `Are you sure you want to delete this entry?`
      )
    ) {
      await GeneralService.errorWrapper(
        async () => {
          await sdk.entry.deleteById({
            id,
            templateId: params.templateId,
          });
        },
        async () => {
          StoreService.update(
            'entry',
            await sdk.entry.getAllLite(params.templateId)
          );
        }
      );
    }
  }

  function selectLanguage(id: string) {
    language = languages.find((e) => e._id === id);
    LocalStorageService.set('lang', language.code);
  }

  onMount(async () => {
    entriesLiteModified = await getEntries();
    buffer.id = params.templateId;
    await GeneralService.errorWrapper(
      async () => {
        return {
          languages: await sdk.language.getAll(),
        };
      },
      async (value: { languages: Language[] }) => {
        StoreService.update('language', value.languages);
      }
    );
  });
  beforeUpdate(async () => {
    Router.setTitle(template ? template.label : 'Entries');
    if (buffer.id !== params.templateId) {
      buffer.id = params.templateId;
      await GeneralService.errorWrapper(
        async () => {
          return {
            templates: await sdk.template.getAll(),
            entries: await sdk.entry.getAllLite(params.templateId),
          };
        },
        async (value: { templates: Template[]; entries: EntryLite[] }) => {
          StoreService.update('template', value.templates);
          StoreService.update('entry', value.entries);
        }
      );
      entriesLiteModified = await getEntries();
    }
  });
  onDestroy(() => {
    templateStoreUnsub();
    entryStoreUnsub();
    languageStoreUnsub();
  });
</script>

{#if template && language}
  <div class="view entryOverview">
    <EntryFilterComponent
      {template}
      {entriesLiteModified}
      on:reset={async (event) => {
        entriesLiteModified = await getEntries(undefined, event.detail);
      }}
      on:filter={async (event) => {
        entriesLiteModified = await getEntries(undefined, event.detail);
      }} />
    <div class="view--content">
      {#if entriesLiteModified.length > 0}
        {#if languages.length > 1}
          <Select
            label="Select language"
            selected={language._id}
            options={languages.map((e) => {
              return { label: `${e.name}`, value: e._id };
            })}
            on:change={(event) => {
              if (event.detail.value) {
                selectLanguage(event.detail.value);
              }
            }} />
        {/if}
        <ul class="entryOverview--entries">
          <li class="entryOverview--entries-item entryOverview--cols">
            <div class="entryOverview--entries-createdAt">
              <span>Created At</span>
            </div>
            <div class="entryOverview--entries-updatedAt">
              <span>Updated At</span>
            </div>
            <div class="entryOverview--entries-title"><span>Title</span></div>
          </li>
          {#each entriesLiteModified as entryLiteModified}
            <li class="entryOverview--entries-item entryOverview--cols">
              <div
                class="entryOverview--entries-item-col
                    entryOverview--entries-createdAt"
                data-column-name="Created At"
                title={DateUtil.readableDate(entryLiteModified.createdAt).tooltipDateFormat}>
                <span>{DateUtil.readableDate(entryLiteModified.createdAt).dateFormat}</span>
              </div>
              <div
                class="entryOverview--entries-item-col
                    entryOverview--entries-updatedAt"
                data-column-name="Updated At"
                title={DateUtil.readableDate(entryLiteModified.updatedAt).tooltipDateFormat}>
                <span>{DateUtil.readableDate(entryLiteModified.updatedAt).dateFormat}</span>
              </div>
              <div
                class="entryOverview--entries-item-col
                    entryOverview--entries-title"
                data-column-name="Title"
                title={entryLiteModified.meta[language.code][0].value[0] || 'No given title'}>
                <span>{entryLiteModified.meta[language.code][0].value[0] || 'No given title'}</span>
              </div>
              <div class="entryOverview--entries-actions">
                <Link
                  href={`/dashboard/template/${template._id}/entry/${entryLiteModified._id}`}
                  class="entryOverview--entries-actions-edit bcmsButton bcmsButton_alternate bcmsButton_m">
                  <EditIcon class="bcmsButton--icon" />
                  <span>Edit</span>
                </Link>
                <OverflowMenu position="right">
                  <OverflowMenuItem
                    text="View model"
                    icon="view-model"
                    on:click={() => {
                      entryInFocus = entryLiteModified;
                      StoreService.update('EntryFullModelModal', true);
                    }} />
                  <OverflowMenuItem
                    text="Remove"
                    icon="trash"
                    on:click={() => {
                      removeEntry(entryLiteModified._id);
                      // entryToRemove = entryLiteModified._id;
                      // StoreService.update('ConfirmDeleteModal', true);
                    }} />
                </OverflowMenu>
              </div>
            </li>
          {/each}
        </ul>
      {:else}
        <div>
          <h3 class="entryOverview--entries_empty">
            There are no entries available.
          </h3>
        </div>
      {/if}
    </div>
  </div>
{/if}
<Spinner show={template && language ? false : true} />
<EntryFullModelModal
  entryId={entryInFocus ? entryInFocus._id : ''}
  templateId={template ? template._id : ''} />
