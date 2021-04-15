import { Directive } from 'vue';

const useCy = process.env.VUE_APP_BCMS_USE_CY === 'true';

export const cy: Directive<HTMLElement, string> = {
  beforeMount(el, bindings) {
    if (useCy && bindings.value) {
      el.setAttribute('cy', bindings.value);
    }
  },
};
