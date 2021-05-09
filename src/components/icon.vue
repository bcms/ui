<script lang="tsx">
import { defineComponent, ref } from 'vue';
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
    const src = ref('');

    if (props.src) {
      if (cache[props.src]) {
        src.value = styleInjection(cache[props.src], props.class, props.style);
      } else {
        fetch(`/assets/icons${props.src}.svg`)
          .then(async (response) => {
            const value = await response.text();
            src.value = styleInjection(value, props.class, props.style);
            if (props.src) {
              cache[props.src] = src.value;
            }
          })
          .catch((error) => console.error(error));
      }
    }
    return () => {
      return (
        <>
          {src.value ? (
            <div class="bcmsIcon" v-cy={props.cyTag} v-html={src.value} />
          ) : (
            <div class="bcmsIcon" v-cy={props.cyTag} />
          )}
        </>
      );
    };
  },
});
export default component;
</script>
