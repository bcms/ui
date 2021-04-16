<script lang="tsx">
import { computed, defineComponent, ref } from 'vue';
import { BCMSIcon, BCMSLink } from '@/components';
import { useStore } from '@/store';
import { User } from '@becomes/cms-sdk';

const component = defineComponent({
  setup() {
    const store = useStore();
    const isMobileNavOpen = ref(false);
    const showSection = ref({
      administration: true,
      plugins: true,
      entries: false,
    });
    const user = computed(() => {
      // const jwt = window.bcms.sdk.getAccessToken();
      // if (jwt) {
      //   return store.getters.user_findOne((e) => e._id === jwt.payload.userId);
      // }
      return undefined;
    });

    const logic = {
      toggleMobileNav() {
        isMobileNavOpen.value = !isMobileNavOpen.value;
        if (isMobileNavOpen.value) {
          document.body.style.overflowY = 'hidden';
        } else {
          document.body.style.overflowY = 'auto';
        }
      },
    };

    return () => (
      <nav
        v-cy={'side-nav'}
        class={`sideNav ${
          isMobileNavOpen.value ? 'is-active' : ''
        } customScrollbar`}
      >
        <div class="sideNav--top">
          <BCMSLink cyTag="go-home" href="/" class="sideNav--logo">
            <BCMSIcon src="logo" />
          </BCMSLink>
          <button
            v-cy={'open-nav-mob'}
            aria-label="Toggle navigation"
            onClick={logic.toggleMobileNav}
          >
            <BCMSIcon src="nav" />
          </button>
        </div>
        <div class="sideNav--wrapper">
          <div class="sideNav--inner"></div>
        </div>
      </nav>
    );
  },
});
export default component;
</script>
