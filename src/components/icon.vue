<script lang="tsx">
import { v4 as uuidv4 } from 'uuid';
import { defineComponent, onBeforeUpdate, onMounted } from 'vue';
import { DefaultComponentProps } from './_default';
import { createQueue } from '@banez/queue';

const cache: {
  [src: string]: string;
} = {};
const queue = createQueue();

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
    const id = uuidv4();

    function init() {
      const path = props.src as string;
      if (path) {
        queue({
          name: 'bcms-icon',
          async handler() {
            if (cache[path]) {
              const el = document.getElementById(id);
              if (el) {
                el.innerHTML = '';
                el.innerHTML = styleInjection(
                  cache[path],
                  props.class,
                  props.style
                );
              }
            } else {
              const response = await fetch(`/assets/icons${path}.svg`);
              const value = await response.text();
              const src = styleInjection(value, props.class, props.style);
              const el = document.getElementById(id);
              if (el) {
                el.innerHTML = '';
                el.innerHTML = styleInjection(src, props.class, props.style);
              }
              cache[path] = src;
            }
          },
        }).wait.catch((error) => {
          console.error(error);
        });
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
          id={id}
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
