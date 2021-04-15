<script lang="tsx">
import { defineComponent } from 'vue';

const component = defineComponent({
  setup() {
    return () => {
      window.bcms.services.headMeta.set({
        title: 'Home',
      });
      return (
        <div class="overview">
          <h3>You are now logged in.</h3>
          <img src="/logo.svg" alt="logo" />
        </div>
      );
    };
  },
});
export default component;
</script>
