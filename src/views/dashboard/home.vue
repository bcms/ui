<script lang="tsx">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

const component = defineComponent({
  setup() {
    const { t: i18n } = useI18n();
    const headMeta = window.bcms.meta;
    headMeta.set({
      title: i18n('home.meta.title'),
    });
    return () => {
      return (
        <div class="text-center m-auto flex flex-col justify-center mt-20 desktop:mt-[25vh]">
          <h1 class="text-2xl font-light mb-8 desktop:text-3xl">
            {i18n('home.title')}
          </h1>
          <img
            src="/logo.svg"
            alt="logo"
            class="mx-auto max-w-[250px] desktop:max-w-xs"
          />
        </div>
      );
    };
  },
});

export default component;
</script>
