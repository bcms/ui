<script lang="tsx">
import type { BCMSPlugin } from '@becomes/cms-sdk/types';
import { defineComponent, PropType } from '@vue/runtime-core';

const component = defineComponent({
  props: {
    plugin: {
      type: Object as PropType<BCMSPlugin>,
      required: true,
    },
  },
  setup(props) {
    return () => (
      <div class="bcmsPluginPolicy">
        {JSON.stringify(props.plugin, null, '  ')}
      </div>
    );
  },
});
export default component;
</script>
