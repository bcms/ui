import * as uuid from 'uuid';
import {
  Entry,
  EntryLite,
  Language,
  Prop,
  PropQuill,
  PropType,
  PropWidget,
  Widget,
} from '@becomes/cms-sdk';
import type { EntryLiteModified, EntryModified } from '../types';

export interface EntryUtilPrototype {
  instance(
    lite: boolean,
    languages: Language[],
    props: Prop[]
  ): Entry | EntryLite;
  instanceModified(
    lite: boolean,
    languages: Language[],
    props: Prop[]
  ): EntryModified | EntryLiteModified;
  liteToModified(entryLite: EntryLite): EntryLiteModified;
  toModified(entry: Entry): EntryModified;
  fromModified(entry: EntryModified): Entry;
  contentSection: {
    createPrimary(type: PropType): Prop;
    createWidget(widget: Widget): Prop;
  };
}

function entryUtil(): EntryUtilPrototype {
  return {
    instance(lite, languages, props) {
      if (lite) {
        const entryLite: EntryLite = {
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
        return entryLite;
      } else {
        const entry: Entry = {
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
        return entry;
      }
    },
    instanceModified(lite, languages, props: Prop[]) {
      if (lite) {
        const entryLiteModified: EntryLiteModified = {
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
          ) as Prop[];
        });
        return entryLiteModified;
      } else {
        const entryModified: EntryModified = {
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
          ) as Prop[];
        });
        return entryModified;
      }
    },
    liteToModified(entryLite) {
      const entryLiteModified: EntryLiteModified = {
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
      const entryModified: EntryModified = {
        _id: entry._id,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
        meta: {},
        templateId: entry._id,
        userId: entry.userId,
        content: {},
      };
      entry.meta.forEach((item) => {
        entryModified.content[item.lng] = [];
        entryModified.meta[item.lng] = JSON.parse(JSON.stringify(item.props));
      });
      entry.content.forEach((item) => {
        entryModified.content[item.lng] = JSON.parse(
          JSON.stringify(item.props)
        );
      });
      return entryModified;
    },
    fromModified(entryModified) {
      const entry: Entry = {
        _id: entryModified._id,
        createdAt: entryModified.createdAt,
        updatedAt: entryModified.updatedAt,
        meta: [],
        templateId: entryModified._id,
        userId: entryModified.userId,
        content: [],
      };
      for (const key in entryModified.meta) {
        entry.meta.push({
          lng: key,
          props: entryModified.meta[key],
        });
      }
      for (const key in entryModified.content) {
        entry.content.push({
          lng: key,
          props: entryModified.content[key],
        });
      }
      return entry;
    },
    contentSection: {
      createPrimary(type: PropType) {
        const value: PropQuill = {
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
          name: uuid.v4(),
          required: true,
          type,
          value,
        };
      },
      createWidget(widget: Widget) {
        const value: PropWidget = {
          _id: widget._id,
          props: JSON.parse(JSON.stringify(widget.props)),
        };
        return {
          array: false,
          label: '',
          name: uuid.v4(),
          required: true,
          type: PropType.WIDGET,
          value,
        };
      },
    },
  };
}

export const EntryUtil = entryUtil();
