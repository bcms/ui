<script lang="tsx">
import { defineComponent, PropType, reactive } from 'vue';

const component = defineComponent({
  props: {
    cyTag: String,
    class: String,
    onClick: Function as PropType<() => void>,
  },
  emits: {
    click: () => {
      return true;
    },
  },
  setup(props, ctx) {
    props = reactive(props);
    return () => {
      return (
        <div class={`help ${props.class || ''}`} v-cy={props.cyTag}>
          <button
            onClick={() => {
              ctx.emit('click');
            }}
            class="help--btn"
          >
            <span>?</span>
          </button>
          <div class="help--container"></div>
        </div>
      );
    };
  },
});
export default component;
</script>
