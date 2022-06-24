<script lang="tsx">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { BCMSToggleInput } from '../input';
import { DefaultComponentProps } from '../_default';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
  },
  setup() {
    const { t: i18n } = useI18n();

    return () => (
      <div>
        <h2 class="text-[28px] leading-none font-normal -tracking-0.01 mb-7.5">
          {i18n('settings.notifications.title')}
        </h2>
        <div class="flex items-center space-x-2.5 mb-5">
          <BCMSToggleInput />
          <span class="cursor-pointer -tracking-0.01 leading-tight">
            {i18n('settings.notifications.notifyMeCta')}
          </span>
        </div>
        <div class="flex items-center space-x-2.5">
          <BCMSToggleInput />
          <span class="cursor-pointer -tracking-0.01 leading-tight">
            {i18n('settings.notifications.notifyMeCta')}
          </span>
        </div>
      </div>
    );
  },
});

export default component;
</script>
