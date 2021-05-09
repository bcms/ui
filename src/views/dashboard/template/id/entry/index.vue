<script lang="tsx">
import { computed, defineComponent, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { MutationTypes, useStore } from '../../../../../store';
import { BCMSSpinner } from '../../../../../components';

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
    const entiresLite = computed(() => {
      return store.getters
        .entryLite_find((e) => e.templateId === route.params.tid)
        .map((e) => {
          return window.bcms.services.entry.toLiteModified(e);
        });
    });
    const language = computed(() => {
      const langCode = window.bcms.sdk.services.storage.get('lang');
      return store.getters.language_findOne((e) => e.code === langCode);
    });

    onMounted(async () => {
      window.bcms.services.headMeta.set({ title: 'Entries' });
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
      if (!language.value) {
        let langCode = window.bcms.sdk.services.storage.get('lang');
        await window.bcms.services.error.wrapper(
          async () => {
            return await window.bcms.sdk.language.getAll();
          },
          async (result) => {
            if (!langCode && result.length > 0) {
              langCode = result[0].code;
              window.bcms.sdk.services.storage.set('lang', langCode);
            }
            store.commit(MutationTypes.language_set, result);
          }
        );
      }
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
    });

    return () => (
      <div class="view entryOverview">
        {template.value && language.value ? (
          ''
        ) : (
          <BCMSSpinner show={true} message="Loading content..." />
        )}
      </div>
    );
  },
});
export default component;
</script>
