<script lang="tsx">
import { BCMSLanguage, BCMSTemplate } from '@becomes/cms-sdk/types';
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
} from '@vue/runtime-core';
import { useThrowable } from '../../../../../util';
import {
  BCMSSpinner,
  BCMSSelect,
  BCMSButton,
  BCMSEntryStatus,
  BCMSMarkdownDisplay,
  BCMSTextAreaInput,
  BCMSPropEditor,
  BCMSContentEditor,
} from '../../../../../components';
import { BCMSEntryExtended } from '../../../../../types';
import { Editor } from '@tiptap/core';

const component = defineComponent({
  setup() {
    const throwable = useThrowable();
    const store = window.bcms.sdk.store;
    const route = window.bcms.vue.useRoute();
    const router = window.bcms.vue.useRouter();
    const activeLanguage = ref(window.bcms.sdk.storage.get('lang'));
    const entry = ref<BCMSEntryExtended>();
    const showInstructions = ref(false);
    const doNotAutoFillSlug = ref<{ [lngCode: string]: boolean }>({});
    const spinner = ref({
      message: 'Loading entry...',
      show: true,
    });
    const metaProps = computed(() => {
      if (!entry.value || !language.value.target) {
        return [];
      }
      return entry.value.meta[language.value.targetIndex].props.slice(2);
    });
    const template = computed(() => {
      return store.getters.template_findOne((e) => e.cid === route.params.tid);
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
    let editor: Editor | undefined;

    const routerBeforeEachUnsub = router.beforeEach((_, __, next) => {
      if (checkForChanges()) {
        window.bcms
          .confirm(
            'Leaving the page',
            'Are you sure you want to leave this page?' +
              ' You have unsaved progress which will be lost.'
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

    onMounted(async () => {
      window.bcms.meta.set({
        title: `${route.params.eid === 'create' ? 'Create' : 'Update'} Entry`,
      });
      if (!template.value) {
        await throwable(async () => {
          return await window.bcms.sdk.template.get(route.params.tid as string);
        });
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
        window.bcms.notification.error('Template does not exist.');
        return;
      }
      if (route.params.eid === 'create') {
        const entryInstance = await window.bcms.entry.toExtended({
          template: template.value,
        });
        if (entryInstance) {
          entry.value = entryInstance;
        }
      } else {
        const ent = store.getters.entry_findOne(
          (e) => e._id === route.params.eid
        );
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
                templateId: route.params.tid as string,
                entryId: route.params.eid as string,
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
            }
          );
        }
      }
      spinner.value.show = false;
    });
    onUnmounted(() => {
      routerBeforeEachUnsub();
    });

    function checkForChanges(): boolean {
      return false;
    }
    function selectLanguage(id: string) {
      const lng = language.value.items.find((e) => e._id === id);
      if (lng) {
        activeLanguage.value = lng.code;
        window.bcms.sdk.storage.set('lang', lng.code);
      }
    }
    function handlerTitleInput(value: string) {
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
          'Entry contains one or more errors. Please fix them and try again.'
        );
        return;
      }
      spinner.value.message = 'We are saving your entry, please wait...';
      spinner.value.show = true;
      const ent = entry.value as BCMSEntryExtended;
      ent.content[0].nodes = (editor as Editor).getJSON().content;
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
          window.bcms.notification.success('Entry saved successfully.');
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
          'Entry contains one or more errors. Please fix them and try again.'
        );
        return;
      }
      spinner.value.message = 'We are saving your entry, please wait...';
      spinner.value.show = true;
      const ent = entry.value as BCMSEntryExtended;
      ent.content[0].nodes = (editor as Editor).getJSON().content;
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
        async (result) => {
          window.bcms.notification.success('Entry saved successfully.');
          await router.push({
            path: route.path.replace('/create', `/${result.cid}`),
            replace: true,
          });
        }
      );
      spinner.value.show = false;
    }

    return () => (
      <div class="entryEditor">
        {template.value &&
        entry.value &&
        metaProps.value &&
        language.value.target ? (
          <>
            <div class="entryEditor--header">
              {language.value.items.length > 1 ? (
                <BCMSSelect
                  class="_bcmsInput--select_lang"
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
                    entry.value.status = statusId;
                  }
                }}
              />
              <BCMSButton
                cyTag="add-update"
                kind="primary"
                onClick={async () => {
                  if (route.params.eid === 'create') {
                    await save();
                  } else {
                    await update();
                  }
                }}
              >
                {route.params.eid === 'create' ? 'Save' : 'Update'}
              </BCMSButton>
            </div>
            <div class="entryEditor--body">
              {template.value.desc ? (
                <div class="entryEditor--instructions">
                  <button
                    v-cy={'instructions-toggle'}
                    class="entryEditor--instructions-title"
                    onClick={() => {
                      showInstructions.value = !showInstructions.value;
                    }}
                  >
                    Instructions
                  </button>
                  {showInstructions.value ? (
                    <BCMSMarkdownDisplay markdown={template.value.desc} />
                  ) : (
                    ''
                  )}
                </div>
              ) : (
                ''
              )}
              <div v-cy={'meta'} class="entryEditor--meta">
                <div class="entryEditor--meta-row">
                  <label class="entryEditor--meta-title" for="title">
                    <span>Title:</span>
                    <BCMSTextAreaInput
                      value={
                        (
                          entry.value.meta[language.value.targetIndex].props[0]
                            .data as string[]
                        )[0] as string
                      }
                      format={(value) => {
                        return value.replace(/\n/g, ' ');
                      }}
                      placeholder={`Title for ${template.value.label} entity`}
                      onInput={(value) => {
                        handlerTitleInput(value);
                      }}
                    />
                  </label>
                </div>
                <div class="entryEditor--meta-row entryEditor--meta-row_slug">
                  <div class="entryEditor--meta-slug">
                    <label>
                      <span>/</span>
                      <input
                        v-cy={'slug'}
                        id="slug"
                        value={
                          (
                            entry.value.meta[language.value.targetIndex]
                              .props[1].data as string[]
                          )[0]
                        }
                        placeholder="slug"
                        onChange={handleSlugInput}
                        onKeyup={handleSlugInput}
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
              <div v-cy={'content'} class="entryEditor--content">
                <BCMSContentEditor
                  content={entry.value.content[language.value.targetIndex]}
                  onEditorReady={(edtr) => {
                    editor = edtr;
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
