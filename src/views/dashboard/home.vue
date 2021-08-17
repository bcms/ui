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
