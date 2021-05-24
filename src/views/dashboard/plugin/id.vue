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
          if (container.value) {
            for (let i = 0; i < scripts.length; i++) {
              const res = await fetch(scripts[i]);
              eval(await res.text());
            }
          }
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
