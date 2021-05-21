import { BCMSGroup, BCMSTemplate, BCMSWidget } from '@becomes/cms-sdk/types';
import {
  BCMSGTWLogicFunction,
  BCMSGTWLogicPrototype,
  BCMSStoreMutationTypes,
} from '../types';
import { useStore } from '../store';
import { useRouter } from 'vue-router';

export const BCMSGTWLogic: BCMSGTWLogicFunction = <
  T extends BCMSGroup | BCMSTemplate | BCMSWidget
>(
  type: 'group' | 'template' | 'widget'
) => {
  const store = useStore();
  const router = useRouter();
  const handler = window.bcms.sdk[type];
  const setMutation =
    type === 'group'
      ? BCMSStoreMutationTypes.group_set
      : type === 'template'
      ? BCMSStoreMutationTypes.template_set
      : BCMSStoreMutationTypes.widget_set;
  const removeMutation =
    type === 'group'
      ? BCMSStoreMutationTypes.group_remove
      : type === 'template'
      ? BCMSStoreMutationTypes.template_remove
      : BCMSStoreMutationTypes.widget_remove;
  const self: BCMSGTWLogicPrototype<T> = {
    async create(data) {
      await window.bcms.services.error.wrapper(
        async () => {
          return (await handler.create({
            label: data.label,
            desc: data.desc,
            previewImage: data.previewImage ? data.previewImage : '',
            previewScript: data.previewScript ? data.previewScript : '',
            previewStyle: data.previewStyle ? data.previewStyle : '',
            singleEntry: false,
          })) as T;
        },
        async (result) => {
          store.commit(setMutation, result);
          await router.push(`/dashboard/${type}/${result._id}`);
        }
      );
    },
    async update(data) {
      await window.bcms.services.error.wrapper(
        async () => {
          return (await handler.update({
            _id: data._id,
            label: data.label,
            desc: data.desc,
            previewImage: data.previewImage ? data.previewImage : '',
            previewScript: data.previewScript ? data.previewScript : '',
            previewStyle: data.previewStyle ? data.previewStyle : '',
          })) as T;
        },
        async (result) => {
          store.commit(setMutation, result);
        }
      );
    },
    async delete(data) {
      await window.bcms.services.error.wrapper(
        async () => {
          await handler.deleteById(data._id);
        },
        async () => {
          store.commit(removeMutation, data);
        }
      );
    },
    async addProp(_id, prop) {
      await window.bcms.services.error.wrapper(
        async () => {
          return (await handler.update({
            _id,
            propChanges: [
              {
                add: prop,
              },
            ],
          })) as T;
        },
        async (result) => {
          store.commit(setMutation, result);
        }
      );
    },
    async updateProp(data) {
      await window.bcms.services.error.wrapper(
        async () => {
          return (await handler.update({
            _id: data.id,
            propChanges: [
              {
                update: {
                  label: {
                    new: data.data.label,
                    old: data.prop.label,
                  },
                  move: data.data.move,
                  required: data.data.required,
                  enumItems: data.data.enumItems,
                },
              },
            ],
          })) as T;
        },
        async (result) => {
          store.commit(setMutation, result);
        }
      );
    },
    async removeProp(id, prop) {
      await window.bcms.services.error.wrapper(
        async () => {
          return (await handler.update({
            _id: id,
            propChanges: [
              {
                remove: prop.name,
              },
            ],
          })) as T;
        },
        async (result) => {
          store.commit(setMutation, result);
        }
      );
    },
  };
  return self;
};
