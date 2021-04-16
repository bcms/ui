<script lang="tsx">
import { defineComponent, ref } from 'vue';
import { DefaultComponentProps } from '@/components/_default';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    src: String,
  },
  setup(props) {
    const src = ref('');
    if (props.src) {
      fetch(`/assets/icons${props.src}.svg`)
        .then(async (response) => {
          src.value = await response.text();
        })
        .catch((error) => console.error(error));
    }
    return () => {
      return (
        <>{src.value ? <div class="bcmsIcon" v-html={src.value} /> : <div class="bcmsIcon" />}</>
      );
    };
  },
});
export default component;
</script>
