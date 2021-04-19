export interface BCMSModalServiceItemInputDefaults<OutputData> {
  title?: string;
  onDone?(data: OutputData): void | Promise<void>;
  onCancel?(): void | Promise<void>;
}
export interface BCMSModalServiceItem<
  OutputData,
  InputData extends BCMSModalServiceItemInputDefaults<OutputData>
  > {
  show(data: InputData): void;
  hide(): void;
}

export interface BCMSModalServicePrototype {

}
