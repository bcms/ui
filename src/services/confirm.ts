import { StoreService } from './store';

export interface ConfirmServicePrototype {
  confirm(title: string, text: string, prompt?: string): Promise<boolean>;
}

function confirmService() {
  const self: ConfirmServicePrototype = {
    async confirm(title, text, prompt) {
      return new Promise<boolean>((resolve) => {
        StoreService.update('ConfirmModal', {
          show: true,
          title,
          body: text,
          prompt: prompt
            ? {
                invalidText: '',
                input: prompt,
                verify: '',
              }
            : undefined,
          callback: (type: 'done' | 'cancel') => {
            resolve(type === 'done');
          },
        });
      });
    },
  };
  return self;
}

export const ConfirmService = confirmService();
