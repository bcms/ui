import * as uuid from 'uuid';

export interface TooltipServicePrototype {
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
    tooltip: HTMLElement;
    handlers: {
      click(event: MouseEvent): void;
      enter(event: MouseEvent): void;
      leave(event: MouseEvent): void;
    };
  }> = [];
  function screenOverflow(
    screenWidth: number,
    position: number,
    elementWidth: number
  ) {
    const delta = position + elementWidth - screenWidth;
    return delta < 0 ? 0 : delta;
  }
  const self: TooltipServicePrototype = {
    register(element, message) {
      const id = uuid.v4();
      const tooltip = document.createElement('div');
      tooltip.setAttribute('class', 'bcmsTooltip');
      tooltip.setAttribute(
        'style',
        `display: none; left: -${screenOverflow(
          window.innerWidth,
          element.getBoundingClientRect().left,
          300
        )}px; top: 40px; width: 300px;`
      );
      tooltip.innerHTML = `<div class="bcmsTooltip--inner">${message}</div>`;
      element.parentNode.insertBefore(tooltip, element.nextSibling);
      const clickHandler = () => {
        tooltip.style.display = 'inline-block';
        setTimeout(() => {
          tooltip.style.display = 'none';
        }, 3000);
      };
      const enterHandler = () => {
        tooltip.style.display = 'inline-block';
      };
      const leaveHandler = () => {
        tooltip.style.display = 'none';
      };
      element.addEventListener('click', clickHandler);
      element.addEventListener('mouseenter', enterHandler);
      element.addEventListener('mouseleave', leaveHandler);
      listeners.push({
        id,
        element,
        tooltip,
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
          listeners[i].tooltip.remove();
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
