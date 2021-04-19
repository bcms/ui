<script lang="tsx">
import { defineComponent, ref } from 'vue';
import { DefaultComponentProps } from '@/components/_default';

const cache: {
  [src: string]: string;
} = {};

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    src: String,
  },
  setup(props) {
    const src = ref('');
    if (props.src) {
      if (cache[props.src]) {
        src.value = cache[props.src];
      } else {
        fetch(`/assets/icons${props.src}.svg`)
          .then(async (response) => {
            src.value = await response.text();
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
            <div class="bcmsIcon" v-html={src.value} />
          ) : (
            <div class="bcmsIcon" />
          )}
        </>
      );
    };
  },
});
export default component;
</script>
