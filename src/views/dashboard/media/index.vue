<script lang="tsx">
import { computed, defineComponent, onBeforeUpdate, onMounted } from 'vue';
import { BCMSMediaViewer } from '../../../components';
import { useStore } from '../../../store';
import { useRoute } from 'vue-router';

const component = defineComponent({
  setup() {
    const route = useRoute();
    const store = useStore();
    const media = computed(() => {
      return store.getters.media_items;
    });

    onMounted(() => {
      window.bcms.services.headMeta.set({ title: 'Media' });
    });
    onBeforeUpdate(() => {
      const target = media.value.find((e) => e._id === route.params.id);
      if (target) {
        window.bcms.services.headMeta.set({ title: `Media: ${target.name}` });
      } else {
        window.bcms.services.headMeta.set({ title: 'Media' });
      }
    });
    return () => (
      <div class="view media">
        <BCMSMediaViewer mode="view" />
      </div>
    );
  },
});
export default component;
</script>
