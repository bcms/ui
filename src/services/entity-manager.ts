import type { Prop } from '@becomes/cms-sdk';
import { GeneralService } from './general';
import { sdk } from './sdk';
import { StoreService } from './store';

export type EntityManagerSDKHandlerName =
  | 'template'
  | 'group'
  | 'widget'
interface Generic {
  _id: string;
}

function entityManagerService() {
  return {
    async create<T extends Generic>(
      handler: EntityManagerSDKHandlerName,
      label: string,
      desc: string
    ): Promise<T> {
      const buffer: T = (await sdk[handler].add({
        label,
        desc,
        singleEntry: false,
      })) as any;
      StoreService.update(handler, (value: T[]) => {
        value.push(buffer);
        return value;
      });
      const pathParts = window.location.pathname.split('/');
      GeneralService.navigate(
        [...pathParts.splice(0, pathParts.length - 1), buffer._id].join('/')
      );
      return buffer;
    },
    async update<T extends Generic>(
      handler: EntityManagerSDKHandlerName,
      id: string,
      label: string,
      desc: string
    ): Promise<T> {
      const buffer: T = (await sdk[handler].update({
        _id: id,
        label,
        desc,
      })) as any;
      StoreService.update(handler, (value: T[]) => {
        for (const i in value) {
          if (value[i]._id === buffer._id) {
            value[i] = buffer;
            break;
          }
        }
        return value;
      });
      return buffer;
    },
    async delete(
      handler: EntityManagerSDKHandlerName,
      id: string
    ): Promise<void> {
      await sdk[handler].deleteById(id);
      StoreService.update(handler, (value: any[]) => {
        return value.filter((e) => e._id !== id);
      });
      const pathParts = window.location.pathname.split('/');
      GeneralService.navigate(
        [...pathParts.splice(0, pathParts.length - 1), '-'].join('/')
      );
    },
    async addProp<T extends Generic>(
      handler: EntityManagerSDKHandlerName,
      id: string,
      prop: Prop
    ): Promise<T> {
      const buffer: T = (await sdk[handler].update({
        _id: id,
        propChanges: [
          {
            add: prop,
          },
        ],
      })) as any;
      StoreService.update(handler, (value: T[]) => {
        for (const i in value) {
          if (value[i]._id === buffer._id) {
            value[i] = buffer;
            break;
          }
        }
        return value;
      });
      return buffer;
    },
    async updateProp<T extends Generic>(
      handler: EntityManagerSDKHandlerName,
      id: string,
      props: Prop[],
      data: {
        name: string;
        label: string;
        required: boolean;
        move: number;
      }
    ): Promise<T> {
      const prop = props.find((e) => e.name === data.name);
      if (!prop) {
        throw Error(`Failed to find a target property "${data.name}".`);
        return;
      }
      const buffer: T = (await sdk[handler].update({
        _id: id,
        propChanges: [
          {
            update: {
              label: {
                new: data.label,
                old: prop.label,
              },
              move: data.move,
              required: data.required,
            },
          },
        ],
      })) as any;
      StoreService.update(handler, (value: T[]) => {
        for (const i in value) {
          if (value[i]._id === buffer._id) {
            value[i] = buffer;
            break;
          }
        }
        return value;
      });
      return buffer;
    },
    async removeProp<T extends Generic>(
      handler: EntityManagerSDKHandlerName,
      id: string,
      prop: Prop
    ): Promise<T> {
      const buffer: T = (await sdk[handler].update({
        _id: id,
        propChanges: [
          {
            remove: prop.name,
          },
        ],
      })) as any;
      StoreService.update(handler, (value: T[]) => {
        for (const i in value) {
          if (value[i]._id === buffer._id) {
            value[i] = buffer;
            break;
          }
        }
        return value;
      });
      return buffer;
    },
  };
}

export const EntityManagerService = entityManagerService();
