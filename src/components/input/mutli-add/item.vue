<script lang="tsx">
import { defineComponent } from 'vue';
import { BCMSIcon } from '../../index';

const component = defineComponent({
  props: {
    item: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    remove: () => {
      return true;
    },
  },
  setup(props, ctx) {
    return () => (
      <li class="_bcmsInput--multiAdd-item">
        <span class="_bcmsInput--multiAdd-label">{props.item}</span>
        <button
          class="_bcmsInput--multiAdd-delete"
          disabled={props.disabled}
          aria-label={`Remove ${props.item}`}
          onClick={() => {
            ctx.emit('remove');
          }}
        >
          <BCMSIcon src="/close" />
        </button>
        <div class="_bcmsInput--multiAdd-bg" />
      </li>
    );
  },
});
export default component;
</script>
