import type { Directive } from 'vue';
import { v4 as uuidv4 } from 'uuid';

const handlers: {
  [id: string]: {
    enterCallback: (event: MouseEvent) => void;
    leaveCallback: (event: MouseEvent) => void;
  };
} = {};

export const tooltip: Directive<
  HTMLElement,
  string | { msg: string; type: 'default' | 'info' }
> = {
  beforeMount(el, msg) {
    if (msg.value) {
      const id = uuidv4();
      el.setAttribute('bcms-tooltip-id', id);

      handlers[id] = {
        enterCallback: () => {
          window.bcms.tooltip.show(
            el,
            typeof msg.value === 'string' ? msg.value : msg.value.msg,
            typeof msg.value === 'string' ? 'default' : msg.value.type
          );
        },
        leaveCallback: () => {
          window.bcms.tooltip.hide();
        },
      };

      el.addEventListener('mouseenter', handlers[id].enterCallback);
      el.addEventListener('mouseleave', handlers[id].leaveCallback);
      el.addEventListener('click', handlers[id].leaveCallback);
    }
  },
  unmounted(el) {
    const id = el.getAttribute('bcms-tooltip-id');
    if (id) {
      el.removeEventListener('mouseenter', handlers[id].enterCallback);
      el.removeEventListener('mouseleave', handlers[id].leaveCallback);
      el.removeEventListener('click', handlers[id].leaveCallback);
    }
  },
};
