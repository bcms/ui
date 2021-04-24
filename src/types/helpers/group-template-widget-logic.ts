import type {
  BCMSGroup,
  BCMSTemplate,
  BCMSWidget,
  BCMSProp,
} from '@becomes/cms-sdk/types';

export type BCMSGTWLogicFunction = <
  T extends BCMSGroup | BCMSTemplate | BCMSWidget
>(
  type: 'group' | 'template' | 'widget'
) => BCMSGTWLogicPrototype<T>;

export interface BCMSGTWLogicPrototype<
  T extends BCMSGroup | BCMSTemplate | BCMSWidget
> {
  create(data: {
    label: string;
    desc: string;
    previewImage?: string;
    previewScript?: string;
    previewStyle?: string;
  }): Promise<void>;
  update(data: {
    _id: string;
    label: string;
    desc: string;
    previewImage?: string;
    previewScript?: string;
    previewStyle?: string;
  }): Promise<void>;
  delete(item: T): Promise<void>;
  addProp(id: string, prop: BCMSProp): Promise<void>;
  updateProp(data: {
    id: string;
    props: BCMSProp[];
    data: {
      name: string;
      label: string;
      required: boolean;
      move: number;
      enumItems?: string[];
    };
  }): Promise<void>;
  removeProp(id: string, prop: BCMSProp): Promise<void>;
}
