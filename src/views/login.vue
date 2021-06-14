<script lang="tsx">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { Buffer } from 'buffer';

const component = defineComponent({
  setup() {
    const router = useRouter();
    window.bcms.services.headMeta.set({
      title: 'Login',
    });

    function init() {
      const query = window.bcms.services.general.query();
      if (query.otp || window.location.host === 'localhost:8080') {
        window.bcms.services.error.wrapper(
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
          iid: window.cloud?.iid,
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
