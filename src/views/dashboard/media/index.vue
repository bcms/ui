<script lang="tsx">
import { computed, defineComponent, onBeforeUpdate, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { BCMSMediaViewer } from '../../../components';

const component = defineComponent({
  setup() {
    const route = useRoute();
    const store = window.bcms.vue.store;
    const media = computed(() => {
      return store.getters.media_items;
    });

    onMounted(() => {
      window.bcms.meta.set({ title: 'Media' });
    });
    onBeforeUpdate(() => {
      const target = media.value.find((e) => e._id === route.params.id);
      if (target) {
        window.bcms.meta.set({ title: `Media: ${target.name}` });
      } else {
        window.bcms.meta.set({ title: 'Media' });
      }
    });
    return () => (
      <div class="min-h-full py-[30px] desktop:pb-15 desktop:pt-0">
        <BCMSMediaViewer mode="view" />
      </div>
    );
  },
});
export default component;
</script>
