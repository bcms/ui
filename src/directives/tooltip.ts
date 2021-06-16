import { Directive } from 'vue';
import { v4 as uuidv4 } from 'uuid';

const handlers: {
  [id: string]: {
    enterCallback: (event: MouseEvent) => void;
    leaveCallback: (event: MouseEvent) => void;
  };
} = {};

export const tooltip: Directive<HTMLElement, string> = {
  beforeMount(el, msg) {
    if (msg.value) {
      const id = uuidv4();
      el.setAttribute('bcms-tooltip-id', id);

      handlers[id] = {
        enterCallback: () => {
          window.bcms.services.tooltip.show(el, msg.value);
        },
        leaveCallback: () => {
          window.bcms.services.tooltip.hide();
        },
      };

      el.addEventListener('mouseenter', handlers[id].enterCallback);
      el.addEventListener('mouseleave', handlers[id].leaveCallback);
    }
  },
  unmounted(el) {
    const id = el.getAttribute('bcms-tooltip-id');
    if (id) {
      el.removeEventListener('mouseenter', handlers[id].enterCallback);
      el.removeEventListener('mouseleave', handlers[id].leaveCallback);
    }
  },
};
