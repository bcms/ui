import {
  BCMSAddPropModalInputData,
  BCMSAddPropModalOutputData,
  BCMSAddUpdateGroupModalInputData,
  BCMSAddUpdateGroupModalOutputData,
  BCMSAddUpdateTemplateModalInputData,
  BCMSAddUpdateTemplateModalOutputData,
  BCMSAddUpdateWidgetModalInputData,
  BCMSAddUpdateWidgetModalOutputData,
  BCMSConfirmModalInputData,
  BCMSConfirmModalOutputData,
} from '../components';

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
  confirm: BCMSModalServiceItem<
    BCMSConfirmModalOutputData,
    BCMSConfirmModalInputData
  >;
  props: {
    add: BCMSModalServiceItem<
      BCMSAddPropModalOutputData,
      BCMSAddPropModalInputData
    >;
  };
  addUpdate: {
    group: BCMSModalServiceItem<
      BCMSAddUpdateGroupModalOutputData,
      BCMSAddUpdateGroupModalInputData
    >;
    template: BCMSModalServiceItem<
      BCMSAddUpdateTemplateModalOutputData,
      BCMSAddUpdateTemplateModalInputData
    >;
    widget: BCMSModalServiceItem<
      BCMSAddUpdateWidgetModalOutputData,
      BCMSAddUpdateWidgetModalInputData
    >;
  };
}
