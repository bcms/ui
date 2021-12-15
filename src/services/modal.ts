import { BCMSModalService } from '../types';

let service: BCMSModalService;

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

export function useBcmsModalService(): BCMSModalService {
  return service;
}

export function createBcmsModalService(): void {
  service = {
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
    whereIsItUsed: modalNotImplemented(),
    showDescriptionExample: modalNotImplemented(),
    addUpdate: {
      group: modalNotImplemented(),
      template: modalNotImplemented(),
      widget: modalNotImplemented(),
    },
    content: {
      link: modalNotImplemented(),
      widget: modalNotImplemented(),
    },
    templateOrganizer: {
      create: modalNotImplemented(),
    },
    apiKey: {
      addUpdate: modalNotImplemented(),
    },
    settings: {
      invite: modalNotImplemented(),
      view: modalNotImplemented(),
    },
  };
}
