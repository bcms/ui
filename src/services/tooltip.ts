import * as uuid from 'uuid';

type PreCallbackHandler = (message: string, element: HTMLElement) => string;

export interface TooltipServicePrototype {
  create(
    callback: (show: boolean, message: string, element: HTMLElement) => void
  ): void;
  register(
    element: HTMLElement,
    message: string,
    preCallbackHandler?: PreCallbackHandler
  ): string;
  unregister(id: string): void;
  bind(
    message: string,
    preCallbackHandler?: PreCallbackHandler
  ): (
    element: HTMLElement,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params?: any
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

  const self: TooltipServicePrototype = {
    create(_callback) {
      callback = _callback;
    },
    register(element, message, preCallbackHandler) {
      const id = uuid.v4();
      const clickHandler = () => {
        if (callback) {
          if (preCallbackHandler) {
            message = preCallbackHandler(message, element);
          }
          callback(true, message, element);
        }
      };
      const enterHandler = () => {
        if (callback) {
          if (preCallbackHandler) {
            message = preCallbackHandler(message, element);
          }
          callback(true, message, element);
        }
      };
      const leaveHandler = () => {
        if (callback) {
          if (preCallbackHandler) {
            message = preCallbackHandler(message, element);
          }
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
    bind(message, preCallbackHandler) {
      return (element, params) => {
        if (params && params.message) {
          message = params.message;
        }
        const listenerId = self.register(element, message, preCallbackHandler);
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
