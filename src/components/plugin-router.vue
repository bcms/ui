<script lang="tsx">
import { computed, defineComponent, PropType } from 'vue';
import type { RouteLocationNormalizedLoaded } from 'vue-router';
import type { BCMSPluginRouterItem } from '../types';

const component = defineComponent({
  props: {
    route: {
      type: Object as PropType<RouteLocationNormalizedLoaded>,
      required: true,
    },
    routes: {
      type: Array as PropType<BCMSPluginRouterItem[]>,
      required: true,
    },
  },
  setup(props) {
    const onRoute = computed(() => {
      const hash = props.route.hash.replace('#', '');
      return props.routes.find((e) => e.path === hash);
    });

    return () => (
      <div>
        {onRoute.value ? (
          <onRoute.value.component />
        ) : (
          <div>Route does not exist</div>
        )}
      </div>
    );
  },
});
export default component;
</script>
