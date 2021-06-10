<script lang="tsx">
import { defineComponent, Transition } from 'vue';
import { BCMSIcon, BCMSLink, BCMSNavItem } from '../../index';

const component = defineComponent({
  setup(_, ctx) {
    const beforeEnter = (el: any) => {
      console.log('ctx', ctx.attrs);
    };
    const enter = (el: Element, done: () => void) => {
      console.log('enter', { el });
      done();
    };
    const leave = (el: Element, done: () => void) => {
      console.log('leave', { el });
      done();
    };
    return () => (
      <BCMSLink cyTag="go-home" href="/dashboard" class="sideNav--logo">
        <Transition
          name="logo"
          appear={true}
          css={false}
          onBeforeEnter={beforeEnter}
          onEnter={enter}
          onLeave={leave}
        >
          <BCMSIcon src="/logo" />
        </Transition>
      </BCMSLink>
    );
  },
});
export default component;
</script>
