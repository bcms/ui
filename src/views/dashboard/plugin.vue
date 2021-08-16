<script lang="tsx">
import { defineComponent, onMounted, ref } from '@vue/runtime-core';
import { useRoute } from 'vue-router';
import { BCMSSpinner } from '../../components';
import { useThrowable } from '../../util';

const component = defineComponent({
  setup() {
    const route = useRoute();
    const containerRef = ref<HTMLDivElement | null>(null);
    const showSpinner = ref(true);
    const throwable = useThrowable();

    window.bcms.meta.set({
      title: (route.params.pluginName as string)
        .split('-')
        .map(
          (part) =>
            part.charAt(0).toUpperCase() + part.substring(1).toLowerCase()
        )
        .join(' '),
    });

    async function load() {
      await throwable(async () => {
        const basePath = route.path.replace('/dashboard', '');
        const htmlRes = await fetch(basePath + '/_index.html');
        const html = await htmlRes.text();
        if (html.indexOf(route.params.pluginName as string) !== -1) {
          const scriptPaths = window.bcms.util.string
            .allTextBetween(html, `<script`, '>')
            .map((attributes) =>
              window.bcms.util.string.textBetween(
                attributes,
                `src="${basePath}/js`,
                '"'
              )
            );
          for (let i = 0; i < scriptPaths.length; i++) {
            const scriptPath = scriptPaths[i];
            const scriptRes = await fetch(`${basePath}/js${scriptPath}`);
            const script = await scriptRes.text();
            if (script) {
              eval(script);
            }
          }
        } else {
          throw Error(
            'Plugin is badly formatted and it is missing _index.html'
          );
        }
      });
      showSpinner.value = false;
    }
    onMounted(async () => {
      await load();
    });

    return () => (
      <div>
        <div id={`bcms_plugin_${route.params.pluginName}`} ref={containerRef} />
        <BCMSSpinner show={showSpinner.value} />
      </div>
    );
  },
});
export default component;
</script>
