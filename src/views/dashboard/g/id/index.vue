<script lang="tsx">
import { Teleport } from 'vue';
import {
  BCMSPropEnumData,
  BCMSPropType,
  BCMSGroup,
} from '@becomes/cms-sdk/types';
import { computed, defineComponent, onMounted, ref } from '@vue/runtime-core';
import {
  BCMSButton,
  BCMSManagerInfo,
  BCMSPropsViewer,
  BCMSManagerNav,
} from '../../../../components';
import { BCMSWhereIsItUsedItem } from '../../../../types';
import { useRoute, useRouter } from 'vue-router';

const lastState = {
  gid: '',
};

const component = defineComponent({
  setup() {
    const throwable = window.bcms.util.throwable;
    const meta = window.bcms.meta;
    const store = window.bcms.vue.store;
    const router = useRouter();
    const route = useRoute();
    const mounted = ref(false);
    const group = computed<{
      items: BCMSGroup[];
      target?: BCMSGroup;
    }>(() => {
      const target = store.getters.group_findOne(
        (e) => e.cid === (route.params.gid as string)
      );
      if (target) {
        meta.set({
          title: target.label + ' group',
        });
      }
      return {
        items: store.getters.group_items,
        target,
      };
    });

    const logic = {
      createNewItem() {
        window.bcms.modal.addUpdate.group.show({
          title: 'Create new group',
          groupNames: group.value.items.map((e) => e.name),
          mode: 'add',
          async onDone(data) {
            await throwable(
              async () => {
                return await window.bcms.sdk.group.create({
                  label: data.label,
                  desc: data.desc,
                });
              },
              async (result) => {
                await router.push(`/dashboard/g/${result.cid}`);
              }
            );
          },
        });
      },
      async remove() {
        const target = group.value.target as BCMSGroup;
        if (
          await window.bcms.confirm(
            `Delete "${target.label}" Group`,
            `Are you sure you want to delete <strong>${target.label}</strong>` +
              ' group? This action is irreversible and the group will be' +
              ' removed from all entities.',
            target.name
          )
        ) {
          await throwable(
            async () => {
              await window.bcms.sdk.group.deleteById(target._id);
            },
            async () => {
              lastState.gid = group.value.items[0]
                ? group.value.items[0].cid
                : '';
              await router.push({
                path: `/dashboard/g/${lastState.gid}`,
                replace: true,
              });
            }
          );
        }
      },
      edit() {
        const target = group.value.target as BCMSGroup;
        window.bcms.modal.addUpdate.group.show({
          mode: 'update',
          label: target.label,
          title: `Edit ${target.label} Group`,
          desc: target.desc,
          groupNames: group.value.items.map((e) => e.name),
          async onDone(data) {
            await throwable(async () => {
              await window.bcms.sdk.group.update({
                _id: target._id,
                label: data.label,
                desc: data.desc,
              });
            });
          },
        });
      },
      prop: {
        add() {
          const target = group.value.target as BCMSGroup;
          window.bcms.modal.props.add.show({
            takenPropNames: target.props.map((e) => e.name),
            async onDone(data) {
              await throwable(async () => {
                await window.bcms.sdk.group.update({
                  _id: target._id,
                  propChanges: [
                    {
                      add: data,
                    },
                  ],
                });
              });
            },
          });
        },
        async move(data: { direction: -1 | 1; index: number }) {
          const target = group.value.target as BCMSGroup;
          const prop = target.props[data.index];
          await throwable(async () => {
            await window.bcms.sdk.group.update({
              _id: target._id,
              propChanges: [
                {
                  update: {
                    id: prop.id,
                    label: prop.label,
                    required: prop.required,
                    move: data.direction,
                  },
                },
              ],
            });
          });
        },
        async remove(index: number) {
          const target = group.value.target as BCMSGroup;
          const prop = target.props[index];
          if (
            await window.bcms.confirm(
              `Remove property ${prop.label}`,
              `Are you sure you want to delete property ${prop.label}?`
            )
          ) {
            await throwable(async () => {
              await window.bcms.sdk.group.update({
                _id: target._id,
                propChanges: [
                  {
                    remove: prop.id,
                  },
                ],
              });
            });
          }
        },
        edit(index: number) {
          const target = group.value.target as BCMSGroup;
          const prop = target.props[index];
          window.bcms.modal.props.edit.show({
            title: `Edit property ${prop.name}`,
            prop,
            takenPropNames: target.props
              .filter((_e, i) => i !== index)
              .map((e) => e.name),
            async onDone(data) {
              await throwable(async () => {
                await window.bcms.sdk.group.update({
                  _id: target._id,
                  propChanges: [
                    {
                      update: {
                        id: prop.id,
                        label: data.prop.label,
                        required: data.prop.required,
                        move: 0,
                        enumItems:
                          prop.type === BCMSPropType.ENUMERATION
                            ? (data.prop.defaultData as BCMSPropEnumData).items
                            : undefined,
                      },
                    },
                  ],
                });
              });
            },
          });
        },
      },
    };
    async function redirect() {
      if (!lastState.gid && route.params.gid) {
        lastState.gid = route.params.gid as string;
      }
      const targetId = lastState.gid ? lastState.gid : group.value.items[0].cid;
      if (targetId) {
        await router.push({
          path: '/dashboard/g/' + targetId,
          replace: true,
        });
      }
    }
    async function whereIsItUsed() {
      await throwable(
        async () => {
          const result = await window.bcms.sdk.group.whereIsItUsed(
            (group.value.target as BCMSGroup)._id
          );
          const templates = await window.bcms.sdk.template.getMany(
            result.templateIds.map((e) => e._id)
          );
          const groups = await window.bcms.sdk.group.getMany(
            result.groupIds.map((e) => e._id)
          );
          const widgets = await window.bcms.sdk.widget.getMany(
            result.widgetIds.map((e) => e._id)
          );
          return {
            templates,
            groups,
            widgets,
          };
        },
        async (result) => {
          const items: BCMSWhereIsItUsedItem[] = [];
          for (let i = 0; i < result.templates.length; i++) {
            const template = result.templates[i];
            items.push({
              type: 'template',
              label: template.label,
              id: template.cid,
              template: {
                id: template.cid,
                label: template.label,
              },
            });
          }
          for (let i = 0; i < result.groups.length; i++) {
            const grp = result.groups[i];
            items.push({
              type: 'group',
              label: grp.label,
              id: grp.cid,
            });
          }
          for (let i = 0; i < result.widgets.length; i++) {
            const widget = result.widgets[i];
            items.push({
              type: 'widget',
              label: widget.label,
              id: widget.cid,
            });
          }
          window.bcms.modal.whereIsItUsed.show({
            title: `${group.value.target?.label} is used in`,
            items,
          });
        }
      );
    }

    onMounted(async () => {
      if (!group.value.target) {
        await throwable(async () => {
          await window.bcms.sdk.group.getAll();
        });
        if (group.value.items.length > 0) {
          await redirect();
        }
      } else {
        await redirect();
      }
      mounted.value = true;
    });

    return () => (
      <div>
        {group.value.target && mounted.value ? (
          <Teleport to="#managerNav">
            <BCMSManagerNav
              label="Groups"
              actionText="Add new group"
              items={group.value.items.map((e) => {
                return {
                  name: e.label,
                  link: `/dashboard/g/${e.cid}`,
                  selected: group.value.target?.cid === e.cid,
                  onClick: () => {
                    lastState.gid = e.cid;
                    router.push({
                      path: `/dashboard/g/${e.cid}`,
                      replace: true,
                    });
                  },
                };
              })}
              onAction={logic.createNewItem}
            />
          </Teleport>
        ) : (
          ''
        )}
        {group.value.items.length > 0 ? (
          group.value.target ? (
            <>
              <BCMSManagerInfo
                id={group.value.target._id}
                name={group.value.target.label}
                createdAt={group.value.target.createdAt}
                updatedAt={group.value.target.updatedAt}
                onEdit={logic.edit}
                description={group.value.target.desc}
                key={group.value.target._id}
              />
              <BCMSPropsViewer
                name={'group'}
                props={group.value.target.props}
                onDeleteEntity={logic.remove}
                onAdd={logic.prop.add}
                onPropMove={logic.prop.move}
                onPropDelete={logic.prop.remove}
                onPropEdit={logic.prop.edit}
                whereIsItUsedAvailable={true}
                onWhereIsItUsed={whereIsItUsed}
              />
            </>
          ) : (
            ''
          )
        ) : (
          <div class="no-entities">
            <div class="no-entities--title">
              There are no entities available.
            </div>
            <BCMSButton onClick={logic.createNewItem}>Add new group</BCMSButton>
          </div>
        )}
      </div>
    );
  },
});
export default component;
</script>
