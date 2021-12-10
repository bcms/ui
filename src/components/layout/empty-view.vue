<script lang="tsx">
import { defineComponent } from 'vue';
const component = defineComponent({
  props: {
    message: {
      type: String,
    },
  },
  setup(props, ctx) {
    return () => (
      <div class="text-center">
        <div class="text-grey text-2xl mb-20">
          {props.message || `There are no entities available.`}
        </div>
        <div class="emptyView--actions">
          {ctx.slots.default ? ctx.slots.default() : ''}
        </div>
      </div>
    );
  },
});
export default component;
</script>
