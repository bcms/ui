<style lang="scss">
@import 'assets/styles/main';
</style>

<script lang="tsx">
import { defineComponent, computed } from 'vue';
import { useRoute, RouterView } from 'vue-router';
import {
  BCMSNotification,
  BCMSTooltip,
  BCMSHelp,
  BCMSNav,
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
  BCMSShowDescriptionExampleModal,
  BCMSWhereIsItUsedModal,
  BCMSContentEditorLinkModal,
  BCMSContentEditorAddWidgetModal,
  BCMSTemplateOrganizerCreateModal,
} from './components';

const component = defineComponent({
  setup() {
    const route = useRoute();
    const noLayout = computed(() => route.meta.noLayout);
    return () => (
      <div class={`layout${route.meta.noSecondLevelNav ? ' is-twoCol ' : ''}`}>
        {noLayout.value ? (
          <RouterView ref={route.fullPath} />
        ) : (
          <>
            <aside class="layout--nav layout--nav_lvl1">
              <BCMSNav />
            </aside>
            {route.meta.noSecondLevelNav ? '' : <div id="managerNav" />}
            <header class="layout--header" />
            <div class="layout--body">
              {/* TODO : Transition must be used in v-slot */}
              {/*<Transition name="fade" mode="out-in" appear={true}>*/}
              <RouterView ref={route.fullPath} />
              {/*</Transition>*/}
            </div>
            <footer class="layout--footer">
              <BCMSHelp cyTag="help" />
            </footer>
          </>
        )}

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
        <BCMSShowDescriptionExampleModal />
        <BCMSWhereIsItUsedModal />
        <BCMSContentEditorLinkModal />
        <BCMSContentEditorAddWidgetModal />
        <BCMSTemplateOrganizerCreateModal />

        <BCMSNotification />

        <BCMSTooltip />
      </div>
    );
  },
});
export default component;
</script>
