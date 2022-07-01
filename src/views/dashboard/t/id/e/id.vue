<script lang="tsx">
/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  BCMSEntry,
  BCMSLanguage,
  BCMSSocketTemplateEvent,
  BCMSTemplate,
} from '@becomes/cms-sdk/types';
import { BCMSSocketEventName } from '@becomes/cms-sdk/types';
import {
  computed,
  defineComponent,
  onBeforeUpdate,
  onMounted,
  onUnmounted,
  ref,
} from '@vue/runtime-core';
import {
  BCMSSpinner,
  BCMSSelect,
  BCMSButton,
  BCMSEntryStatus,
  BCMSMarkdownDisplay,
  BCMSPropEditor,
  BCMSContentEditor,
  BCMSIcon,
  BCMSMetaTitle,
} from '../../../../../components';
import type { BCMSEntryExtended } from '../../../../../types';
import type { Editor, JSONContent } from '@tiptap/core';
import { useRoute, useRouter } from 'vue-router';
import { useTranslation } from '../../../../../translations';

const component = defineComponent({
  setup() {
    const translations = computed(() => {
      return useTranslation();
    });
    const throwable = window.bcms.util.throwable;
    const store = window.bcms.vue.store;
    const route = useRoute();
    const params = computed(() => {
      return route.params as { eid: string; tid: string };
    });
    const router = useRouter();
    const activeLanguage = ref(window.bcms.sdk.storage.get('lang'));
    const entry = ref<BCMSEntryExtended>();
    const showInstructions = ref(false);
    const doNotAutoFillSlug = ref<{ [lngCode: string]: boolean }>({});
    const spinner = ref({
      message: translations.value.page.entry.spinner.message,
      show: true,
    });
    const metaProps = computed(() => {
      if (!entry.value || !language.value.target) {
        return [];
      }
      return entry.value.meta[language.value.targetIndex].props.slice(2);
    });
    const template = computed(() => {
      return store.getters.template_findOne((e) => e.cid === params.value.tid);
    });
    const language = computed<{
      items: BCMSLanguage[];
      target: BCMSLanguage;
      targetIndex: number;
    }>(() => {
      const langs = store.getters.language_items;
      let langIndex = langs.findIndex((e) => e.code === activeLanguage.value);
      if (langIndex === -1) {
        return {
          items: langs,
          target: {
            code: 'en',
            _id: '',
            name: 'en',
            updatedAt: 0,
            createdAt: 0,
            userId: '',
            def: false,
            nativeName: 'en',
          },
          targetIndex: 0,
        };
      }
      return { items: langs, target: langs[langIndex], targetIndex: langIndex };
    });
    const changes = ref(false);
    let editor: Editor | undefined;
    let idBuffer = '';
    const routerBeforeEachUnsub = router.beforeEach((_, __, next) => {
      if (checkForChanges()) {
        window.bcms
          .confirm(
            translations.value.page.entry.confirm.pageLeave.title,
            translations.value.page.entry.confirm.pageLeave.description
          )
          .then((result) => {
            if (result) {
              next();
            } else {
              next(route.path);
            }
          });
      } else {
        next();
      }
    });

    const entryUnsub = window.bcms.sdk.socket.subscribe(
      BCMSSocketEventName.TEMPLATE,
      async (event) => {
        if (entry.value) {
          const data = event as BCMSSocketTemplateEvent;
          if (data.tm === entry.value.templateId) {
            await init();
          }
        }
      }
    );
    // const storeEntryUnsub = store.subscribe(async (mutation) => {
    //   if (mutation.type === BCMSStoreMutationTypes.entry_set) {
    //     await init();
    //   }
    // })

    onMounted(async () => {
      window.onbeforeunload = beforeWindowUnload;
      idBuffer = params.value.tid + params.value.eid;
      await init();
    });
    onBeforeUpdate(async () => {
      const id = params.value.tid + params.value.eid;
      if (idBuffer !== id) {
        idBuffer = id;
        await init();
      }
    });
    onUnmounted(() => {
      entryUnsub();
      window.onbeforeunload = () => {
        // ...
      };
      if (routerBeforeEachUnsub) {
        routerBeforeEachUnsub();
      }
    });

    function beforeWindowUnload() {
      if (checkForChanges()) {
        return translations.value.page.entry.didYouSave;
      }
    }
    async function init() {
      window.bcms.meta.set({
        title: `${
          params.value.eid === 'create'
            ? translations.value.page.entry.meta.createTitle
            : translations.value.page.entry.meta.updateTitle
        }`,
      });
      if (!template.value) {
        await throwable(
          async () => {
            return await window.bcms.sdk.template.get(
              params.value.tid as string
            );
          },
          undefined,
          async (error) => {
            const err = error as { status: number };
            if (err.status === 404) {
              await router.push({ path: '/', replace: true });
            }
          }
        );
      }
      if (language.value.items.length === 0) {
        await throwable(async () => {
          return await window.bcms.sdk.language.getAll();
        });
      }
      let langCode = window.bcms.sdk.storage.get('lang');
      const lng = language.value.items.find((e) => e.code === langCode);
      if (
        (!langCode && language.value.items.length > 0) ||
        (language.value.items.length > 0 && !lng)
      ) {
        langCode = language.value.items[0].code;
        window.bcms.sdk.storage.set('lang', langCode);
      }
      activeLanguage.value = langCode;
      if (!template.value) {
        window.bcms.notification.error(
          translations.value.page.entry.notification.emptyTemplate
        );
        return;
      }
      if (params.value.eid === 'create') {
        const entryInstance = await window.bcms.entry.toExtended({
          template: template.value,
        });
        if (entryInstance) {
          entry.value = entryInstance;
        }
      } else {
        let ent: BCMSEntry | undefined = undefined;
        if (params.value.eid === 'single') {
          await window.bcms.util.throwable(
            async () => {
              const temp = await window.bcms.sdk.template.get(params.value.tid);
              if (temp) {
                const targets = await window.bcms.sdk.entry.getAllLite({
                  templateId: temp._id,
                });
                if (targets.length > 0) {
                  return await window.bcms.sdk.entry.get({
                    templateId: targets[0].templateId,
                    entryId: targets[0]._id,
                  });
                }
              }
            },
            async (result) => {
              ent = result;
            }
          );
        } else {
          ent = store.getters.entry_findOne((e) => e._id === params.value.eid);
        }
        if (ent) {
          const entryInstance = await window.bcms.entry.toExtended({
            template: template.value,
            entry: ent,
          });
          if (entryInstance) {
            entry.value = entryInstance;
          }
        } else {
          await throwable(
            async () => {
              return await window.bcms.sdk.entry.get({
                templateId: params.value.tid as string,
                entryId: params.value.eid as string,
              });
            },
            async (result) => {
              const entryInstance = await window.bcms.entry.toExtended({
                template: template.value as BCMSTemplate,
                entry: result,
              });
              if (entryInstance) {
                entry.value = entryInstance;
              }
              if (language.value) {
                window.bcms.meta.set({
                  title: (result.meta[0].props[0].data as string[])[0],
                });
              }
            },
            async (error) => {
              const err = error as { status: number };
              if (err.status === 404) {
                const pathParts = window.location.pathname.split('/');
                await router.push({
                  path:
                    pathParts.slice(0, pathParts.length - 1).join('/') +
                    '/create',
                  replace: true,
                });
              }
            }
          );
        }
      }
      for (let i = 0; i < language.value.items.length; i++) {
        const l = language.value.items[i];
        const meta = entry.value?.meta.find((e) => e.lng === l.code);
        doNotAutoFillSlug.value[l.code] = !!(
          meta?.props[1].data as string[]
        )[0];
      }
      spinner.value.show = false;
    }
    function checkForChanges(): boolean {
      return changes.value;
    }
    function selectLanguage(id: string) {
      const newLngIndex = language.value.items.findIndex((e) => e._id === id);
      if (newLngIndex !== -1) {
        const newLng = language.value.items[newLngIndex];
        const activeLngIndex = language.value.items.findIndex(
          (e) => e.code === activeLanguage.value
        );
        if (entry.value && activeLngIndex !== -1) {
          entry.value.content[activeLngIndex].nodes = (
            editor as Editor
          ).getJSON().content as JSONContent[];
        }
        activeLanguage.value = newLng.code;
        window.bcms.sdk.storage.set('lang', newLng.code);
      }
    }
    function handlerTitleInput(value: string) {
      changes.value = true;
      if (!entry.value || !language.value) {
        return;
      }
      (
        entry.value.meta[language.value.targetIndex].props[0].data as string[]
      )[0] = value;
      if (!doNotAutoFillSlug.value[language.value.target.code]) {
        (
          entry.value.meta[language.value.targetIndex].props[1].data as string[]
        )[0] = window.bcms.util.string.toSlug(value);
      }
      window.bcms.meta.set({ title: value });
    }
    function handleSlugInput(event: Event) {
      changes.value = true;
      if (!entry.value || !language.value) {
        return;
      }
      const element = event.target as HTMLInputElement;
      (
        entry.value.meta[language.value.targetIndex].props[1].data as string[]
      )[0] = window.bcms.util.string.toSlug(element.value);
      doNotAutoFillSlug.value[language.value.target.code] = true;
    }
    async function save() {
      if (!window.bcms.prop.checker.validate()) {
        window.bcms.notification.warning(
          translations.value.page.entry.notification.entryErrors
        );
        return;
      }
      spinner.value.message =
        translations.value.page.entry.spinner.savingMessage;
      spinner.value.show = true;
      const ent = entry.value as BCMSEntryExtended;
      ent.content[language.value.targetIndex].nodes = (
        (editor as Editor).getJSON().content as JSONContent[]
      ).map((e) => {
        if (
          e.type === 'widget' &&
          typeof (e.attrs as any).widget === 'string'
        ) {
          (e.attrs as any).widget = JSON.parse((e.attrs as any).widget);
          (e.attrs as any).content = JSON.parse((e.attrs as any).content);
        }
        return e;
      });
      const normalEntry = window.bcms.entry.fromExtended({
        extended: ent,
      });
      await throwable(
        async () => {
          return await window.bcms.sdk.entry.create({
            templateId: normalEntry.templateId,
            meta: normalEntry.meta,
            content: normalEntry.content,
            status: normalEntry.status,
          });
        },
        async (result) => {
          window.bcms.notification.success(
            translations.value.page.entry.notification.entrySaveSuccess
          );
          if (routerBeforeEachUnsub) {
            routerBeforeEachUnsub();
          }
          changes.value = false;
          await router.push({
            path: route.path.replace('/create', `/${result.cid}`),
            replace: true,
          });
        }
      );
      spinner.value.show = false;
    }
    async function update() {
      if (!window.bcms.prop.checker.validate()) {
        window.bcms.notification.warning(
          translations.value.page.entry.notification.entryErrors
        );
        return;
      }
      spinner.value.message =
        translations.value.page.entry.spinner.savingMessage;
      spinner.value.show = true;
      const ent = entry.value as BCMSEntryExtended;
      ent.content[language.value.targetIndex].nodes = (
        (editor as Editor).getJSON().content as JSONContent[]
      ).map((e) => {
        if (
          e.type === 'widget' &&
          typeof (e.attrs as any).widget === 'string'
        ) {
          (e.attrs as any).widget = JSON.parse((e.attrs as any).widget);
          (e.attrs as any).content = JSON.parse((e.attrs as any).content);
        }
        return e;
      });
      const normalEntry = window.bcms.entry.fromExtended({
        extended: ent,
      });

      await throwable(
        async () => {
          return await window.bcms.sdk.entry.update({
            _id: ent._id,
            templateId: normalEntry.templateId,
            meta: normalEntry.meta,
            content: normalEntry.content,
            status: normalEntry.status,
          });
        },
        async () => {
          window.bcms.notification.success(
            translations.value.page.entry.notification.entrySaveSuccess
          );
          changes.value = false;
          // await router.push({
          //   path: route.path.replace('/create', `/${result.cid}`),
          //   replace: true,
          // });
        }
      );
      spinner.value.show = false;
    }

    return () => (
      <div class="pt-6 pb-8 text-base z-100 desktop:pt-7 desktop:pb-12">
        {template.value &&
        entry.value &&
        metaProps.value &&
        language.value.target ? (
          <>
            <div class="flex items-center justify-end gap-2.5 mb-6 desktop:fixed desktop:z-200 desktop:top-7.5 desktop:right-15">
              {language.value.items.length > 1 ? (
                <BCMSSelect
                  cyTag="select-lang"
                  selected={language.value.target._id}
                  options={language.value.items.map((e) => {
                    return { label: `${e.name}`, value: e._id };
                  })}
                  onChange={(options) => {
                    if (options.value) {
                      selectLanguage(options.value);
                    }
                  }}
                />
              ) : (
                ''
              )}
              <BCMSEntryStatus
                selected={entry.value ? entry.value.status : ''}
                onChange={(statusId) => {
                  if (entry.value) {
                    changes.value = true;
                    entry.value.status = statusId;
                  }
                }}
              />
              <BCMSButton
                cyTag="add-update"
                kind="primary"
                disabled={!changes.value}
                onClick={async () => {
                  if (params.value.eid === 'create') {
                    await save();
                  } else {
                    await update();
                  }
                }}
              >
                {params.value.eid === 'create'
                  ? translations.value.page.entry.actions.save
                  : translations.value.page.entry.actions.update}
              </BCMSButton>
            </div>
            <div class="max-w-full w-full desktop:max-w-150">
              {template.value.desc ? (
                <div class="entryEditor--instructions mb-5 select-none">
                  <button
                    v-cy={'instructions-toggle'}
                    class="mt-6 text-xs leading-normal tracking-0.06 uppercase text-dark flex items-start gap-2 desktop:mt-0"
                    onClick={() => {
                      showInstructions.value = !showInstructions.value;
                    }}
                  >
                    <span>{translations.value.page.entry.instructions}</span>
                    <div
                      class={
                        showInstructions.value
                          ? 'transform mt-0.5 ml-0.5 rotate-90'
                          : ''
                      }
                    >
                      <BCMSIcon
                        src="/caret/right"
                        class="w-1 mt-1 h-auto relative text-dark fill-current"
                      />
                    </div>
                  </button>
                  {showInstructions.value ? (
                    <BCMSMarkdownDisplay
                      markdown={template.value.desc}
                      class="p-0 mt-2.5 text-grey -tracking-0.03 leading-tight border-none"
                    />
                  ) : (
                    ''
                  )}
                </div>
              ) : (
                ''
              )}
              <div
                v-cy={'meta'}
                class="bg-white bg-opacity-50 border border-grey border-opacity-20 rounded-3.5 py-6 px-2.5 select-none sm:px-5"
              >
                <div class="mb-4">
                  <BCMSMetaTitle
                    label={translations.value.page.entry.input.title.label}
                    value={
                      (
                        entry.value.meta[language.value.targetIndex].props[0]
                          .data as string[]
                      )[0] as string
                    }
                    placeholder={translations.value.page.entry.input.title.placeholder(
                      {
                        label: template.value.label,
                      }
                    )}
                    onInput={(value) => {
                      handlerTitleInput(value);
                    }}
                  />
                </div>
                <div
                  class={`${
                    entry.value.meta[language.value.targetIndex].props.length >
                    2
                      ? 'mb-11'
                      : ''
                  }`}
                >
                  <div class="mt-4 flex-nowrap">
                    <label class="rounded-4.5 border border-grey bg-white px-4.5 flex  items-center overflow-hidden transition-all duration-300 hover:border-opacity-50 outline-none hover:outline-none hover:shadow-input focus-within:border-opacity-50 focus-within:shadow-input">
                      <span class="leading-tight text-dark p-0 m-0 border-0 outline-none placeholder-dark placeholder-opacity-60">
                        /
                      </span>
                      <input
                        v-cy={'slug'}
                        id="slug"
                        value={
                          (
                            entry.value.meta[language.value.targetIndex]
                              .props[1].data as string[]
                          )[0]
                        }
                        placeholder={
                          translations.value.page.entry.input.slug.placeholder
                        }
                        onChange={handleSlugInput}
                        onKeyup={handleSlugInput}
                        class="flex-grow py-2 leading-tight outline-none placeholder-dark placeholder-opacity-60"
                      />
                    </label>
                  </div>
                </div>
                {entry.value.meta[language.value.targetIndex].props.length >
                2 ? (
                  <BCMSPropEditor
                    props={metaProps.value}
                    onUpdate={(data) => {
                      if (entry.value && language.value) {
                        changes.value = true;
                        entry.value.meta[language.value.targetIndex].props[
                          data.propIndex + 2
                        ] = data.prop;
                      }
                    }}
                  />
                ) : (
                  ''
                )}
              </div>
              <div v-cy={'content'} class="pt-16">
                <BCMSContentEditor
                  id={entry.value._id}
                  content={entry.value.content[language.value.targetIndex]}
                  onEditorReady={(edtr) => {
                    editor = edtr;
                    editor.on('update', () => {
                      changes.value = true;
                    });
                  }}
                />
              </div>
            </div>
          </>
        ) : (
          ''
        )}
        <BCMSSpinner
          show={spinner.value.show}
          message={spinner.value.message}
        />
      </div>
    );
  },
});
export default component;
</script>
