<script lang="tsx">
import { computed, defineComponent, onBeforeUpdate, onMounted, ref } from 'vue';
import {
  BCMSTemplate,
  BCMSLanguage,
  BCMSEntryLite,
  BCMSEntry,
  BCMSUserPolicyTemplate,
  BCMSJwtRoleName,
} from '@becomes/cms-sdk/types';
import {
  BCMSSpinner,
  BCMSEntryFilter,
  BCMSEntryTable,
} from '../../../../../components';
import { BCMSEntryFilters } from '../../../../../types';
import { useRoute, useRouter } from 'vue-router';

const component = defineComponent({
  setup() {
    const throwable = window.bcms.util.throwable;
    const router = useRouter();
    const route = useRoute();
    const store = window.bcms.vue.store;
    const filters = ref<BCMSEntryFilters>();
    const activeLanguage = ref(window.bcms.sdk.storage.get('lang'));
    const params = computed(() => route.params as { tid: string });
    const language = computed<{
      items: BCMSLanguage[];
      target: BCMSLanguage;
      targetIndex: number;
    }>(() => {
      const langs = store.getters.language_items;
      let langIndex = langs.findIndex((e) => e.code === activeLanguage.value);
      if (langIndex === -1) {
        if (langs[0]) {
          return {
            items: langs,
            target: langs[0],
            targetIndex: 0,
          };
        }
      }
      return { items: langs, target: langs[langIndex], targetIndex: langIndex };
    });
    const template = computed(() => {
      const tmp = store.getters.template_findOne(
        (e) => e.cid === params.value.tid
      );
      if (tmp) {
        window.bcms.meta.set({ title: tmp.label + ' entries' });
      }
      return tmp;
    });
    const entriesLite = computed(() => {
      if (!template.value) {
        return [];
      }
      const output = store.getters.entryLite_find(
        (e) => e.templateId === (template.value as BCMSTemplate)._id
      );
      return output.sort((a, b) => b.createdAt - a.createdAt);
    });
    const entriesInView = computed(() => {
      let output = entriesLite.value;
      if (filters.value) {
        const fltr = filters.value as BCMSEntryFilters;
        if (fltr.search.name) {
          output = output.filter((item) => {
            if (item.meta[language.value.targetIndex]) {
              return `${item._id} ${
                (
                  item.meta[language.value.targetIndex].props[0]
                    .data as string[]
                )[0]
              }`
                .toLowerCase()
                .includes(fltr.search.name.trim().toLowerCase());
            }
          });
        }
        fltr.options.forEach((fltrOption) => {
          if (fltrOption.fromDate && fltrOption.fromDate.year !== -1) {
            output = output.filter((item) => {
              const date = new Date(item.createdAt);
              return (
                date.getFullYear() === fltrOption.fromDate?.year &&
                date.getMonth() + 1 === fltrOption.fromDate.month &&
                date.getDate() === fltrOption.fromDate.day
              );
            });
          }
          if (fltrOption.toDate && fltrOption.toDate.year !== -1) {
            output = output.filter((item) => {
              const date = new Date(item.createdAt);
              return (
                date.getFullYear() === fltrOption.toDate?.year &&
                date.getMonth() + 1 === fltrOption.toDate.month &&
                date.getDate() === fltrOption.toDate.day
              );
            });
          }
        });
      }
      return output;
    });
    const policy = computed<BCMSUserPolicyTemplate>(() => {
      const user = store.getters.user_me;
      if (user) {
        if (user.roles[0].name === BCMSJwtRoleName.ADMIN) {
          return {
            _id: template.value?._id || '',
            get: true,
            post: true,
            put: true,
            delete: true,
          };
        }
        const tPolicy = user.customPool.policy.templates.find(
          (e) => e._id === template.value?._id
        );
        if (tPolicy) {
          return tPolicy;
        }
      }
      return {
        _id: template.value?._id || '',
        get: false,
        post: false,
        put: false,
        delete: false,
      };
    });

    function selectLanguage(id: string) {
      const lng = language.value.items.find((e) => e._id === id);
      if (lng) {
        activeLanguage.value = lng.code;
        window.bcms.sdk.storage.set('lang', language.value.target.code);
      }
    }
    async function remove(entryLite: BCMSEntryLite) {
      if (
        await window.bcms.confirm(
          'Remove entry',
          `Are you sure you want to delete <strong>${
            (
              entryLite.meta[language.value.targetIndex].props[0]
                .data as string[]
            )[0]
          }</strong> entry? This action is permanent and irreversible!`
        )
      ) {
        await throwable(
          async () => {
            await window.bcms.sdk.entry.deleteById({
              templateId: entryLite.templateId,
              entryId: entryLite._id,
            });
          },
          async () => {
            window.bcms.notification.success(
              `Entry ${
                (
                  entryLite.meta[language.value.targetIndex].props[0]
                    .data as string[]
                )[0]
              } successfully removed.`
            );
          }
        );
      }
    }
    async function duplicateEntry(entryLite: BCMSEntryLite) {
      if (
        await window.bcms.confirm(
          'Duplicate',
          `Are you sure you want to duplicate <strong>${
            (
              entryLite.meta[language.value.targetIndex].props[0]
                .data as string[]
            )[0]
          }</strong>?`
        )
      ) {
        await throwable(
          async () => {
            const entry: BCMSEntry = JSON.parse(
              JSON.stringify(
                await window.bcms.sdk.entry.get({
                  templateId: entryLite.templateId,
                  entryId: entryLite._id,
                })
              )
            );
            for (let i = 0; i < entry.meta.length; i++) {
              (entry.meta[i].props[0].data as string[])[0] =
                'Copy of ' + (entry.meta[i].props[0].data as string[])[0];
              (entry.meta[i].props[1].data as string[])[0] =
                'copy-of-' + (entry.meta[i].props[1].data as string[])[0];
            }
            return await window.bcms.sdk.entry.create({
              templateId: entryLite.templateId,
              status: entry.status,
              meta: entry.meta,
              content: entry.content,
            });
          },
          async () => {
            window.bcms.notification.success('Entry successfully duplicated.');
          }
        );
      }
    }

    onMounted(async () => {
      if (!params.value.tid) {
        window.bcms.notification.error('Selected template does not exist.');
        await router.push({
          path: '/dashboard',
          replace: true,
        });
        return;
      }
      const langCode = window.bcms.sdk.storage.get('lang');
      let lng = language.value.items.find((e) => e.code === langCode);
      if (!lng) {
        await throwable(
          async () => {
            return await window.bcms.sdk.language.getAll();
          },
          async (result) => {
            if (!langCode && result.length > 0) {
              await window.bcms.sdk.storage.set('lang', result[0].code);
            }
            lng = language.value.items.find((e) => e.code === langCode);
            if (lng) {
              activeLanguage.value = lng.code;
            }
          }
        );
      }
      if (!template.value) {
        window.bcms.meta.set({ title: 'Entries' });
        await throwable(async () => {
          return await window.bcms.sdk.template.get(route.params.tid as string);
        });
      }
      if (template.value?.singleEntry) {
        await router.push({
          path: window.location.pathname + '/1',
          replace: true,
        });
      }
      if (entriesLite.value.length === 0 && template.value) {
        const tmp = template.value as BCMSTemplate;
        await throwable(async () => {
          return await window.bcms.sdk.entry.getAllLite({
            templateId: tmp._id,
          });
        });
      }
      console.log(policy.value);
    });
    onBeforeUpdate(async () => {
      if (entriesLite.value.length === 0 && template.value) {
        const tmp = template.value as BCMSTemplate;
        await throwable(async () => {
          return await window.bcms.sdk.entry.getAllLite({
            templateId: tmp._id,
          });
        });
      }
    });

    return () => (
      <div class="min-h-full py-7.5 desktop:py-0">
        {template.value && language.value ? (
          <>
            <BCMSEntryFilter
              template={template.value}
              entryCount={entriesInView.value.length}
              languages={language.value.items}
              visibleLanguage={{
                index: language.value.targetIndex,
                data: language.value.target,
              }}
              onFilter={(eventFilters) => {
                filters.value = eventFilters;
              }}
              disableAddEntry={!policy.value.post}
              onAddEntry={() => {
                router.push(route.path + '/create');
              }}
              onSelectLanguage={selectLanguage}
            />
            <div>
              <BCMSEntryTable
                policy={policy.value}
                template={template.value}
                entries={entriesInView.value}
                visibleLanguage={{
                  index: language.value.targetIndex,
                  data: language.value.target,
                }}
                onRemove={remove}
                onDuplicate={duplicateEntry}
              />
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
