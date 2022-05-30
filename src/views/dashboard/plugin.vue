<script lang="tsx">
import { defineComponent, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { BCMSSpinner } from '../../components';

const component = defineComponent({
  setup() {
    const { t: i18n } = useI18n();
    const throwable = window.bcms.util.throwable;
    const route = useRoute();
    const containerRef = ref<HTMLDivElement | null>(null);
    const showSpinner = ref(true);
    const loaded = ref(false);

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
        let basePath = route.path.replace('/dashboard', '');
        if (basePath.endsWith('/')) {
          basePath = basePath.slice(0, basePath.length - 1);
        }
        const htmlRes = await fetch(basePath + '/_index.html');
        const html = await htmlRes.text();
        if (html.indexOf(route.params.pluginName as string) !== -1) {
          const scriptPaths = window.bcms.util.string
            .allTextBetween(html, `<script`, '>')
            .map((attributes) => {
              return window.bcms.util.string.textBetween(
                attributes,
                `src="${basePath}/js`,
                '"'
              );
            });
          for (let i = 0; i < scriptPaths.length; i++) {
            const scriptPath = scriptPaths[i];
            const scriptRes = await fetch(`${basePath}/js${scriptPath}`);
            const script = await scriptRes.text();
            if (script) {
              eval(script);
            }
          }
          const stylePaths = window.bcms.util.string
            .allTextBetween(html, '<link ', '>')
            .filter((e) => e.indexOf('rel="stylesheet"') !== -1);
          for (let i = 0; i < stylePaths.length; i++) {
            const style = stylePaths[i];
            const styleLink = window.bcms.util.string.textBetween(
              style,
              'href="',
              '"'
            );
            const styleRes = await fetch(styleLink);
            const styleData = await styleRes.text();
            const node = document.createElement('style');
            node.innerText = styleData;
            // eslint-disable-next-line no-unused-expressions
            containerRef.value?.appendChild(node);
          }
        } else {
          throw Error(i18n('plugin.error.badFormat'));
        }
      });
      showSpinner.value = false;
      loaded.value = true;
    }
    onMounted(async () => {
      await load();
    });

    return () => (
      <>
        <div
          style={{
            opacity: loaded.value ? '1' : '0',
            transition: 'opacity 0.3s',
          }}
        >
          <div
            id={`bcms_plugin_${route.params.pluginName}`}
            ref={containerRef}
          />
        </div>
        <BCMSSpinner show={showSpinner.value} />
      </>
    );
  },
});
export default component;
</script>
