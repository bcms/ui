import { BCMSModalServicePrototype } from '../types';

function modalNotImplemented(): {
  hide(): void;
  show(): void;
} {
  return {
    hide() {
      console.error('Not implemented');
    },
    show() {
      console.error('Not implemented');
    },
  };
}
export function BCMSModalService(): BCMSModalServicePrototype {
  return {
    confirm: modalNotImplemented(),
    media: {
      addUpdateDir: modalNotImplemented(),
      upload: modalNotImplemented(),
      picker: modalNotImplemented(),
    },
    entry: {
      viewModel: modalNotImplemented(),
      status: modalNotImplemented(),
    },
    props: {
      add: modalNotImplemented(),
      edit: modalNotImplemented(),
    },
    showDescriptionExample: modalNotImplemented(),
    addUpdate: {
      group: modalNotImplemented(),
      template: modalNotImplemented(),
      widget: modalNotImplemented(),
    },
  };
}
