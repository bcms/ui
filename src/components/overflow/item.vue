<script lang="tsx">
import { defineComponent, PropType } from 'vue';
import BCMSIcon from '../icon.vue';
import { DefaultComponentProps } from '../_default';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    text: {
      type: String,
      required: true,
    },
    icon: String,
    onClick: Function as PropType<() => void | Promise<void>>,
  },
  emits: {
    click: (_?: void) => {
      return _;
    },
  },
  setup(props, ctx) {
    return () => {
      return (
        <div
          id={props.id}
          class={`overflowMenu--item ${props.class ? props.class : ''}`}
          style={props.style}
          v-cy={props.cyTag}
        >
          <button
            onClick={() => {
              ctx.emit('click');
            }}
          >
            {props.icon ? <BCMSIcon src={props.icon} /> : ''}
            <span>{props.text}</span>
          </button>
        </div>
      );
    };
  },
});
export default component;
</script>
