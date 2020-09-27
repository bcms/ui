<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import {
    Entry,
    EntryLite,
    EntryMeta,
    Language,
    Prop,
    PropGroupPointer,
    PropType,
    Template,
  } from '@becomes/cms-sdk';
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
    PropsEditor,
    MediaPickerModal,
  } from '../../components';

  export let templateId: string;
  export let entryId: string;

  interface EntryModified {
    _id: string;
    createdAt: number;
    updatedAt: number;
    meta: {
      [lng: string]: Prop[];
    };
    templateId: string;
    userId: string;
    content: any[];
  }
  interface ErrorObject {
    [propName: string]: {
      value: string;
      children?: ErrorObject;
    };
  }

  const templateStoreUnsub = StoreService.subscribe(
    'template',
    async (value: Template[]) => {
      setTemplate(value);
    }
  );
  const entryStoreUnsub = StoreService.subscribe(
    'entry',
    async (value: EntryLite[]) => {
      if (value && entryId !== '-' && !value.find((e) => e._id === entryId)) {
        popup.error(`
          Entry was deleted by another user
          and because of this you have been redirected, this page 
          does no longer exist.`);
        GeneralService.navigate(`/dashboard`);
      }
    }
  );
  const languageStoreUnsub = StoreService.subscribe(
    'language',
    async (value: Language[]) => {
      setLanguage(value);
    }
  );
  let template: Template;
  let entry: EntryModified;
  let languages: Language[] = [];
  let language: Language;
  let autoFillSlug: {
    [lng: string]: boolean;
  } = {};
  let errors: {
    meta: ErrorObject;
  };

  async function setEntry(id: string) {
    if (id === '-') {
      entry = {
        _id: '',
        createdAt: 0,
        updatedAt: 0,
        meta: {},
        templateId: template._id,
        userId: '',
        content: [],
      };
      languages.forEach((lng) => {
        entry.meta[lng.code] = JSON.parse(
          JSON.stringify(template.props)
        ) as Prop[];
      });
    } else {
      await GeneralService.errorWrapper(
        async () => {
          return await sdk.entry.get({
            templateId: template._id,
            id,
          });
        },
        async (value: Entry) => {
          entry = {
            _id: value._id,
            createdAt: value.createdAt,
            updatedAt: value.updatedAt,
            meta: {},
            templateId: template._id,
            userId: value.userId,
            content: [],
          };
          languages.forEach((lng) => {
            entry.meta[lng.code] = JSON.parse(
              JSON.stringify(value.meta.find((e) => e.lng === lng.code).props)
            ) as Prop[];
          });
          Object.keys(autoFillSlug).forEach((key) => {
            autoFillSlug[key] = false;
          });
        }
      );
    }
  }
  function getErrorObject(props: Prop[]): ErrorObject {
    const error: ErrorObject = {};
    for (const i in props) {
      const prop = props[i];
      if (prop.type === PropType.GROUP_POINTER) {
        const value = prop.value as PropGroupPointer;
        error[prop.name] = {
          value: '',
          children: getErrorObject(value.items[0].props),
        };
      } else {
        error[prop.name] = {
          value: '',
        };
      }
    }
    return error;
  }
  function setTemplate(value: Template[]) {
    if (value) {
      const temp = value.find((e) => e._id === templateId);
      if (!temp) {
        popup.error(`
            Template was deleted by another user
            and because of this you have been redirected because page 
            does no longer exist.`);
        GeneralService.navigate(`/dashboard`);
        return;
      } else {
        template = temp;
      }
    }
  }
  function setLanguage(value: Language[]) {
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
  function selectLanguage(id: string) {
    language = languages.find((e) => e._id === id);
    LocalStorageService.set('lang', language.code);
  }
  function normalizeEntry(): Entry {
    const normalMeta: EntryMeta[] = [];
    for (const key in entry.meta) {
      normalMeta.push({
        lng: key,
        props: entry.meta[key],
      });
    }
    return {
      _id: entry._id,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
      meta: normalMeta,
      templateId: entry.templateId,
      userId: entry.userId,
      content: entry.content,
    };
  }
  function updateByDepth(
    depth: string[],
    target: any,
    value: any,
    level: string
  ) {
    if (depth.length === 0) {
      return value;
    }
    if (typeof target[depth[0]] === 'undefined') {
      throw Error(`None existing: ${level}.${depth[0]}`);
    }
    target[depth[0]] = updateByDepth(
      depth.slice(1),
      target[depth[0]],
      value,
      `${level}.${depth[0]}`
    );
    return target;
  }

  async function addEntry() {
    const normalEntry = normalizeEntry();
    const error = await GeneralService.errorWrapper(
      async () => {
        await sdk.entry.add({
          templateId: template._id,
          meta: normalEntry.meta,
        });
      },
      async () => {}
    );
    if (error) {
      console.error(error);
    }
  }
  async function updateEntry() {
    const normalEntry = normalizeEntry();
  }

  onMount(async () => {
    if (
      await GeneralService.errorWrapper(
        async () => {
          return {
            templates: await sdk.template.getAll(),
            languages: await sdk.language.getAll(),
          };
        },
        async (value: { templates: Template[]; languages: Language[] }) => {
          setTemplate(value.templates);
          languages = value.languages;
          languages.forEach((lng) => {
            autoFillSlug[lng.code] = true;
          });
          setLanguage(value.languages);
          return true;
        }
      )
    ) {
      await setEntry(entryId);
      errors = { meta: getErrorObject(template.props) };
      console.log(errors);
    }
  });
  onDestroy(() => {
    templateStoreUnsub();
    entryStoreUnsub();
    languageStoreUnsub();
  });
</script>

<div in:fade={{ delay: 250 }} class="entry-editor">
  {#if template && language && entry}
    <div class="entry-editor--top">
      <div class="options">
        <h3>
          {#if entryId === '-'}
            Create new entry for {template.label}
          {:else}Update entry for {template.label}{/if}
        </h3>
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
      <Button
        class="ml--auto mb--auto"
        icon="fas fa-{entryId === '-' ? 'save' : 'check'}"
        on:click={() => {
          if (entryId === '-') {
            addEntry();
          } else {
            updateEntry();
          }
        }}>
        {entryId === '-' ? 'Save' : 'Update'}
      </Button>
    </div>
    <div class="entry-editor--meta">
      <div class="entry-editor--meta-title">
        <label for="title">Title</label>
        <input
          id="title"
          value={entry.meta[language.code][0].value[0]}
          placeholder="Title"
          on:change={(event) => {
            entry.meta[language.code][0].value[0] = event.target.value;
            if (autoFillSlug[language.code]) {
              entry.meta[language.code][1].value[0] = GeneralService.string.toUri(event.target.value);
            }
          }}
          on:keyup={(event) => {
            entry.meta[language.code][0].value[0] = event.target.value;
            if (autoFillSlug[language.code]) {
              entry.meta[language.code][1].value[0] = GeneralService.string.toUri(event.target.value);
            }
          }} />
      </div>
      <div class="entry-editor--meta-slug">
        <label for="slug">Slug</label>
        <div class="domain">
          <div
            on:click={() => {
              document.getElementById('slug').focus();
            }}>
            https://example.com/{language.code}/{template.name}/
          </div>
          <input
            id="slug"
            value={entry.meta[language.code][1].value[0]}
            placeholder="Slug"
            on:change={(event) => {
              entry.meta[language.code][1].value[0] = GeneralService.string.toUri(event.target.value);
              autoFillSlug[language.code] = false;
            }}
            on:keyup={(event) => {
              entry.meta[language.code][1].value[0] = GeneralService.string.toUri(event.target.value);
              autoFillSlug[language.code] = false;
            }} />
        </div>
      </div>
      {#if entry.meta[language.code].length > 2}
        <div class="entry-editor--meta-props-block">
          <h4>Meta</h4>
          <div class="entry-editor--meta-props-wrapper">
            <PropsEditor
              depth="props"
              props={entry.meta[language.code].slice(2)}
              on:update={(event) => {
                entry.meta[language.code][event.detail.propIndex + 2] = event.detail.prop;
              }} />
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>
<MediaPickerModal
  on:done={(event) => {
    const prop = event.detail.prop;
    const uri = (event.detail.media.path + '/' + event.detail.media.name).replace(/\/\//g, '/');
    if (event.detail.valueIndex === -1) {
      prop.value[0] = uri;
    } else {
      prop.value[event.detail.valueIndex] = uri;
    }
    const depth = event.detail.depth.split('.').slice(1);
    depth[0] = `${parseInt(depth[0], 10) + 2}`;
    entry.meta[language.code] = updateByDepth(depth, entry.meta[language.code], prop, `entry.meta.${language.code}`);
  }} />
<Spinner show={template && language && entry ? false : true} />
