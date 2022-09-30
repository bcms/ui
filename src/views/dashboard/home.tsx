import { computed, defineComponent } from 'vue';
import { useTranslation } from '../../translations';

const component = defineComponent({
  setup() {
    const translations = computed(() => {
      return useTranslation();
    });
    const headMeta = window.bcms.meta;
    headMeta.set({
      title: translations.value.page.home.meta.title,
    });
    return () => {
      return (
        <div class="text-center m-auto flex flex-col justify-center mt-20 desktop:mt-[25vh]">
          <h1 class="text-2xl font-light mb-8 desktop:text-3xl dark:text-light">
            {translations.value.page.home.title}
          </h1>
          {/* <img
            src="/logo.svg"
            alt="logo"
            class="mx-auto max-w-[250px] desktop:max-w-xs dark:grayscale dark:brightness-0 dark:invert"
          /> */}
        </div>
      );
    };
  },
});

export default component;
