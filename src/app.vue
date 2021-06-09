<style lang="scss">
@import 'assets/styles/main';
</style>

<script lang="tsx">
import { defineComponent, computed } from 'vue';
import { useRoute, RouterView } from 'vue-router';
import {
  BCMSNav,
  BCMSNotification,
  BCMSConfirmModal,
  BCMSPropAddModal,
  BCMSAddUpdateTemplateModal,
  BCMSPropEditModal,
  BCMSAddUpdateGroupModal,
  BCMSAddUpdateWidgetModal,
  BCMSMediaPickerModal,
  BCMSViewEntryModelModal,
  BCMSUploadMediaModal,
  BCMSAddUpdateMediaModal,
  BCMSEntryStatusModal,
  BCMSHelp,
} from './components';

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
            <aside class="layout--nav layout--nav_lvl1">
              <BCMSNav />
            </aside>
          </>
        )}
        <div id="managerNav" class="layout--nav layout--nav_lvl2" />
        <header class="layout--header" />
        <div class="layout--body">
          <RouterView />
        </div>
        <footer class="layout--footer">
          <BCMSHelp cyTag="help" />
        </footer>

        <BCMSViewEntryModelModal />
        <BCMSAddUpdateGroupModal />
        <BCMSAddUpdateTemplateModal />
        <BCMSAddUpdateWidgetModal />
        <BCMSPropAddModal />
        <BCMSPropEditModal />
        <BCMSEntryStatusModal />
        <BCMSMediaPickerModal />
        <BCMSAddUpdateMediaModal />
        <BCMSUploadMediaModal />
        <BCMSConfirmModal />

        <BCMSNotification />
      </div>
    );
  },
});
export default component;
</script>
