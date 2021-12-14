<script lang="tsx">
import { defineComponent } from 'vue';
import {
  SettingsAccountManagement,
  SettingsNotifications,
  SettingsLanguages,
} from '../../components';

const component = defineComponent({
  setup() {
    const headMeta = window.bcms.meta;

    headMeta.set({
      title: 'Settings',
    });

    return () => (
      <div class="max-w-[680px]">
        <h1 class="text-4xl leading-none font-normal -tracking-0.01 mb-[50px]">
          Settings
        </h1>
        <SettingsAccountManagement />
        <SettingsNotifications />
        <SettingsLanguages />
      </div>
    );
  },
});

export default component;
</script>
