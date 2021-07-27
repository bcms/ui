export interface BCMSTooltipService {
  show(target: HTMLElement, message: string): void;
  hide(): void;
}