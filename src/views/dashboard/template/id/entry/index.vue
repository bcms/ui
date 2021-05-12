<script lang="tsx">
import { computed, defineComponent, onBeforeUpdate, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { BCMSTemplate, BCMSLanguage } from '@becomes/cms-sdk/types';
import { MutationTypes, useStore } from '../../../../../store';
import {
  BCMSEntryFilter,
  BCMSSpinner,
  BCMSSelect,
  BCMSLink,
  BCMSIcon,
  BCMSOverflowMenu,
  BCMSOverflowMenuItem,
} from '../../../../../components';
import type {
  BCMSEntryFilters,
  BCMSEntryLiteModified,
} from '../../../../../types';

const component = defineComponent({
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const template = computed(() => {
      const tmp = store.getters.template_findOne(
        (e) => e._id === route.params.tid
      );
      if (tmp) {
        window.bcms.services.headMeta.set({ title: tmp.label });
      }
      return tmp;
    });
    const entriesLite = computed(() => {
      if (!template.value) {
        return [];
      }
      const output = store.getters.entryLite_find(
        (e) => e.templateId === template.value?._id
      );
      return output.map((e) => window.bcms.services.entry.toLiteModified(e));
    });
    const filters = ref<BCMSEntryFilters>();
    const entriesInView = computed(() => {
      let output = entriesLite.value;
      if (filters.value) {
        const fltr = filters.value as BCMSEntryFilters;
        if (fltr.search.name) {
          output = output.filter((item) => {
            return `${item._id} ${
              (item.meta[language.value.code][0].value as string[])[0]
            }`
              .toLowerCase()
              .includes(fltr.search.name.trim().toLowerCase());
          });
        }
      }
      return output;
    });
    const activeLanguage = ref(window.bcms.sdk.services.storage.get('lang'));
    const language = computed<BCMSLanguage>(() => {
      const lng = store.getters.language_findOne(
        (e) => e.code === activeLanguage.value
      );
      if (!lng) {
        return {
          code: 'en',
          _id: '',
          name: 'en',
          updatedAt: 0,
          createdAt: 0,
          userId: '',
          def: false,
          nativeName: 'en',
        };
      }
      return lng;
    });
    const languages = computed(() => {
      return store.getters.language_items;
    });

    function selectLanguage(id: string) {
      const lng = languages.value.find((e) => e._id === id);
      if (lng) {
        activeLanguage.value = lng.code;
        window.bcms.sdk.services.storage.set('lang', language.value.code);
      }
    }
    function getEntryTitle(entryLite: BCMSEntryLiteModified): string {
      const title = (
        entryLite.meta[language.value.code][0].value as string[]
      )[0];
      if (title) {
        return title;
      }
      return 'No given title';
    }

    onMounted(async () => {
      if (!route.params.tid) {
        window.bcms.services.notification.error(
          'Selected template does not exist.'
        );
        await router.push({
          path: '/dashboard',
          replace: true,
        });
        return;
      }
      const langCode = window.bcms.sdk.services.storage.get('lang');
      let lng = languages.value.find((e) => e.code === langCode);
      if (!lng) {
        await window.bcms.services.error.wrapper(
          async () => {
            return await window.bcms.sdk.language.getAll();
          },
          async (result) => {
            if (!langCode && result.length > 0) {
              window.bcms.sdk.services.storage.set('lang', result[0].code);
            }
            lng = languages.value.find((e) => e.code === langCode);
            if (lng) {
              activeLanguage.value = lng.code;
            }
            store.commit(MutationTypes.language_set, result);
          }
        );
      }
      if (!template.value) {
        window.bcms.services.headMeta.set({ title: 'Entries' });
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
      if (entriesLite.value.length === 0 && template.value) {
        const tmp = template.value as BCMSTemplate;
        await window.bcms.services.error.wrapper(
          async () => {
            return await window.bcms.sdk.entry.getAllLite(tmp._id);
          },
          async (result) => {
            store.commit(MutationTypes.entryLite_set, result);
          }
        );
      }
    });
    onBeforeUpdate(async () => {
      if (entriesLite.value.length === 0 && template.value) {
        const tmp = template.value as BCMSTemplate;
        await window.bcms.services.error.wrapper(
          async () => {
            return await window.bcms.sdk.entry.getAllLite(tmp._id);
          },
          async (result) => {
            store.commit(MutationTypes.entryLite_set, result);
          }
        );
      }
    });

    return () => (
      <div class="view entryOverview">
        {template.value && language.value ? (
          <>
            <BCMSEntryFilter
              template={template.value}
              entryCount={entriesInView.value.length}
              onFilter={(eventFilters) => {
                filters.value = eventFilters;
              }}
              onAddEntry={() => {
                router.push(route.path + '/create');
              }}
            />
            <div class="view--content">
              {entriesInView.value.length > 0 && language.value ? (
                <>
                  {languages.value.length > 1 ? (
                    <BCMSSelect
                      cyTag="select-lang"
                      label="Select language"
                      selected={language.value._id}
                      options={languages.value.map((e) => {
                        return { label: `${e.name}`, value: e._id };
                      })}
                      onChange={(option) => {
                        selectLanguage(option.value);
                      }}
                    />
                  ) : (
                    ''
                  )}
                  <ul v-cy={'entries-list'} class="entryOverview--entries">
                    <li class="entryOverview--entries-item entryOverview--cols">
                      <div class="entryOverview--entries-createdAt">
                        <span>Created At</span>
                      </div>
                      <div class="entryOverview--entries-updatedAt">
                        <span>Updated At</span>
                      </div>
                      <div class="entryOverview--entries-title">
                        <span>Title</span>
                      </div>
                    </li>
                    {entriesInView.value.map((entryLite, entryLiteIndex) => {
                      const tmp = template.value as BCMSTemplate;
                      return (
                        <li
                          v-cy={`item-${entryLiteIndex}`}
                          class="entryOverview--entries-item entryOverview--cols"
                        >
                          <div
                            class="entryOverview--entries-item-col entryOverview--entries-createdAt"
                            data-column-name="Created At"
                            title={window.bcms.services.general.date.prettyElapsedTimeSince(
                              entryLite.createdAt
                            )}
                          >
                            <span>
                              {window.bcms.services.general.date.prettyElapsedTimeSince(
                                entryLite.createdAt
                              )}
                            </span>
                          </div>
                          <div
                            class="entryOverview--entries-item-col entryOverview--entries-createdAt"
                            data-column-name="Updated At"
                            title={window.bcms.services.general.date.prettyElapsedTimeSince(
                              entryLite.updatedAt
                            )}
                          >
                            <span>
                              {window.bcms.services.general.date.prettyElapsedTimeSince(
                                entryLite.updatedAt
                              )}
                            </span>
                          </div>
                          <div
                            class="entryOverview--entries-item-col entryOverview--entries-title"
                            data-column-name="Title"
                            title={getEntryTitle(entryLite)}
                          >
                            <span>{getEntryTitle(entryLite)}</span>
                          </div>
                          <div class="entryOverview--entries-actions">
                            <BCMSLink
                              cyTag="edit"
                              href={`/dashboard/template/${tmp._id}/entry/${entryLite._id}`}
                              class="entryOverview--entries-actions-edit bcmsButton bcmsButton_alternate bcmsButton_m"
                            >
                              <BCMSIcon class="bcmsButton--icon" src="/edit" />
                              <span>Edit</span>
                            </BCMSLink>
                            <BCMSOverflowMenu cyTag="overflow" position="right">
                              <BCMSOverflowMenuItem
                                cyTag="view-model"
                                text="View model"
                                icon="view-model"
                                onClick={() => {
                                  window.bcms.services.modal.entry.viewModel.show(
                                    {
                                      templateId: entryLite.templateId,
                                      entryId: entryLite._id,
                                    }
                                  );
                                }}
                              />
                              <BCMSOverflowMenuItem
                                cyTag="remove"
                                text="Remove"
                                icon="trash"
                                onClick={() => {
                                  // removeEntry(entryLiteModified._id);
                                }}
                              />
                            </BCMSOverflowMenu>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </>
              ) : (
                <div>
                  <h3 class="entryOverview--entries_empty">
                    There are no entries available.
                  </h3>
                </div>
              )}
            </div>
          </>
        ) : (
          <BCMSSpinner show={true} message="Loading content..." />
        )}
      </div>
    );
  },
});
export default component;
</script>
