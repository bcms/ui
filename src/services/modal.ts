import { BCMSModalServicePrototype } from '../types';

function modalNotImplemented(): {
  hide(): void;
  show(): void;
} {
  return {
    hide() {
      throw Error('Not implemented');
    },
    show() {
      throw Error('Not implemented');
    },
  };
}
export function BCMSModalService(): BCMSModalServicePrototype {
  return {
    confirm: modalNotImplemented(),
    props: {
      add: modalNotImplemented(),
      edit: modalNotImplemented(),
    },
    addUpdate: {
      group: modalNotImplemented(),
      template: modalNotImplemented(),
      widget: modalNotImplemented(),
    },
  };
}
