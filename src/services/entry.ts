import { v4 as uuidv4 } from 'uuid';
import type {
  BCMSProp,
  BCMSEntry,
  BCMSPropWidget,
  BCMSPropQuill,
} from '@becomes/cms-sdk/types';
import { BCMSPropType } from '@becomes/cms-sdk/types';
import type {
  BCMSEntryLiteModified,
  BCMSEntryModified,
  BCMSEntryServicePrototype,
} from '../types';

export function BCMSEntryService(): BCMSEntryServicePrototype {
  return {
    instance(languages, props) {
      return {
        _id: '',
        createdAt: 0,
        updatedAt: 0,
        meta: languages.map((lng) => {
          return {
            lng: lng.code,
            props: JSON.parse(JSON.stringify(props)),
          };
        }),
        templateId: '',
        userId: '',
        content: languages.map((lng) => {
          return {
            lng: lng.code,
            props: [],
          };
        }),
      };
    },
    instanceLite(languages, props) {
      return {
        _id: '',
        createdAt: 0,
        updatedAt: 0,
        meta: languages.map((lng) => {
          return {
            lng: lng.code,
            props: JSON.parse(JSON.stringify(props)),
          };
        }),
        templateId: '',
        userId: '',
      };
    },
    instanceModified(languages, props) {
      const entryModified: BCMSEntryModified = {
        _id: '',
        createdAt: 0,
        updatedAt: 0,
        meta: {},
        templateId: '',
        userId: '',
        content: {},
      };
      languages.forEach((lng) => {
        entryModified.content[lng.code] = [];
        entryModified.meta[lng.code] = JSON.parse(
          JSON.stringify(props)
        ) as BCMSProp[];
      });
      return entryModified;
    },
    instanceLiteModified(languages, props) {
      const entryLiteModified: BCMSEntryLiteModified = {
        _id: '',
        createdAt: 0,
        updatedAt: 0,
        meta: {},
        templateId: '',
        userId: '',
      };
      languages.forEach((lng) => {
        entryLiteModified.meta[lng.code] = JSON.parse(
          JSON.stringify(props)
        ) as BCMSProp[];
      });
      return entryLiteModified;
    },
    toLiteModified(entryLite) {
      const entryLiteModified: BCMSEntryLiteModified = {
        _id: entryLite._id,
        createdAt: entryLite.createdAt,
        updatedAt: entryLite.updatedAt,
        meta: {},
        templateId: entryLite._id,
        userId: entryLite.userId,
      };
      entryLite.meta.forEach((item) => {
        entryLiteModified.meta[item.lng] = JSON.parse(
          JSON.stringify(item.props)
        );
      });
      return entryLiteModified;
    },
    toModified(entry) {
      const entryModified: BCMSEntryModified = {
        _id: entry._id,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
        meta: {},
        templateId: entry._id,
        userId: entry.userId,
        content: {},
        status: entry.status,
      };
      entry.meta.forEach((item) => {
        entryModified.content[item.lng] = [];
        entryModified.meta[item.lng] = JSON.parse(JSON.stringify(item.props));
      });
      if (entry.content) {
        entry.content.forEach((item) => {
          entryModified.content[item.lng] = JSON.parse(
            JSON.stringify(item.props)
          );
        });
      }
      return entryModified;
    },
    fromModified(entryModified) {
      const entry: BCMSEntry = {
        _id: entryModified._id,
        createdAt: entryModified.createdAt,
        updatedAt: entryModified.updatedAt,
        meta: [],
        templateId: entryModified._id,
        userId: entryModified.userId,
        content: [],
        status: entryModified.status,
      };
      for (const key in entryModified.meta) {
        entry.meta.push({
          lng: key,
          props: entryModified.meta[key],
        });
      }
      if (entry.content) {
        for (const key in entryModified.content) {
          entry.content.push({
            lng: key,
            props: entryModified.content[key],
          });
        }
      }
      return entry;
    },
    contentSection: {
      createPrimary(type) {
        const value: BCMSPropQuill = {
          text: '',
          ops: [
            {
              insert: '',
            },
            {
              insert: '\n',
            },
          ],
        };
        return {
          array: false,
          label: '',
          name: uuidv4(),
          required: true,
          type,
          value,
        };
      },
      createWidget(widget) {
        const value: BCMSPropWidget = {
          _id: widget._id,
          props: JSON.parse(JSON.stringify(widget.props)),
        };
        return {
          array: false,
          label: '',
          name: uuidv4(),
          required: true,
          type: BCMSPropType.WIDGET,
          value,
        };
      },
    },
  };
}
