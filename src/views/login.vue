<script lang="tsx">
import { defineComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Buffer } from 'buffer';
import { useBcmsHeadMetaService } from '../services';
import { useThrowable } from '../util';

const component = defineComponent({
  setup() {
    const throwable = useThrowable();
    const router = useRouter();
    const route = useRoute();
    const headMeta = useBcmsHeadMetaService();
    headMeta.set({
      title: 'Login',
    });

    function init() {
      const query = route.query as {
        otp: string;
      };
      if (query.otp || window.location.host === 'localhost:8080') {
        throwable(
          async () => {
            return await window.bcms.sdk.shim.verify.otp(query.otp);
          },
          async () => {
            await router.push({ path: '/dashboard', replace: true });
          }
        );
        return;
      }
      window.location.href = `https://cloud.thebcms.com/login?type=cb&d=${Buffer.from(
        JSON.stringify({
          host: window.location.host,
          iid: window.bcmsCloud?.iid,
        })
      ).toString('hex')}`;
    }
    init();

    return () => {
      return <div class="auth login" />;
    };
  },
});
export default component;
</script>
