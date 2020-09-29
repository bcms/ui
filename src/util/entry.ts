import type { Entry, EntryLite, Language, Prop } from '@becomes/cms-sdk';
import type { EntryLiteModifiedMeta, EntryModifiedMeta } from '../types';

export interface EntryUtilPrototype {
  instance(
    lite: boolean,
    languages: Language[],
    props: Prop[]
  ): Entry | EntryLite;
  instanceModifiedMeta(
    lite: boolean,
    languages: Language[],
    props: Prop[]
  ): EntryModifiedMeta | EntryLiteModifiedMeta;
  liteToModifiedMeta(entryLite: EntryLite): EntryLiteModifiedMeta;
  toModifiedMeta(entry: Entry): EntryModifiedMeta;
  fromModifiedMeta(entry: EntryModifiedMeta): Entry;
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
          content: [],
        };
        return entry;
      }
    },
    instanceModifiedMeta(lite, languages, props: Prop[]) {
      if (lite) {
        const entryLiteModified: EntryLiteModifiedMeta = {
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
        const entryModified: EntryModifiedMeta = {
          _id: '',
          createdAt: 0,
          updatedAt: 0,
          meta: {},
          templateId: '',
          userId: '',
          content: [],
        };
        languages.forEach((lng) => {
          entryModified.meta[lng.code] = JSON.parse(
            JSON.stringify(props)
          ) as Prop[];
        });
        return entryModified;
      }
    },
    liteToModifiedMeta(entryLite) {
      const entryLiteModified: EntryLiteModifiedMeta = {
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
    toModifiedMeta(entry) {
      const entryModified: EntryModifiedMeta = {
        _id: entry._id,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
        meta: {},
        templateId: entry._id,
        userId: entry.userId,
        content: entry.content,
      };
      entry.meta.forEach((item) => {
        entryModified.meta[item.lng] = JSON.parse(JSON.stringify(item.props));
      });
      return entryModified;
    },
    fromModifiedMeta(entryModified) {
      const entry: Entry = {
        _id: entryModified._id,
        createdAt: entryModified.createdAt,
        updatedAt: entryModified.updatedAt,
        meta: [],
        templateId: entryModified._id,
        userId: entryModified.userId,
        content: entryModified.content,
      };
      for (const key in entry.meta) {
        entry.meta.push({
          lng: key,
          props: entryModified.meta[key],
        });
      }
      return entry;
    },
  };
}

export const EntryUtil = entryUtil();
