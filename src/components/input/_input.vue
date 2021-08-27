<script lang="tsx">
import { defineComponent } from 'vue';
import BCMSIcon from '../icon.vue';

const component = defineComponent({
  props: {
    class: String,
    label: String,
    invalidText: String,
    helperText: String,
  },
  emits: {
    click: () => {
      return true;
    },
  },
  setup(props, ctx) {
    return () => {
      return (
        <label
          // for={props.label}
          class={`_bcmsInput ${props.class}`}
          onClick={() => {
            ctx.emit('click');
          }}
        >
          {props.label ? (
            <span class="_bcmsInput--label">{props.label}</span>
          ) : (
            ''
          )}
          <span
            class={`_bcmsInput--inner ${
              props.invalidText ? '_bcmsInput--inner_invalid' : ''
            }`}
          >
            {ctx.slots.default ? ctx.slots.default() : ''}
            {props.invalidText ? (
              <div class="_bcmsInput--errorIcon" v-tooltip={props.invalidText}>
                <span class="_bcmsInput--tooltip">
                  <BCMSIcon src="/alert-triangle" />
                </span>
              </div>
            ) : (
              ''
            )}
          </span>
          {props.helperText ? (
            <span class="_bcmsInput--helperText" v-html={props.helperText} />
          ) : (
            ''
          )}
        </label>
      );
    };
  },
});
export default component;
</script>
