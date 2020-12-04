<script lang="ts">
  import { TooltipService } from '../services';

  const position = {
    top: 0,
    left: 0,
    width: 300,
  };
  let show = false;
  let message = '';
  let target: HTMLElement;

  function screenOverflow(
    screenWidth: number,
    position: number,
    elementWidth: number
  ) {
    const delta = position + elementWidth - screenWidth;
    return delta < 0 ? 0 : delta;
  }
  function calcPosition() {
    if (target) {
      const targetBounding = target.getBoundingClientRect();
      position.top = targetBounding.top + 44;
      position.left =
        targetBounding.left -
        screenOverflow(window.innerWidth, targetBounding.left, 300);
    }
  }

  TooltipService.create((_show, _message, _element) => {
    show = _show;
    message = _message;
    target = _element;
    calcPosition();
  });
</script>

<div
  class="bcmsTooltip"
  style="display: {show ? 'block' : 'none'};
        top: {position.top}px;
        left: {position.left}px;
        max-width: {position.width}px;">
  <div class="bcmsTooltip--inner">{message}</div>
</div>
