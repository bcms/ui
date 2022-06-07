<script lang="tsx">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  BCMSButton,
  SettingsAccountManagement,
  SettingsLanguages,
  SettingsTeam,
  BCMSSpinner,
} from '../../components';

const component = defineComponent({
  setup() {
    const { t: i18n } = useI18n();
    const store = window.bcms.vue.store;
    const headMeta = window.bcms.meta;
    const user = computed(() => store.getters.user_me);
    const notif = window.bcms.notification;
    const showSpinner = ref(false);

    headMeta.set({
      title: i18n('settings.meta.title'),
    });

    async function downloadBackup() {
      showSpinner.value = true;
      await window.bcms.util.throwable(
        async () => {
          return await window.bcms.sdk.backup.create({ media: true });
        },
        async (result) => {
          const el = document.createElement('a');
          el.setAttribute('href', `/api/backup/${result}`);
          el.setAttribute('download', 'backup.zip');
          el.style.display = 'none';
          document.body.appendChild(el);
          el.click();
          document.body.removeChild(el);
        }
      );
      showSpinner.value = false;
    }
    async function deleteBackup() {
      await window.bcms.util.throwable(
        async () => {
          await window.bcms.sdk.backup.delete({ hash: '' });
        },
        async () => {
          notif.success('Backup successfully deleted.');
        }
      );
    }

    onMounted(async () => {
      if (!user.value) {
        await window.bcms.util.throwable(async () => {
          await window.bcms.sdk.user.get();
        });
      }
    });

    return () => (
      <>
        <div class="py-7 max-w-[680px] space-y-15 desktop:pt-0">
          <h1 class="text-4xl leading-none font-normal -tracking-0.01">
            {i18n('settings.title')}
          </h1>
          <BCMSButton onClick={downloadBackup}>Download backup</BCMSButton>
          <BCMSButton kind="secondary" onClick={deleteBackup}>
            Delete backup
          </BCMSButton>
          <SettingsAccountManagement />
          {/* <SettingsNotifications /> */}
          <SettingsLanguages />
          <SettingsTeam />
        </div>
        <BCMSSpinner show={showSpinner.value} />
      </>
    );
  },
});

export default component;
</script>
