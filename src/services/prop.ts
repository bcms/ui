import { v4 as uuidv4 } from 'uuid';
import type {
  BCMSGroup,
  BCMSPropEntryPointerData,
  BCMSPropEnumData,
  BCMSPropGroupPointerData,
  BCMSPropValueData,
  BCMSPropValueEntryPointer,
  BCMSPropValueGroupPointerData,
  BCMSPropValueRichTextData,
} from '@becomes/cms-sdk/types';
import { BCMSPropType } from '@becomes/cms-sdk/types';
import type {
  BCMSPropService,
  BCMSPropValueExtended,
  BCMSPropValueExtendedColorPicker,
  BCMSPropValueExtendedGroupPointerData,
  BCMSPropValueExtendedRichTextData,
} from '../types';
import type { BCMSPropColorPickerData } from '@becomes/cms-sdk/types/models/prop/color-picker';

let service: BCMSPropService;

export function useBcmsPropService(): BCMSPropService {
  return service;
}

export function createBcmsPropService(): void {
  const checkerValidators: {
    [id: string]: () => boolean;
  } = {};
  service = {
    async toPropValueExtended({ prop, value, lang }) {
      const output: BCMSPropValueExtended = {
        id: prop.id,
        data: undefined as never,
        label: prop.label,
        required: prop.required,
        array: prop.array,
        type: prop.type,
      };
      if (
        prop.type === BCMSPropType.STRING ||
        prop.type === BCMSPropType.NUMBER ||
        prop.type === BCMSPropType.BOOLEAN ||
        prop.type === BCMSPropType.DATE ||
        prop.type === BCMSPropType.MEDIA
      ) {
        if (value && value.data) {
          const valueData = value.data as string[];
          output.data = valueData;
        } else {
          output.data = prop.defaultData as string[];
        }
      } else if (prop.type === BCMSPropType.ENUMERATION) {
        const propData = prop.defaultData as BCMSPropEnumData;
        output.enumItems = propData.items;
        if (value && value.data) {
          const valueData = value.data as string[];
          output.data = valueData;
        } else {
          output.data = [propData.selected ? propData.selected : ''];
        }
      } else if (prop.type === BCMSPropType.ENTRY_POINTER) {
        const propData = prop.defaultData as BCMSPropEntryPointerData[];
        output.templateIds = propData.map((e) => e.templateId);
        if (value && value.data) {
          output.data = value.data as BCMSPropValueEntryPointer[];
        } else {
          output.data = [];
          for (let j = 0; j < propData.length; j++) {
            const propInfo = propData[j];
            output.templateIds.push(propInfo.templateId);
          }
        }
      } else if (prop.type === BCMSPropType.GROUP_POINTER) {
        const propData = prop.defaultData as BCMSPropGroupPointerData;
        output.groupId = propData._id;
        let group: BCMSGroup;
        try {
          group = await window.bcms.sdk.group.get(propData._id);
        } catch (_error) {
          return null;
        }
        if (value && value.data) {
          const valueData = value.data as BCMSPropValueGroupPointerData;
          (output.data as BCMSPropValueGroupPointerData) = {
            _id: group._id,
            items: [],
          };
          for (let i = 0; i < valueData.items.length; i++) {
            const item = valueData.items[i];
            (output.data as BCMSPropValueGroupPointerData).items.push({
              props: [],
            });
            for (let j = 0; j < group.props.length; j++) {
              const groupProp = group.props[j];
              const groupOutput = await service.toPropValueExtended({
                prop: groupProp,
                lang,
                value: item.props.find((e) => e.id === groupProp.id),
              });
              if (groupOutput) {
                (output.data as BCMSPropValueExtendedGroupPointerData).items[
                  i
                ].props.push(groupOutput);
              }
            }
          }
        } else {
          (output.data as BCMSPropValueGroupPointerData) = {
            _id: group._id,
            items: [],
          };
          if (output.required) {
            (output.data as BCMSPropValueGroupPointerData).items.push({
              props: [],
            });
            for (let j = 0; j < group.props.length; j++) {
              const groupProp = group.props[j];
              const groupOutput = await service.toPropValueExtended({
                prop: groupProp,
                lang,
              });
              if (groupOutput) {
                (
                  output.data as BCMSPropValueExtendedGroupPointerData
                ).items[0].props.push(groupOutput);
              }
            }
          }
        }
      } else if (prop.type === BCMSPropType.RICH_TEXT) {
        const valueData =
          value && value.data
            ? (value.data as BCMSPropValueRichTextData[])
            : (prop.defaultData as BCMSPropValueRichTextData[]);
        const nodesExtended: BCMSPropValueExtendedRichTextData[] = [];
        for (let i = 0; i < valueData.length; i++) {
          const rtData = valueData[i];
          nodesExtended.push({
            id: uuidv4(),
            nodes: await window.bcms.entry.content.toExtendedNodes({
              contentNodes: rtData.nodes,
              lang,
            }),
          });
        }
        output.data = nodesExtended;
      } else if (prop.type === BCMSPropType.COLOR_PICKER) {
        if (value && value.data) {
          const valueData = value.data as string[];
          output.data = {
            value: valueData,
            options: {
              allowCustom: (prop.defaultData as BCMSPropColorPickerData)
                .allowCustom,
              allowGlobal: (prop.defaultData as BCMSPropColorPickerData)
                .allowGlobal,
            },
          };
        } else {
          output.data = {
            value: [],
            options: {
              allowCustom: (prop.defaultData as BCMSPropColorPickerData)
                .allowCustom,
              allowGlobal: (prop.defaultData as BCMSPropColorPickerData)
                .allowGlobal,
            },
          };
        }
      }

      return output;
    },
    fromPropValueExtended({ extended }) {
      if (extended.type === BCMSPropType.GROUP_POINTER) {
        const extendedData =
          extended.data as BCMSPropValueExtendedGroupPointerData;
        const data: BCMSPropValueData = {
          _id: extendedData._id,
          items: extendedData.items.map((item) => {
            return {
              props: item.props.map((prop) => {
                return service.fromPropValueExtended({ extended: prop });
              }),
            };
          }),
        };
        return {
          id: extended.id,
          data,
        };
      } else if (extended.type === BCMSPropType.COLOR_PICKER) {
        const extendedData = extended.data as BCMSPropValueExtendedColorPicker;

        return {
          id: extended.id,
          data: extendedData.value,
        };
      } else {
        return {
          id: extended.id,
          data: extended.data as never,
        };
      }
    },
    checker: {
      register(validate) {
        const id = uuidv4();
        checkerValidators[id] = validate;
        return () => {
          delete checkerValidators[id];
        };
      },
      validate() {
        let isOk = true;
        for (const id in checkerValidators) {
          if (!checkerValidators[id]()) {
            isOk = false;
          }
        }
        return isOk;
      },
    },
  };
}
