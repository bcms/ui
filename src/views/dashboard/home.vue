<script lang="tsx">
import { defineComponent } from 'vue';
import { useBcmsHeadMetaService } from '../../services';

const component = defineComponent({
  setup() {
    const headMeta = useBcmsHeadMetaService();
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
