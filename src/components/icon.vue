<script lang="tsx">
import { defineComponent, onBeforeUpdate, onMounted, ref } from 'vue';
import { DefaultComponentProps } from './_default';

const cache: {
  [src: string]: string;
} = {};

function styleInjection(input: string, cls?: string, style?: string): string {
  let output = '' + input;
  if (cls) {
    output = output.replace('<svg', `<svg class="${cls}"`);
  }
  if (style) {
    output = output.replace('<svg', `<svg style="${style}"`);
  }
  return output;
}

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    src: String,
  },
  setup(props) {
    let srcBuffer = '';
    const containerEl = ref<HTMLDivElement | null>(null);

    function init() {
      const path = props.src as string;
      if (path) {
        if (cache[path]) {
          if (containerEl.value) {
            const el = containerEl.value;
            el.innerHTML = '';
            el.innerHTML = styleInjection(
              cache[path],
              props.class,
              props.style
            );
          }
        } else {
          fetch(`/assets/icons${path}.svg`)
            .then(async (response) => {
              const value = await response.text();
              const src = styleInjection(value, props.class, props.style);
              if (containerEl.value) {
                const el = containerEl.value;
                el.innerHTML = '';
                el.innerHTML = styleInjection(src, props.class, props.style);
              }
              cache[path] = src;
            })
            .catch((error) => console.error(error));
        }
      }
    }
    onMounted(() => {
      srcBuffer = props.src + '';
      init();
    });

    onBeforeUpdate(() => {
      if (srcBuffer !== props.src) {
        srcBuffer = props.src + '';
        init();
      }
    });

    return () => {
      return (
        <div
          ref={containerEl}
          class="bcmsIcon flex pointer-events-none"
          data-src={props.src}
          v-cy={props.cyTag}
        />
      );
    };
  },
});
export default component;
</script>
