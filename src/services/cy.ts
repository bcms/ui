const useCy = '__CY__';

export function cy(element: HTMLElement, params: string) {
  if (useCy && params) {
    element.setAttribute('data-cy', params);
  }
}
