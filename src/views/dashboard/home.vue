<script lang="tsx">
import { defineComponent } from 'vue';

const component = defineComponent({
  setup() {
    const headMeta = window.bcms.meta;
    headMeta.set({
      title: 'Home',
    });
    return () => {
      return (
        <div class="text-center m-auto flex flex-col justify-center mt-20 desktop:mt-[25vh]">
          <h1 class="text-2xl font-light mb-8 desktop:text-3xl">
            You are now logged in.
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
