<script lang="tsx">
import { defineComponent, onMounted, ref } from 'vue';

const component = defineComponent({
  setup() {
    const route = window.bcms.vue.useRoute();
    const container = ref<HTMLElement>();
    const error = ref('');
    const params: {
      id: string;
    } = route.params as never;

    onMounted(async () => {
      window.bcms.services.headMeta.set({ title: params.id + ' | Plugin' });
      fetch(`/plugin/${params.id}/index.html`)
        .then(async (response) => {
          const text = await response.text();
          // const head = window.bcms.services.general.string.textBetween(
          //   text,
          //   '<head>',
          //   '</head>'
          // );
          // const headLinks = window.bcms.services.general.string.allTextBetween(
          //   head,
          //   '<link ',
          //   '>'
          // );
          // let content = headLinks
          //   .filter((e) => e.indexOf('.js"') !== -1)
          //   .map(
          //     (e) =>
          //       '<script src="' +
          //       window.bcms.services.general.string.textBetween(
          //         e,
          //         'href="',
          //         '"'
          //       ) +
          //       '"><' +
          //       '/script>'
          //   )
          //   .join('\n');
          const body = window.bcms.services.general.string.textBetween(
            text,
            '<body>',
            '</body>'
          );
          const scripts = window.bcms.services.general.string
            .allTextBetween(body, '<script ', '<' + '/script>')
            .map((e) =>
              window.bcms.services.general.string.textBetween(e, 'src="', '"')
            );
          console.log(scripts);
          if (container.value) {
            for (let i = 0; i < scripts.length; i++) {
              const src = scripts[i];
              const script = document.createElement('script');
              script.setAttribute('src', src);
              container.value.append(script);
            }
            // container.value.innerHTML += scripts.join('\n');
          }
          // document.head.innerHTML += links.join('\n');
          // document.body.innerHTML += scripts.join('\n');
        })
        .catch((err) => {
          console.error(err);
          error.value = `Plugin with ID "${params.id}" is not installed.`;
        });
    });

    return () => (
      <div class="bcms--plugin">
        {error.value ? <div class="bcms--plugin-error">{error.value}</div> : ''}
        <div
          ref={container}
          id={`bcms_plugin_${params.id}`}
          class={`bcms--plugin-${params.id}`}
        />
      </div>
    );
  },
});
export default component;
</script>
