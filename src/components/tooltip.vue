<script lang="tsx">
import { defineComponent, ref } from '@vue/runtime-core';

const component = defineComponent({
  setup() {
    const show = ref(false);
    const position = ref({
      top: 0,
      left: 0,
      width: 300,
    });
    const message = ref('');

    function screenOverflow(
      screenWidth: number,
      screenPosition: number,
      elementWidth: number
    ) {
      const delta = screenPosition + elementWidth - screenWidth;
      return delta < 0 ? 0 : delta;
    }
    function calcPosition(target: HTMLElement) {
      // TODO: Fix position calculations
      if (target) {
        const targetBounding = target.getBoundingClientRect();
        position.value.top = targetBounding.top + 44;
        position.value.left =
          targetBounding.left -
          screenOverflow(window.innerWidth, targetBounding.left, 300);
      }
    }

    window.bcms.services.tooltip.show = (target, msg) => {
      message.value = msg;
      calcPosition(target);
      show.value = true;
    };

    window.bcms.services.tooltip.hide = () => {
      show.value = false;
    };

    return () => (
      <div
        class="bcmsTooltip"
        style={`display: ${show.value ? 'block' : 'none'};
        top: ${position.value.top}px;
        left: ${position.value.left}px;
        max-width: ${position.value.width}px;`}
      >
        <div class="bcmsTooltip--inner">{message.value}</div>
      </div>
    );
  },
});

export default component;
</script>
