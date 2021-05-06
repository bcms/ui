<script lang="tsx">
import { defineComponent } from 'vue';
import { BCMSIcon } from '../components';

const component = defineComponent({
  setup() {
    return () => {
      return (
        <div class="auth login">
          <div class="auth--content">
            <div class="auth--bcmsLogo">
              <BCMSIcon src="/logo" />
            </div>
            <h1>404</h1>
          </div>
        </div>
      );
    };
  },
});
export default component;
</script>
