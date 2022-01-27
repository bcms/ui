<script lang="tsx">
import { computed, defineComponent, onMounted } from 'vue';
import {
  SettingsAccountManagement,
  SettingsLanguages,
  SettingsTeam,
} from '../../components';

const component = defineComponent({
  setup() {
    const store = window.bcms.vue.store;
    const headMeta = window.bcms.meta;
    const user = computed(() => store.getters.user_me);

    headMeta.set({
      title: 'Settings',
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
          Settings
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
