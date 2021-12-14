<script lang="tsx">
import { defineComponent } from 'vue';
import { BCMSToggleInput } from '../input';
import { DefaultComponentProps } from '../_default';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
  },
  setup() {
    return () => (
      <div class="mb-[50px]">
        <h2 class="text-[28px] leading-none font-normal -tracking-0.01 mb-[30px]">
          Notifications
        </h2>
        <div class="flex items-center space-x-2.5 mb-5">
          <BCMSToggleInput />
          <span class="cursor-pointer -tracking-0.01 leading-tight">
            Notify me about news & events
          </span>
        </div>
        <div class="flex items-center space-x-2.5">
          <BCMSToggleInput />
          <span class="cursor-pointer -tracking-0.01 leading-tight">
            Notify me about news & events
          </span>
        </div>
      </div>
    );
  },
});

export default component;
</script>
