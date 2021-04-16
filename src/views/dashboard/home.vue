<script lang="tsx">
import { defineComponent } from 'vue';
import { BCMSButton } from '@/components';

const component = defineComponent({
  setup() {
    window.bcms.services.headMeta.set({
      title: 'Home',
    });
    return () => {
      return (
        <div class="overview">
          <h3>You are now logged in.</h3>
          <img src="/logo.svg" alt="logo" />
          <BCMSButton
            onClick={() => {
              console.log('here');
            }}
          >
            Test
          </BCMSButton>
        </div>
      );
    };
  },
});
export default component;
</script>
