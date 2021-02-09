<script lang="ts">
  import { beforeUpdate, onDestroy, onMount } from 'svelte';
  import type {
    Entry,
    EntryLite,
    Language,
    Media,
    Prop,
    PropQuillOption,
    Template,
    Widget,
  } from '@becomes/cms-sdk';
  import { PropType } from '@becomes/cms-sdk';
  import {
    GeneralService,
    LocalStorageService,
    sdk,
    StoreService,
    NotificationService,
    PropsCheckerService,
    ConfirmService,
    cy,
    KeyboardService,
  } from '../../services';
  import type { EntryModified } from '../../types';
  import {
    Spinner,
    Button,
    Select,
    PropsEditor,
    MediaPickerModal,
    MarkdownBoxDisplay,
    EntryContent,
    EntryAddContentSectionModal,
    Meta,
    PropQuillTitle,
    Statuses,
  } from '../../components';
  import { EntryUtil } from '../../util';
  import { Router } from '@becomes/svelte-router';

  export let params: {
    templateId?: string;
    entryId?: string;
  } = {};

  function findChildByClass(element: HTMLElement, c: string) {
    if (!element.children) {
      return;
    } else {
      for (let i = 0; i < element.children.length; i++) {
        const child = element.children[i];
        for (let j = 0; j < child.classList.length; j++) {
          const classItem = child.classList[j];
          if (classItem === c) {
            return child;
          }
        }
        const target = findChildByClass(child as HTMLElement, c);
        if (target) {
          return target;
        }
      }
    }
  }
  function findParentById(element: HTMLElement, id: string) {
    if (!element.parentElement) {
      return;
    } else if (element.parentElement.id === id) {
      return element.parentElement;
    } else {
      return findParentById(element.parentElement, id);
    }
  }
  const templateStoreUnsub = StoreService.subscribe(
    'template',
    async (value: Template[]) => {
      if (value) {
        const temp = value.find((e) => e._id === params.templateId);
        if (temp && template && temp.updatedAt === template.updatedAt) {
          return;
        }
        alert(`
          Template on which entry you are currently woking on
          has been updated by other user. This will result in
          content lost. We are sorry but content merging
          is not yet implemented.
        `);
        setTemplate(value);
      }
    }
  );
  const entryStoreUnsub = StoreService.subscribe(
    'entry',
    async (value: EntryLite[]) => {
      const targetEntry = value.find((e) => e._id === params.entryId);
      if (!targetEntry) {
        NotificationService.error(`
          Entry was deleted by another user
          and because of this you have been redirected, this page
          does no longer exist.`);
        Router.navigate(`/dashboard`);
      } else if (
        JSON.stringify(targetEntry) !== JSON.stringify(entry) &&
        !alertLatch
      ) {
        NotificationService.error(`
          Entry was updated by another user
          and because of this you have been redirected.`);
        Router.navigate(`/dashboard`);
      }
    }
  );
  const languageStoreUnsub = StoreService.subscribe(
    'language',
    async (value: Language[]) => {
      setLanguage(value);
    }
  );
  const pathStoreUnsub = Router.subscribeToPathChange(() => {
    alertLatch = true;
  });
  const updateLatch = {
    mounted: false,
    id: '',
  };
  const keyboardUnsub = KeyboardService.subscribe(
    ['Enter', 'ArrowUp', 'ArrowDown', 's'],
    async (event) => {
      const ae = document.activeElement as HTMLElement;
      if (ae) {
        for (let i = 0; i < entry.content[language.code].length; i++) {
          const prop = entry.content[language.code][i];
          const parent = findParentById(ae, prop.name);
          if (parent) {
            switch (event.key) {
              case 'ArrowUp':
                {
                  await moveSection(i, -1);
                }
                break;
              case 'ArrowDown':
                {
                  await moveSection(i, 1);
                }
                break;
              case 'Enter':
                {
                  setTimeout(() => {
                    StoreService.update('EntryAddContentSectionModal', {
                      show: true,
                      position: i + 1,
                    });
                  }, 100);
                }
                break;
            }
            return;
          }
        }
      }
      switch (event.key) {
        case 's':
          {
            if (params.entryId === '-') {
              addEntry();
            } else {
              updateEntry();
            }
          }
          break;
      }
    }
  );
  let routerInterceptUnsub: () => void = () => {};
  let template: Template;
  let entry: EntryModified;
  let languages: Language[] = [];
  let language: Language;
  let autoFillSlug: {
    [lng: string]: boolean;
  } = {};
  let alertLatch = false;
  let showUpdateSpinner = false;
  let showInstructions = true;

  function handlerTitleInput(value: string) {
    entry.meta[language.code][0].value[0] = value;
    if (autoFillSlug[language.code]) {
      entry.meta[language.code][1].value[0] = GeneralService.string.toUri(
        value
      );
    }
  }

  function handleSlugInput(event: Event) {
    const element = event.target as HTMLInputElement;
    entry.meta[language.code][1].value[0] = GeneralService.string.toUri(
      element.value
    );
    autoFillSlug[language.code] = false;
  }

  function handleMediaModalDone(
    event: CustomEvent<{
      media: Media;
      prop: Prop;
      propIndex: number;
      valueIndex: number;
      depth: string;
    }>
  ) {
    const prop = event.detail.prop;
    const uri = (
      event.detail.media.path +
      '/' +
      event.detail.media.name
    ).replace(/\/\//g, '/');
    if (event.detail.valueIndex === -1) {
      prop.value[0] = uri;
    } else {
      prop.value[event.detail.valueIndex] = uri;
    }
    const depthParts = event.detail.depth.split('.');
    if (depthParts[0] !== 'content') {
      const depth = depthParts.slice(1);
      depth[0] = `${parseInt(depth[0], 10) + 2}`;
      entry.meta[language.code] = updateByDepth(
        depth,
        entry.meta[language.code],
        prop,
        `entry.meta.${language.code}`
      );
    } else {
      const depth = depthParts.slice(2);
      let propIndex = 0;
      for (let i = 0; i < entry.content[language.code].length; i = i + 1) {
        const prop = entry.content[language.code][i];
        if (prop.name === depthParts[1]) {
          propIndex = i;
          break;
        }
      }
      entry.content[language.code][propIndex] = updateByDepth(
        depth,
        entry.content[language.code][propIndex],
        prop,
        `entry.content.${language.code}.${propIndex}`
      );
    }
  }

  function setTemplate(value: Template[]) {
    if (value) {
      const temp = value.find((e) => e._id === params.templateId);
      if (!temp) {
        NotificationService.error(`
            Template was deleted by another user
            and because of this you have been redirected because page
            does no longer exist.`);
        Router.navigate(`/dashboard`);
        return;
      } else {
        template = temp;
        // init(entryId);
      }
    }
  }

  function setLanguage(value: Language[]) {
    if (value) {
      languages = value;
      let langCode: string = LocalStorageService.get('lang');
      if (!langCode) {
        langCode = languages[0].code;
        LocalStorageService.set('lang', langCode);
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

  function selectLanguage(id: string) {
    language = languages.find((e) => e._id === id);
    LocalStorageService.set('lang', language.code);
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
      console.error(target);
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

  async function addSection(data: {
    position: number;
    type: 'primary' | 'widget';
    value: string;
  }) {
    if (
      data.position < 0 ||
      data.position > entry.content[language.code].length
    ) {
      NotificationService.error(
        `Cannot add section at position "${data.position}".`
      );
      return;
    }
    if (data.type === 'primary') {
      const prop: Prop = EntryUtil.contentSection.createPrimary(
        data.value as PropType
      );
      entry.content[language.code].splice(data.position, 0, prop);
      entry.content[language.code] = [...entry.content[language.code]];
      setTimeout(() => {
        const el = document.getElementById(prop.name);
        if (el) {
          const child = findChildByClass(el, 'ql-editor');
          if (child) {
            (child as HTMLElement).focus();
          }
        }
      }, 20);
    } else {
      const widget: Widget = await GeneralService.errorWrapper(
        async () => {
          return await sdk.widget.get(data.value);
        },
        async (value: Widget) => {
          return value;
        }
      );
      if (widget) {
        const prop: Prop = EntryUtil.contentSection.createWidget(widget);
        prop.label = widget.label;
        entry.content[language.code].splice(data.position, 0, prop);
        entry.content[language.code] = [...entry.content[language.code]];
      }
    }
  }

  async function moveSection(position: number, move: 1 | -1) {
    const newPosition = position + move;
    if (newPosition > -1 && newPosition < entry.content[language.code].length) {
      const buffer: Prop = JSON.parse(
        JSON.stringify(entry.content[language.code][newPosition])
      );
      entry.content[language.code][newPosition] = JSON.parse(
        JSON.stringify(entry.content[language.code][position])
      );
      entry.content[language.code][position] = buffer;
      setTimeout(() => {
        const el = document.getElementById(
          entry.content[language.code][newPosition].name
        );
        if (el) {
          const child = findChildByClass(el, 'ql-editor');
          if (child) {
            (child as HTMLElement).focus();
          }
        }
      }, 20);
    }
  }

  async function removeSection(position: number) {
    if (
      await ConfirmService.confirm(
        'Remove section',
        `Are you sure you want to remove ${
          entry.content[language.code][position].label
            ? '<strong>' +
              entry.content[language.code][position].label +
              '</strong>'
            : 'this'
        } section?`
      )
    ) {
      await GeneralService.errorWrapper(
        async () => {
          entry.content[language.code] = entry.content[language.code].filter(
            (_, i) => i !== position
          );
        },
        async () => {
          NotificationService.success('Section successfully deleted.');
        }
      );
    }
  }

  function updateContentProp(
    position: number,
    data: {
      ops?: PropQuillOption[];
      text?: string;
      widget?: Prop;
    }
  ) {
    if (data.widget) {
      entry.content[language.code][position] = data.widget;
    } else {
      entry.content[language.code][position].value = {
        ops: data.ops,
        text: data.text,
      };
    }
  }

  async function addEntry() {
    if (!PropsCheckerService.check()) {
      NotificationService.warning(
        'Entry contains one or more errors. Please fix them and continue.'
      );
      return;
    }
    showUpdateSpinner = true;
    const normalEntry = EntryUtil.fromModified(entry);
    const errorOrEntry: any = await GeneralService.errorWrapper(
      async () => {
        return await sdk.entry.add({
          templateId: template._id,
          status: entry.status,
          meta: normalEntry.meta,
          content: normalEntry.content,
        });
      },
      async (value: Entry) => {
        return value;
      },
      true
    );
    if (errorOrEntry.status) {
      console.error(errorOrEntry);
      if (errorOrEntry.code === 'etr003') {
        const errorPath = (errorOrEntry.message as string)
          .split(' [ data.')[1]
          .split(' ] ')[0]
          .split('.');
        if (errorPath[0].startsWith('meta')) {
          const lng = languages[parseInt(errorPath[0].charAt(5))];
          NotificationService.error(`Error in meta for language "${lng.name}"`);
        }
      } else {
        NotificationService.error(errorOrEntry.message);
      }
      showUpdateSpinner = false;
      return;
    }
    NotificationService.success('Entry successfully saved.');
    Router.navigate(
      `/dashboard/template/${template._id}/entry/${errorOrEntry._id}`,
      {
        replace: true,
      }
    );
    showUpdateSpinner = false;
  }

  async function updateEntry() {
    if (!PropsCheckerService.check()) {
      NotificationService.warning(
        'Entry contains one or more errors. Please fix them and continue.'
      );
      return;
    }
    showUpdateSpinner = true;
    const normalEntry = EntryUtil.fromModified(entry);
    const errorOrEntry: any = await GeneralService.errorWrapper(
      async () => {
        return await sdk.entry.update({
          _id: entry._id,
          templateId: template._id,
          status: entry.status,
          meta: normalEntry.meta,
          content: normalEntry.content,
        });
      },
      async (value: Entry) => {
        return value;
      },
      true
    );
    if (errorOrEntry.status && errorOrEntry.message) {
      console.error(errorOrEntry);
      NotificationService.error(errorOrEntry.message);
      showUpdateSpinner = false;
      return;
    }
    NotificationService.success('Entry successfully updated.');
    entry = EntryUtil.toModified(errorOrEntry);
    showUpdateSpinner = false;
  }

  async function init(eid: string) {
    if (eid === '') {
      if (!template && !language) {
        const getAssetsSuccess = await GeneralService.errorWrapper(
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
        );
        if (!getAssetsSuccess) {
          return;
        }
        entry = EntryUtil.instanceModified(false, languages, template.props);
      }
    } else if (eid === '-') {
      entry = EntryUtil.instanceModified(false, languages, template.props);
      entry._id = '1';
    } else {
      entry = await GeneralService.errorWrapper(
        async () => {
          return await sdk.entry.get({
            id: eid,
            templateId: template._id,
          });
        },
        async (value: Entry) => {
          return EntryUtil.toModified(value);
        }
      );
      languages.forEach((lng) => {
        if (entry.meta[lng.code][1].value[0] !== '') {
          autoFillSlug[lng.code] = false;
        }
      });
    }
  }

  onMount(() => {
    document.body.scrollTop = 0;
    routerInterceptUnsub = Router.beforeNavigate(async () => {
      const result = await ConfirmService.confirm(
        'Leaving entry editor',
        'Are you sure you want to leave this page?'
      );
      if (result) {
        routerInterceptUnsub();
      }
      return result;
    });
  });
  beforeUpdate(async () => {
    if (updateLatch.mounted) {
      if (updateLatch.id !== params.entryId && updateLatch.mounted) {
        updateLatch.id = '' + params.entryId;
        await init(updateLatch.id);
        document.body.scrollTop = 0;
      }
    } else {
      await init('');
      updateLatch.mounted = true;
    }
  });
  onDestroy(() => {
    templateStoreUnsub();
    entryStoreUnsub();
    languageStoreUnsub();
    pathStoreUnsub();
    keyboardUnsub();
    routerInterceptUnsub();
  });
</script>

<Meta
  title={language && entry && template && params.entryId !== '-'
    ? entry.meta[language.code][0].value[0]
    : template
    ? `Create new entry for ${template.label}`
    : 'Create new entry'}
/>
<div class="entryEditor">
  {#if template && language && entry && entry._id}
    <div class="entryEditor--header">
      {#if languages.length > 1}
        <Select
          class="_bcmsInput--select_lang"
          cyTag="select-lang"
          selected={language._id}
          options={languages.map((e) => {
            return { label: `${e.name}`, value: e._id };
          })}
          on:change={(event) => {
            if (event.detail.value) {
              selectLanguage(event.detail.value);
            }
          }}
        />
      {/if}
      <Statuses
        selected={entry.status ? entry.status : ''}
        on:change={(event) => {
          entry.status = event.detail._id;
        }}
      />
      <Button
        cyTag="add-update"
        disabled={showUpdateSpinner}
        kind="primary"
        on:click={() => {
          if (params.entryId === '-') {
            addEntry();
          } else {
            updateEntry();
          }
        }}
      >
        {params.entryId === '-' ? 'Save' : 'Update'}
      </Button>
    </div>

    <div class="entryEditor--body">
      <div class="entryEditor--instructions">
        {#if template.desc !== ''}
          <button
            use:cy={'instructions-toggle'}
            class="entryEditor--instructions-title {showInstructions
              ? 'is-active'
              : ''}"
            on:click={() => {
              showInstructions = !showInstructions;
            }}
          >
            Instructions
          </button>
          {#if showInstructions}
            <MarkdownBoxDisplay markdown={template.desc} />
          {/if}
        {/if}
      </div>
      <div use:cy={'meta'} class="entryEditor--meta">
        <div class="entryEditor--meta-row">
          <label class="entryEditor--meta-title" for="title">
            <span>Title:</span>
            <PropQuillTitle
              id="title"
              value={entry.meta[language.code][0].value[0]}
              placeholder="Entry title for {template.label}"
              name="entry.meta.{language.code}.0.value.0"
              on:update={(event) => {
                handlerTitleInput(
                  event.detail.text.replace('<p>', '').replace('</p>', '')
                );
              }}
            />
          </label>
        </div>
        <div class="entryEditor--meta-row entryEditor--meta-row_slug">
          <div class="entryEditor--meta-slug">
            <label>
              <span>/</span><input
                use:cy={'slug'}
                id="slug"
                value={entry.meta[language.code][1].value[0]}
                placeholder="slug"
                on:change={handleSlugInput}
                on:keyup={handleSlugInput}
              />
            </label>
          </div>
        </div>

        {#if entry.meta[language.code].length > 2}
          <PropsEditor
            depth="meta"
            props={entry.meta[language.code].slice(2)}
            on:update={(event) => {
              entry.meta[language.code][
                event.detail.propIndex + 2
              ] = JSON.parse(JSON.stringify(event.detail.prop));
            }}
          />
        {/if}
      </div>
      <div use:cy={'content'} class="entryEditor--content">
        <!-- <div class="entryEditor--content-title">Content</div> -->
        <EntryContent
          content={entry.content[language.code]}
          on:enter={() => {}}
          on:move={(event) => {
            moveSection(event.detail.position, event.detail.move);
          }}
          on:addParagraph={(event) => {
            addSection({
              position: event.detail.position,
              type: 'primary',
              value: PropType.PARAGRAPH,
            });
          }}
          on:new={(event) => {
            StoreService.update('EntryAddContentSectionModal', {
              show: true,
              position: event.detail.position,
            });
          }}
          on:update={(event) => {
            updateContentProp(event.detail.position, {
              ops: event.detail.ops,
              text: event.detail.text,
              widget: event.detail.widget,
            });
          }}
          on:remove={(event) => {
            removeSection(event.detail.position);
          }}
        />
      </div>
    </div>
  {/if}
</div>
<MediaPickerModal
  class="bcmsModal_mediaPicker"
  on:done={handleMediaModalDone}
/>
<EntryAddContentSectionModal
  on:done={(event) => {
    addSection({
      position: event.detail.position,
      type: event.detail.selected.type,
      value: event.detail.selected.value,
    });
  }}
/>
<Spinner show={template && language && entry ? false : true} />
<Spinner show={showUpdateSpinner} />
