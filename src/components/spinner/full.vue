<script lang="tsx">
import { defineComponent } from 'vue';
import BCMSIcon from '../icon.vue';
import { DefaultComponentProps } from '../_default';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    show: Boolean,
    message: String,
  },
  setup(props, ctx) {
    return () => {
      if (props.show) {
        return (
          <div class="spinner">
            <BCMSIcon src="/cog" />
            <div class="spinner--wait">
              {props.message ? props.message : 'Please wait...'}
            </div>
            <div class="spinner--content">
              {ctx.slots.default ? ctx.slots.default() : ''}
            </div>
          </div>
        );
      }
      return <div style="display:none;" />;
    };
  },
});
export default component;
</script>
