<script lang="tsx">
import { defineComponent } from 'vue';
import { Buffer } from 'buffer';
import { useRoute, useRouter } from 'vue-router';

const component = defineComponent({
  setup() {
    const throwable = window.bcms.util.throwable;
    const router = useRouter();
    const route = useRoute();
    const headMeta = window.bcms.meta;
    headMeta.set({
      title: 'Login',
    });

    function init() {
      const query = route.query as {
        otp: string;
        forward?: string;
        user?: string;
      };
      if (query.otp || window.location.host === 'localhost:8080') {
        throwable(
          async () => {
            return await window.bcms.sdk.shim.verify.otp(
              query.otp,
              !!query.user
            );
          },
          async () => {
            if (query.forward) {
              await router.push({ path: query.forward, replace: true });
            } else {
              await router.push({ path: '/dashboard', replace: true });
            }
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
      return <div />;
    };
  },
});
export default component;
</script>
