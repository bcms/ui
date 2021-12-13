<script lang="tsx">
import { defineComponent } from 'vue';

const component = defineComponent({
  setup() {
    const headMeta = window.bcms.meta;
    headMeta.set({
      title: 'Settings',
    });
    return () => {
      return <div class="">SETTINGS</div>;
    };
  },
});

export default component;
</script>
