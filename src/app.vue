<style lang="scss">
@import 'assets/styles/main';
</style>

<script lang="tsx">
import { defineComponent, computed } from 'vue';
import { useRoute, RouterView } from 'vue-router';
import { BCMSNav } from '@/components';

const component = defineComponent({
  setup() {
    const route = useRoute();
    const noLayout = computed(() => route.meta.noLayout);
    return () => (
      <div class="layout">
        {noLayout.value ? (
          ''
        ) : (
          <>
            <div class="layout--sideNav">
              <BCMSNav />
            </div>
            <div id="managerNav" />
          </>
        )}
        <div class="layout--body">
          <RouterView />
        </div>
      </div>
    );
  },
});
export default component;
</script>
