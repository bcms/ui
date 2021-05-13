<script lang="tsx">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { MutationTypes, useStore } from '../../../../../store';
import { useRoute } from 'vue-router';
import { BCMSEntryModified } from '../../../../../types';
import {
  BCMSSpinner,
  BCMSSelect,
  BCMSEntryStatus,
  BCMSButton,
  BCMSMarkdownDisplay,
  BCMSTextInput,
} from '../../../../../components';

const component = defineComponent({
  setup() {
    const store = useStore();
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
    const contentChanges = ref(false);
    const showInstructions = ref(false);
    const doNotAutoFillSlug = ref<{ [lngCode: string]: boolean }>({});

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
            store.commit(MutationTypes.template_set, result);
          }
        );
      }
      if (languages.value.length === 0) {
        await window.bcms.services.error.wrapper(
          async () => {
            return await window.bcms.sdk.language.getAll();
          },
          async (result) => {
            store.commit(MutationTypes.language_set, result);
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
              store.commit(MutationTypes.entry_set, result);
              entry.value = window.bcms.services.entry.toModified(result);
            }
          );
        }
      }
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

    return () => (
      <div class="entryEditor">
        {template.value && entry.value && language.value ? (
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
                onClick={() => {
                  if (route.params.eid === 'create') {
                    // TODO
                    // addEntry();
                  } else {
                    // TODO
                    // updateEntry();
                  }
                }}
              >
                {route.params.eid === 'create' ? 'Save' : 'Update'}
              </BCMSButton>
            </div>
            <div class="entryEditor--body">
              <div class="entryEditor--instructions">
                {template.value.desc ? (
                  <>
                    <button
                      v-cy={'instructions-toggle'}
                      class="entryEditor--instructions-title {showInstructions ? 'is-active' : ''}"
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
                  </>
                ) : (
                  ''
                )}
              </div>
              <div v-cy={'meta'} class="entryEditor--meta">
                <div class="entryEditor--meta-row">
                  <label class="entryEditor--meta-title" for="title">
                    <span>Title:</span>
                    <BCMSTextInput
                      value={
                        (
                          entry.value.meta[language.value.code][0]
                            .value as string[]
                        )[0] as string
                      }
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
                {entry.value.meta[language.value.code].length > 2 ? '' : ''}
              </div>
            </div>
          </>
        ) : (
          <BCMSSpinner show={true} message="Loading entry..." />
        )}
      </div>
    );
  },
});
export default component;
</script>
