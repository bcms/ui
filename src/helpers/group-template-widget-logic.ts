import { BCMSGroup, BCMSTemplate, BCMSWidget } from '@becomes/cms-sdk/types';
import { BCMSGTWLogicFunction, BCMSGTWLogicPrototype } from '../types';
import { MutationTypes, useStore } from '../store';
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
      ? MutationTypes.group_set
      : type === 'template'
      ? MutationTypes.template_set
      : MutationTypes.widget_set;
  const removeMutation =
    type === 'group'
      ? MutationTypes.group_remove
      : type === 'template'
      ? MutationTypes.template_remove
      : MutationTypes.widget_remove;
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
      const prop = data.props.find((e) => e.name === data.data.name);
      if (!prop) {
        throw Error(`Failed to find a target property "${data.data.name}".`);
      }
      await window.bcms.services.error.wrapper(
        async () => {
          return (await handler.update({
            _id: data.id,
            propChanges: [
              {
                update: {
                  label: {
                    new: data.data.label,
                    old: prop.label,
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
