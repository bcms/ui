import { v4 as uuidv4 } from 'uuid';
import {
  BCMSGroup,
  BCMSPropEntryPointerData,
  BCMSPropEnumData,
  BCMSPropGroupPointerData,
  BCMSPropType,
  BCMSPropValueGroupPointerData,
} from '@becomes/cms-sdk/types';
import {
  BCMSPropService,
  BCMSPropValueExtended,
  BCMSPropValueExtendedGroupPointerData,
} from '../types';

let service: BCMSPropService;

export function useBcmsPropService(): BCMSPropService {
  return service;
}

export function createBcmsPropService(): void {
  const checkerValidators: {
    [id: string]: () => boolean;
  } = {};
  service = {
    async toPropValueExtended({ prop, value }) {
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
        const propData = prop.defaultData as BCMSPropEntryPointerData;
        output.templateId = propData.templateId;
        if (value && value.data) {
          const valueData = value.data as string[];
          output.data = valueData;
        } else {
          try {
            await window.bcms.sdk.template.get(propData.templateId);
          } catch (_error) {
            return null;
          }
          output.data = propData.entryIds;
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
                value: item.props.find((e) => e.id === groupProp.id),
              });
              if (groupOutput) {
                (output.data as BCMSPropValueGroupPointerData).items[
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
          (output.data as BCMSPropValueGroupPointerData).items.push({
            props: [],
          });
          for (let j = 0; j < group.props.length; j++) {
            const groupProp = group.props[j];
            const groupOutput = await service.toPropValueExtended({
              prop: groupProp,
            });
            if (groupOutput) {
              (
                output.data as BCMSPropValueGroupPointerData
              ).items[0].props.push(groupOutput);
            }
          }
        }
      }

      return output;
    },
    fromPropValueExtended({ extended }) {
      if (extended.type === BCMSPropType.GROUP_POINTER) {
        return {
          id: extended.id,
          data: {
            _id: (extended.data as BCMSPropValueExtendedGroupPointerData)._id,
            items: (
              extended.data as BCMSPropValueExtendedGroupPointerData
            ).items.map((item) => {
              return {
                props: item.props.map((prop) => {
                  return service.fromPropValueExtended({ extended: prop });
                }),
              };
            }),
          },
        };
      } else {
        return {
          id: extended.id,
          data: extended.data,
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