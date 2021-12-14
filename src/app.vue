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
} from './components';

const component = defineComponent({
  setup() {
    const route = useRoute();
    const routeMeta = computed(
      () =>
        route.meta as {
          noLayout: boolean;
          noSecondLevelNav: boolean;
        }
    );

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

    return {
      route,
      routeMeta,
      toggleDarkMode,
    };
  },
  render() {
    return (
      <div
        class={`bcmsLayout grid ${
          this.routeMeta.noSecondLevelNav
            ? ' is-twoCol grid-cols-[250px,1fr] grid-rows-[auto,1fr,auto] desktop:grid-rows-[50px,1fr,50px] lg:grid-cols-[300px,1fr]'
            : 'grid-cols-1 grid-rows-[auto,1fr,auto] desktop:grid-cols-[250px,180px,1fr] desktop:grid-rows-[50px,1fr,50px] lg:grid-cols-[300px,240px,1fr]'
        }`}
      >
        {this.routeMeta.noLayout ? (
          <RouterView ref={this.route.fullPath} />
        ) : (
          <>
            <aside class="relative w-screen h-auto z-[999999] desktop:fixed desktop:h-screen desktop:top-0 desktop:left-0 desktop:w-[250px] lg:w-[300px]">
              <BCMSNav />
            </aside>
            {this.routeMeta.noSecondLevelNav ? '' : <div id="managerNav" />}
            <div class="bcmsLayout--body px-5 pb-10 max-w-[100vw] desktop:px-15 desktop:pt-15">
              {/* TODO: Transition must be used in v-slot */}
              {/*<Transition name="fade" mode="out-in" appear={true}>*/}
              <RouterView ref={this.route.fullPath} />
              {/*</Transition>*/}
            </div>
            <footer class="fixed right-0 bottom-0 px-5 py-4 flex items-center z-1000">
              <BCMSButton
                size="s"
                class="mr-3"
                disabled={false}
                onClick={() => this.toggleDarkMode()}
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
        <BCMSNotification />
        <BCMSEditorNodeNav />
        <BCMSTooltip />
      </div>
    );
  },
});
export default component;
</script>
