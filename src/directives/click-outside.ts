import { Directive } from 'vue';
import * as uuid from 'uuid';

const uuids: string[] = [];
const binds: any = {};

function closeDropdown(event: MouseEvent) {
  const lastUUID = uuids[uuids.length - 1];
  const currentRoot = binds[lastUUID];
  if (!currentRoot.el.contains(event.target)) {
    currentRoot.binding.value(event.target);
  }
}

export const clickOutside: Directive<HTMLElement, string> = {
  beforeMount(el, binding) {
    const id = uuid.v4();
    uuids.push(id);

    const index = uuids.indexOf(id);
    binds[uuids[index]] = {
      el,
      binding,
      closeDropdown(event: MouseEvent) {
        return closeDropdown(event);
      },
    };
    document.addEventListener('click', binds[id].closeDropdown, true);
  },
  unmounted() {
    const lastUUID = uuids[uuids.length - 1];
    document.removeEventListener('click', binds[lastUUID].closeDropdown, true);
    delete binds[lastUUID];
    uuids.splice(uuids.length - 1, 1);
  },
};
