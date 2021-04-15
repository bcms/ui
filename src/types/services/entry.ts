import type {
  Entry,
  EntryLite,
  Language,
  Prop,
  PropType,
  Widget,
} from '@becomes/cms-sdk';
import type { EntryLiteModified, EntryModified } from '../entry';

export type BCMSEntryServicePrototype = {
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
};
