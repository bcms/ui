<script lang="tsx">
import { computed, defineComponent, onMounted } from 'vue';
import type { BCMSTemplate } from '@becomes/cms-sdk/types';
import { useRoute, useRouter } from 'vue-router';
import { MutationTypes, useStore } from '@/store';

const component = defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const template = computed<{
      items: BCMSTemplate[];
      target: BCMSTemplate | undefined;
    }>(() => {
      const tmps = store.getters.template_items;
      const target = tmps.find((e) => e._id === route.params.id);
      if (target) {
        window.bcms.services.headMeta.set({ title: target.label });
      }
      return {
        items: tmps,
        target,
      };
    });

    onMounted(async () => {
      window.bcms.services.headMeta.set({ title: 'Templates' });
      if (!template.value.target) {
        await window.bcms.services.error.wrapper(
          async () => {
            return window.bcms.sdk.template.getAll();
          },
          async (result) => {
            store.commit(MutationTypes.template_set, result);
          }
        );
        if (template.value.items.length > 0) {
          const target = template.value.items.find(
            (e) => e._id === route.params.id
          );
          if (!target) {
            await router.push({
              path: route.path + '/' + template.value.items[0]._id,
              replace: true,
            });
          }
        }
      }
    });

    return () => <div />;
  },
});
export default component;
</script>
