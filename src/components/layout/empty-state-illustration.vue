<script lang="tsx">
import { defineComponent } from 'vue';
import { DefaultComponentProps } from '../_default';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    maxWidth: {
      type: String,
      required: false,
      default: '100%',
    },
    maxHeight: {
      type: String,
      required: false,
      default: '100%',
    },
    src: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      required: false,
      default: 'Empty',
    },
  },
  setup(props) {
    return () => (
      <img
        class={`flex object-contain max-w-full mx-auto ${props.class || ''}`}
        style={{ maxWidth: props.maxWidth, maxHeight: props.maxHeight }}
        src={`${window.bcms.origin}/assets/empty-state-illustrations/${props.src}`}
        alt={props.alt}
      />
    );
  },
});

export default component;
</script>
