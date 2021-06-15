<script lang="tsx">
import { computed, defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { useStore } from '../../../../../store';
import { useRoute, useRouter } from 'vue-router';
import {
  BCMSEntryModified,
  BCMSStoreMutationTypes,
} from '../../../../../types';
import {
  BCMSButton,
  BCMSEntryStatus,
  BCMSMarkdownDisplay,
  BCMSPropsEditor,
  BCMSSelect,
  BCMSSpinner,
  BCMSTextAreaInput,
} from '../../../../../components';

const component = defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const template = computed(() => {
      return store.getters.template_findOne((e) => e._id === route.params.tid);
    });
    const languages = computed(() => {
      return store.getters.language_items;
    });
    const activeLanguage = ref(window.bcms.sdk.services.storage.get('lang'));
    const language = computed(() => {
      return store.getters.language_findOne(
        (e) => e.code === activeLanguage.value
      );
    });
    const entry = ref<BCMSEntryModified>();
    const metaProps = computed(() => {
      if (!entry.value || !language.value) {
        return undefined;
      }
      return entry.value.meta[language.value.code].slice(2);
    });
    const contentChanges = ref(false);
    const showInstructions = ref(false);
    const doNotAutoFillSlug = ref<{ [lngCode: string]: boolean }>({});
    const spinner = ref({
      message: 'Loading entry...',
      show: true,
    });

    const routerBeforeEachUnsub = router.beforeEach((_, __, next) => {
      if (contentChanges.value) {
        window.bcms.services
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
      window.bcms.services.headMeta.set({
        title: `${route.params.eid === 'create' ? 'Create' : 'Update'} Entry`,
      });
      if (!template.value) {
        await window.bcms.services.error.wrapper(
          async () => {
            return await window.bcms.sdk.template.get(
              route.params.tid as string
            );
          },
          async (result) => {
            store.commit(BCMSStoreMutationTypes.template_set, result);
          }
        );
      }
      if (languages.value.length === 0) {
        await window.bcms.services.error.wrapper(
          async () => {
            return await window.bcms.sdk.language.getAll();
          },
          async (result) => {
            store.commit(BCMSStoreMutationTypes.language_set, result);
          }
        );
      }
      let langCode = window.bcms.sdk.services.storage.get('lang');
      const lng = languages.value.find((e) => e.code === langCode);
      if (
        (!langCode && languages.value.length > 0) ||
        (languages.value.length > 0 && !lng)
      ) {
        langCode = languages.value[0].code;
        window.bcms.sdk.services.storage.set('lang', langCode);
      }
      activeLanguage.value = langCode;
      if (!template.value) {
        window.bcms.services.notification.error('Template does not exist.');
        return;
      }
      if (route.params.eid === 'create') {
        entry.value = window.bcms.services.entry.instanceModified(
          languages.value,
          template.value.props
        );
      } else {
        const ent = store.getters.entry_findOne(
          (e) => e._id === route.params.eid
        );
        if (ent) {
          entry.value = window.bcms.services.entry.toModified(ent);
        } else {
          await window.bcms.services.error.wrapper(
            async () => {
              return await window.bcms.sdk.entry.get(
                route.params.tid as string,
                route.params.eid as string
              );
            },
            async (result) => {
              store.commit(BCMSStoreMutationTypes.entry_set, result);
              entry.value = window.bcms.services.entry.toModified(result);
              if (language.value) {
                window.bcms.services.headMeta.set({
                  title: (result.meta[0].props[0].value as string[])[0],
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

    function selectLanguage(id: string) {
      const lng = languages.value.find((e) => e._id === id);
      if (lng) {
        activeLanguage.value = lng.code;
        window.bcms.sdk.services.storage.set('lang', lng.code);
      }
    }
    function handlerTitleInput(value: string) {
      if (!entry.value || !language.value) {
        return;
      }
      contentChanges.value = true;
      (entry.value.meta[language.value.code][0].value as string[])[0] = value;
      if (!doNotAutoFillSlug.value[language.value.code]) {
        (entry.value.meta[language.value.code][1].value as string[])[0] =
          window.bcms.services.general.string.toUri(value);
      }
      window.bcms.services.headMeta.set({ title: value });
    }
    function handleSlugInput(event: Event) {
      if (!entry.value || !language.value) {
        return;
      }
      contentChanges.value = true;
      const element = event.target as HTMLInputElement;
      (entry.value.meta[language.value.code][1].value as string[])[0] =
        window.bcms.services.general.string.toUri(element.value);
      doNotAutoFillSlug.value[language.value.code] = true;
    }
    async function save() {
      if (!window.bcms.services.propsChecker.check()) {
        window.bcms.services.notification.warning(
          'Entry contains one or more errors. Please fix them and try again.'
        );
        return;
      }
      spinner.value.message = 'We are saving your entry, please wait...';
      spinner.value.show = true;

      const ent = window.bcms.services.entry.fromModified(
        entry.value as BCMSEntryModified
      );
      await window.bcms.services.error.wrapper(
        async () => {
          return await window.bcms.sdk.entry.create({
            templateId: template.value ? template.value._id : '',
            status: ent.status,
            meta: ent.meta,
            content: ent.content,
          });
        },
        async (result) => {
          store.commit(BCMSStoreMutationTypes.entry_set, result);
          window.bcms.services.notification.success(
            'Entry saved successfully.'
          );
          contentChanges.value = false;
          await router.push(route.path.replace('/create', `/${result._id}`));
        }
      );

      spinner.value.show = false;
    }
    async function update() {
      if (!window.bcms.services.propsChecker.check()) {
        window.bcms.services.notification.warning(
          'Entry contains one or more errors. Please fix them and try again.'
        );
        return;
      }
      spinner.value.message = 'We are updating your entry, please wait...';
      spinner.value.show = true;

      const ent = window.bcms.services.entry.fromModified(
        entry.value as BCMSEntryModified
      );
      await window.bcms.services.error.wrapper(
        async () => {
          return await window.bcms.sdk.entry.update({
            _id: ent._id,
            templateId: template.value ? template.value._id : '',
            content: ent.content,
            meta: ent.meta,
            status: ent.status,
          });
        },
        async (result) => {
          store.commit(BCMSStoreMutationTypes.entry_set, result);
          window.bcms.services.notification.success(
            'Entry updated successfully.'
          );
          contentChanges.value = false;
        }
      );

      spinner.value.show = false;
    }

    return () => (
      <div class="entryEditor">
        {template.value && entry.value && metaProps.value && language.value ? (
          <>
            <div class="entryEditor--header">
              {languages.value.length > 1 ? (
                <BCMSSelect
                  class="_bcmsInput--select_lang"
                  cyTag="select-lang"
                  selected={language.value._id}
                  options={languages.value.map((e) => {
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
                disabled={!contentChanges.value}
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
                          entry.value.meta[language.value.code][0]
                            .value as string[]
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
                            entry.value.meta[language.value.code][1]
                              .value as string[]
                          )[0]
                        }
                        placeholder="slug"
                        onChange={handleSlugInput}
                        onKeyup={handleSlugInput}
                      />
                    </label>
                  </div>
                </div>
                {entry.value.meta[language.value.code].length > 2 ? (
                  <BCMSPropsEditor
                    props={metaProps.value}
                    onUpdate={(data) => {
                      if (entry.value && language.value) {
                        entry.value.meta[language.value.code][
                          data.propIndex + 2
                        ] = data.prop;
                        contentChanges.value = true;
                      }
                    }}
                  />
                ) : (
                  ''
                )}
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
