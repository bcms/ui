<script lang="tsx">
import { defineComponent } from '@vue/runtime-core';
import { DefaultComponentProps } from '../_default';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    type: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    selected: Boolean,
  },
  emits: {
    click: () => {
      return true;
    },
  },
  setup(props, ctx) {
    return () => (
      <button
        id={props.id}
        style={`border: 1px solid #000; ${props.style}`}
        v-cy={props.cyTag}
        class={`policySimpleBlock ${
          props.selected ? `policySimpleBlock_selected` : ''
        } ${props.class}`}
        onClick={() => {
          ctx.emit('click');
        }}
      >
        <div class="policySimpleBlock--type">{props.type}</div>
        <div class="policySimpleBlock--text">{props.text}</div>
      </button>
    );
  },
});
export default component;
</script>
