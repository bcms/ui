<script lang="tsx">
import { computed, defineComponent, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  SettingsAccountManagement,
  SettingsLanguages,
  SettingsTeam,
} from '../../components';

const component = defineComponent({
  setup() {
    const { t: i18n } = useI18n();
    const store = window.bcms.vue.store;
    const headMeta = window.bcms.meta;
    const user = computed(() => store.getters.user_me);

    headMeta.set({
      title: i18n('settings.meta.title'),
    });

    onMounted(async () => {
      if (!user.value) {
        await window.bcms.util.throwable(async () => {
          await window.bcms.sdk.user.get();
        });
      }
    });

    return () => (
      <div class="py-7 max-w-[680px] space-y-15 desktop:pt-0">
        <h1 class="text-4xl leading-none font-normal -tracking-0.01">
          {i18n('settings.title')}
        </h1>
        <SettingsAccountManagement />
        {/* <SettingsNotifications /> */}
        <SettingsLanguages />
        <SettingsTeam />
      </div>
    );
  },
});

export default component;
</script>
