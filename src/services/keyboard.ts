import * as uuid from 'uuid';

export type KeyboardServiceSubHandler = (
  event: KeyboardEvent
) => Promise<void> | Promise<boolean>;

export interface KeyboardServicePrototype {
  subscribe(
    keys: string[],
    handler: KeyboardServiceSubHandler,
    element?: HTMLElement
  ): () => void;
}

function keyboardService() {
  const subscriptions: Array<{
    id: string;
    keys: string[];
    handler: KeyboardServiceSubHandler;
    element?: HTMLElement;
  }> = [];
  const keyMapping = {
    ctrl: {
      active: false,
    },
  };

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Control') {
      keyMapping.ctrl.active = true;
      showKeys(true);
    } else if (keyMapping.ctrl.active) {
      emit(event);
    }
  });
  window.addEventListener('keyup', (event) => {
    if (event.key === 'Control') {
      keyMapping.ctrl.active = false;
      showKeys(false);
    }
  });

  async function emit(event: KeyboardEvent) {
    const subs = subscriptions.filter((e) => e.keys.includes(event.key));
    for (const i in subs) {
      try {
        const result = await subs[i].handler(event);
        if (result) {
          return;
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
  function showKeys(show: boolean) {
    subscriptions.forEach((sub) => {
      if (sub.element) {
        sub.element.className = `keyboard--key keyboard--key-${
          show ? '' : 'hide'
        }`;
      }
    });
  }

  const self: KeyboardServicePrototype = {
    subscribe(keys, handler, parent) {
      let element: HTMLElement;
      if (parent) {
        element = document.createElement('div');
        element.setAttribute('class', 'keyboard-key--hide');
        element.innerHTML = keys[0].toUpperCase();
        parent.appendChild(element);
      }
      const id = uuid.v4();
      subscriptions.push({
        id,
        keys,
        handler: async (event) => {
          event.preventDefault();
          await handler(event);
        },
        element,
      });
      return () => {
        for (let i = 0; i < subscriptions.length; i++) {
          if (subscriptions[i].id === id) {
            const sub = subscriptions.splice(i, 1);
            if (sub[0].element) {
              sub[0].element.remove();
            }
            return;
          }
        }
      };
    },
  };
  return self;
}

export type Keyboard<T> = (
  element: HTMLElement,
  params: {
    key: string;
    handler: KeyboardServiceSubHandler;
  }
) => T;

export const KeyboardService = keyboardService();