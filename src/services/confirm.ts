import { BCMSConfirmServicePrototype } from '../types';

export function BCMSConfirmService(): BCMSConfirmServicePrototype {
  return async (title, text, prompt) => {
    return new Promise<boolean>((resolve) => {
      window.bcms.services.modal.confirm.show({
        title,
        body: text,
        prompt,
        onDone() {
          resolve(true);
        },
        onCancel() {
          resolve(false);
        },
      });
    });
  };
}
