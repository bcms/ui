import * as uuid from 'uuid';

export interface ClickOutsideServicePrototype {
  register(
    element: HTMLElement,
    callback: (event: MouseEvent, element: HTMLElement) => void
  ): string;
  unregister(id: string): void;
  bind(
    callback: (event: MouseEvent, element: HTMLElement) => void
  ): (
    element: HTMLElement
  ) => {
    destroy(): void;
  };
}

function clickOutsideService() {
  const handlers: Array<{
    id: string;
    element: HTMLElement;
    callback: (event: MouseEvent, element: HTMLElement) => void;
  }> = [];
  document.addEventListener(
    'click',
    (event: MouseEvent) => {
      if (handlers.length > 0) {
        const lastHandler = handlers[handlers.length - 1];
        setTimeout(() => {
          lastHandler.callback(event, lastHandler.element);
        }, 50)
        // const targetElement = event.currentTarget as HTMLElement;
        // if (!lastHandler.element.contains(targetElement)) {
        //     lastHandler.callback(event, lastHandler.element);
        // }
      }
    },
    true
  );
  const self: ClickOutsideServicePrototype = {
    register(element, callback) {
      const id = uuid.v4();
      handlers.push({
        id,
        element,
        callback,
      });
      return id;
    },
    unregister(id) {
      for (let i = 0; i < handlers.length; i++) {
        if (handlers[i].id === id) {
          handlers.splice(i, 1);
          break;
        }
      }
    },
    bind(callback) {
      return (element) => {
        const clickOutsideRegistryId = ClickOutsideService.register(
          element,
          callback
        );
        return {
          destroy() {
            ClickOutsideService.unregister(clickOutsideRegistryId);
          },
        };
      };
    },
  };
  return self;
}

export const ClickOutsideService = clickOutsideService();
