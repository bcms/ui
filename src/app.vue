<style lang="scss">
@import 'assets/styles/main';
</style>

<script lang="tsx">
import { defineComponent, computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';
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
  BCMSEditorNodeNav,
} from './components';

const component = defineComponent({
  setup() {
    const route = useRoute();
    const noLayout = computed(() => route.meta.noLayout);

    return () => (
      <div
        class={`bcmsLayout${route.meta.noSecondLevelNav ? ' is-twoCol ' : ''}`}
      >
        {noLayout.value ? (
          <RouterView ref={route.fullPath} />
        ) : (
          <>
            <aside class="bcmsLayout--nav layout--nav_lvl1">
              <BCMSNav />
            </aside>
            {route.meta.noSecondLevelNav ? '' : <div id="managerNav" />}
            <header class="bcmsLayout--header" />
            <div class="bcmsLayout--body">
              {/* TODO : Transition must be used in v-slot */}
              {/*<Transition name="fade" mode="out-in" appear={true}>*/}
              <RouterView ref={route.fullPath} />
              {/*</Transition>*/}
            </div>
            <footer class="bcmsLayout--footer">
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
        <BCMSEditorNodeNav />
        <BCMSTooltip />
      </div>
    );
  },
});
export default component;
</script>
