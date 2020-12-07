import * as uuid from 'uuid';

export interface TooltipServicePrototype {
  create(
    callback: (show: boolean, message: string, element: HTMLElement) => void
  ): void;
  register(element: HTMLElement, message: string): string;
  unregister(id: string): void;
  bind(
    message: string
  ): (
    element: HTMLElement
  ) => {
    destroy(): void;
  };
}

function tooltipService() {
  const listeners: Array<{
    id: string;
    element: HTMLElement;
    handlers: {
      click(event: MouseEvent): void;
      enter(event: MouseEvent): void;
      leave(event: MouseEvent): void;
    };
  }> = [];
  let callback: (show: boolean, message: string, element: HTMLElement) => void;

  function screenOverflow(
    screenWidth: number,
    position: number,
    elementWidth: number
  ) {
    const delta = position + elementWidth - screenWidth;
    return delta < 0 ? 0 : delta;
  }

  const self: TooltipServicePrototype = {
    create(_callback) {
      callback = _callback;
    },
    register(element, message) {
      const id = uuid.v4();
      const clickHandler = () => {
        if (callback) {
          callback(true, message, element);
        }
      };
      const enterHandler = () => {
        if (callback) {
          callback(true, message, element);
        }
      };
      const leaveHandler = () => {
        if (callback) {
          callback(false, message, element);
        }
      };
      element.addEventListener('click', clickHandler);
      element.addEventListener('mouseenter', enterHandler);
      element.addEventListener('mouseleave', leaveHandler);
      listeners.push({
        id,
        element,
        handlers: {
          click: clickHandler,
          enter: enterHandler,
          leave: leaveHandler,
        },
      });
      return id;
    },
    unregister(id) {
      for (let i = 0; i < listeners.length; i++) {
        if (listeners[i].id === id) {
          listeners[i].element.removeEventListener(
            'click',
            listeners[i].handlers.click
          );
          listeners[i].element.removeEventListener(
            'mouseenter',
            listeners[i].handlers.enter
          );
          listeners[i].element.removeEventListener(
            'mouseout',
            listeners[i].handlers.leave
          );
          listeners.splice(i, 1);
          break;
        }
      }
    },
    bind(message) {
      return (element) => {
        const listenerId = self.register(element, message);
        return {
          destroy() {
            self.unregister(listenerId);
          },
        };
      };
    },
  };
  return self;
}

export const TooltipService = tooltipService();
