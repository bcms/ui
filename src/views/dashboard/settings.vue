<script lang="tsx">
import { defineComponent } from 'vue';
import {
  SettingsAccountManagement,
  SettingsNotifications,
  SettingsLanguages,
  SettingsTeam,
} from '../../components';

const component = defineComponent({
  setup() {
    const headMeta = window.bcms.meta;

    headMeta.set({
      title: 'Settings',
    });

    return () => (
      <div class="py-7 max-w-[680px] space-y-15 desktop:pt-0">
        <h1 class="text-4xl leading-none font-normal -tracking-0.01">
          Settings
        </h1>
        <SettingsAccountManagement />
        <SettingsNotifications />
        <SettingsLanguages />
        <SettingsTeam />
      </div>
    );
  },
});

export default component;
</script>
