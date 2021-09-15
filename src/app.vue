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
        class={`bcmsLayout${
          this.routeMeta.noSecondLevelNav ? ' is-twoCol ' : ''
        }`}
      >
        {this.routeMeta.noLayout ? (
          <RouterView ref={this.route.fullPath} />
        ) : (
          <>
            <aside class="bcmsLayout--nav bcmsLayout--nav_lvl1">
              <BCMSNav />
            </aside>
            {this.routeMeta.noSecondLevelNav ? '' : <div id="managerNav" />}
            <header class="bcmsLayout--header" />
            <div class="bcmsLayout--body">
              {/* TODO : Transition must be used in v-slot */}
              {/*<Transition name="fade" mode="out-in" appear={true}>*/}
              <RouterView ref={this.route.fullPath} />
              {/*</Transition>*/}
            </div>
            <footer class="bcmsLayout--footer flex items-center">
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
        <BCMSNotification />
        <BCMSEditorNodeNav />
        <BCMSTooltip />
      </div>
    );
  },
});
export default component;
</script>
