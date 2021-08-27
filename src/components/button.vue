<script lang="tsx">
import { defineComponent, PropType, reactive } from 'vue';

const component = defineComponent({
  props: {
    kind: {
      type: String as PropType<
        'primary' | 'secondary' | 'alternate' | 'ghost' | 'danger'
      >,
      default: 'primary',
    },
    cyTag: String,
    class: String,
    style: String,
    disabled: Boolean,
    size: String as PropType<'m' | 's'>,
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
        <button
          class={`bcmsButton bcmsButton_${props.kind} ${
            props.size ? `bcmsButton_${props.size}` : ''
          } ${props.class ? props.class : ''}`}
          v-cy={props.cyTag}
          style={props.style}
          disabled={props.disabled}
          onClick={() => {
            ctx.emit('click');
          }}
        >
          {ctx.slots.default ? <span>{ctx.slots.default()}</span> : ''}
        </button>
      );
    };
  },
});
export default component;
</script>
