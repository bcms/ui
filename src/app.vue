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
  BCMSApiKeyAddUpdateModal,
  BCMSViewUserModal,
  BCMSGlobalSearch,
  BCMSMultiSelectModal,
} from './components';
import { useBcmsStore } from './store';

const component = defineComponent({
  setup() {
    const store = useBcmsStore();
    const route = useRoute();
    const routeMeta = computed(
      () =>
        route.meta as {
          noLayout: boolean;
        }
    );

    const isLoggedIn = computed(() => {
      return !!store.getters.user_me;
    });

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
      <>
        <div class={`bcmsLayout grid `}>
          {routeMeta.value.noLayout ? (
            <RouterView ref={route.fullPath} />
          ) : (
            <>
              <aside class="relative w-screen h-auto z-[999999] desktop:fixed desktop:h-screen desktop:top-0 desktop:left-0 desktop:w-[250px] lg:w-[300px]">
                <BCMSNav />
              </aside>
              <div id="managerNav" />
              <div class="bcmsLayout--body px-5 pb-10 max-w-[100vw] desktop:px-15 desktop:py-15">
                {/* TODO: Transition must be used in v-slot */}
                {/*<Transition name="fade" mode="out-in" appear={true}>*/}
                <RouterView ref={route.fullPath} />
                {/*</Transition>*/}
              </div>
              <footer class="fixed right-0 bottom-0 px-5 py-4 flex items-center z-1000">
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
          <BCMSApiKeyAddUpdateModal />
          <BCMSViewUserModal />
          <BCMSMultiSelectModal />
          <BCMSNotification />
          <BCMSEditorNodeNav />
          <BCMSTooltip />
          <div id="selectList" />
          {isLoggedIn.value && <BCMSGlobalSearch />}
        </div>
      </>
    );
  },
});
export default component;
</script>
