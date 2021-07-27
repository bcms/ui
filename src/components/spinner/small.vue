<script lang="tsx">
import { defineComponent } from 'vue';
import BCMSIcon from '../icon.vue';
import { DefaultComponentProps } from '../_default';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    show: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    return () => {
      return (
        <>
          {props.show ? (
            <div
              id={props.id}
              class={`spinnerSmall ${props.class}`}
              style={props.style}
            >
              <BCMSIcon src="/cog" />
            </div>
          ) : (
            ''
          )}
        </>
      );
    };
  },
});
export default component;
</script>
