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
          <div class="fixed top-0 left-0 w-full h-full bg-dark bg-opacity-40 flex flex-col z-1000">
            <div class="mt-auto mx-auto mb-12">
              <BCMSIcon
                src="/cog"
                class="text-light fill-current w-16 h-16 animate-spin"
                style="animation-duration: 4s !important;"
              />
            </div>
            <div class="text-light text-3xl font-light text-center mb-auto">
              {props.message ? props.message : 'Please wait...'}
            </div>
            {ctx.slots.default ? (
              <div class="m-auto max-w-screen-sm overflow-x-hidden overflow-y-auto flex flex-col">
                {ctx.slots.default()}
              </div>
            ) : (
              ''
            )}
          </div>
        );
      }
      return <div class="hidden" />;
    };
  },
});
export default component;
</script>
