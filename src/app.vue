<style lang="scss">
@import 'assets/styles/main';
</style>

<script lang="tsx">
import { defineComponent, computed, onMounted } from 'vue';
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
  BCMSIcon,
  BCMSButton,
} from './components';

const component = defineComponent({
  setup() {
    const route = useRoute();
    const noLayout = computed(() => route.meta.noLayout);

    function toggleDarkMode() {
      if (document.documentElement.classList.contains('dark')) {
        localStorage.setItem('theme', 'light');
      } else {
        localStorage.setItem('theme', 'dark');
      }

      document.documentElement.classList.toggle('dark');
    }

    onMounted(() => {
      if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark');
      }
    });

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
            <footer class="bcmsLayout--footer flex items-center">
              <BCMSButton
                size="s"
                class="mr-3"
                disabled={false}
                onClick={() => toggleDarkMode()}
              >
                <BCMSIcon src="/theme" class="w-4 h-4 fill-current" />
              </BCMSButton>
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
