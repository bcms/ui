<script lang="tsx">
import { defineComponent } from 'vue';
import { BCMSIcon } from '../components';

const component = defineComponent({
  setup() {
    const headMeta = window.bcms.meta;
    headMeta.set({
      title: 'Error 404',
    });

    return () => {
      return (
        <div class="auth flex min-h-screen w-screen py-[50px] px-5">
          <div class="mx-auto w-[500px] max-w-full">
            <div class="block p-2.5 mb-[75px] desktop:mb-[100px]">
              <BCMSIcon src="/logo" class="block max-w-[100px] mx-auto" />
            </div>
            <h1 class="text-grey text-[100px] text-center">404</h1>
          </div>
        </div>
      );
    };
  },
});
export default component;
</script>
