<script lang="tsx">
import Link from '../components/link.vue';
import { defineComponent } from 'vue';
import { BCMSEmptyStateIllustration, BCMSLogo } from '../components';

const component = defineComponent({
  setup() {
    const headMeta = window.bcms.meta;

    headMeta.set({
      title: 'Bad Gateway',
    });

    return () => {
      return (
        <div class="flex min-h-screen w-screen py-[50px] px-5 mt-16 desktop:mt-0">
          <div class="flex flex-col justify-center mx-auto">
            <BCMSLogo
              showOnMobile={true}
              class="absolute flex top-10 left-10 md:top-15"
            />
            <div class="flex flex-col items-center text-center max-h-full">
              <BCMSEmptyStateIllustration
                src="/502-1.png"
                maxWidth="405px"
                maxHeight="365px"
              />
              <h1 class="text-9.5 mb-5 -tracking-0.03 leading-none">
                Bad Gateway.
              </h1>
              <p class="leading-tight -tracking-0.01 mb-6">
                You can return to the homepage.
              </p>
              <Link
                href="/dashboard"
                class="rounded-3.5 transition-all duration-300 inline-block font-medium text-base leading-normal -tracking-0.01 whitespace-normal no-underline py-1.5 px-5 my-3 border border-solid select-none bg-dark border-dark text-white hover:shadow-btnPrimary hover:text-white focus:shadow-btnPrimary focus:text-white active:shadow-btnPrimary active:text-white disabled:bg-grey disabled:opacity-50 disabled:border-grey disabled:border-opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none focus:outline-none"
              >
                Go home
              </Link>
              <BCMSEmptyStateIllustration
                src="/502-2.png"
                maxWidth="405px"
                maxHeight="385px"
              />
            </div>
          </div>
        </div>
      );
    };
  },
});
export default component;
</script>
