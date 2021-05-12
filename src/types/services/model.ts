import {
  BCMSAddPropModalInputData,
  BCMSAddPropModalOutputData,
  BCMSAddUpdateDirModalInputData,
  BCMSAddUpdateDirModalOutputData,
  BCMSAddUpdateGroupModalInputData,
  BCMSAddUpdateGroupModalOutputData,
  BCMSAddUpdateTemplateModalInputData,
  BCMSAddUpdateTemplateModalOutputData,
  BCMSAddUpdateWidgetModalInputData,
  BCMSAddUpdateWidgetModalOutputData,
  BCMSConfirmModalInputData,
  BCMSConfirmModalOutputData,
  BCMSEditPropModalInputData,
  BCMSEditPropModalOutputData,
  BCMSEntryStatusModalInputData,
  BCMSEntryStatusModalOutputData,
  BCMSMediaPickerModalInputData,
  BCMSMediaPickerModalOutputData,
  BCMSUploadMediaModalInputData,
  BCMSUploadMediaModalOutputData,
  BCMSViewEntryModelModalInputData,
  BCMSViewEntryModelModalOutputData,
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
  media: {
    addUpdateDir: BCMSModalServiceItem<
      BCMSAddUpdateDirModalOutputData,
      BCMSAddUpdateDirModalInputData
    >;
    upload: BCMSModalServiceItem<
      BCMSUploadMediaModalOutputData,
      BCMSUploadMediaModalInputData
    >;
    picker: BCMSModalServiceItem<
      BCMSMediaPickerModalOutputData,
      BCMSMediaPickerModalInputData
    >;
  };
  entry: {
    viewModel: BCMSModalServiceItem<
      BCMSViewEntryModelModalOutputData,
      BCMSViewEntryModelModalInputData
    >;
    status: BCMSModalServiceItem<
      BCMSEntryStatusModalOutputData,
      BCMSEntryStatusModalInputData
    >;
  };
  props: {
    add: BCMSModalServiceItem<
      BCMSAddPropModalOutputData,
      BCMSAddPropModalInputData
    >;
    edit: BCMSModalServiceItem<
      BCMSEditPropModalOutputData,
      BCMSEditPropModalInputData
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
