<script lang="tsx">
import { computed, defineComponent, onMounted, Teleport } from 'vue';
import {
  BCMSGroup,
  BCMSPropType,
  BCMSPropEnum,
  BCMSProp,
} from '@becomes/cms-sdk/types';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from '../../../../store';
import {
  BCMSButton,
  BCMSManagerInfo,
  BCMSManagerNav,
  BCMSPropsViewer,
  BCMSEmptyView,
} from '../../../../components';
import { BCMSStoreMutationTypes } from '../../../../types';

const lastState = {
  id: '',
};

const component = defineComponent({
  setup() {
    const gtwHelper = window.bcms.helpers.gtw<BCMSGroup>('group');
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const group = computed<{
      items: BCMSGroup[];
      target: BCMSGroup | undefined;
    }>(() => {
      const grps = store.getters.group_items;
      const target = grps.find((e) => e._id === route.params.id);
      if (target) {
        window.bcms.services.headMeta.set({ title: target.label });
      }
      return {
        items: grps,
        target,
      };
    });

    const logic = {
      createNewItem() {
        window.bcms.services.modal.addUpdate.group.show({
          title: 'Create new group',
          groupNames: group.value.items.map((e) => e.name),
          mode: 'add',
          async onDone(data) {
            await gtwHelper.create(data);
          },
        });
      },
      async remove() {
        if (!group.value.target) {
          return;
        }
        if (
          await window.bcms.services.confirm(
            `Delete "${group.value.target.label}" Group`,
            `Are you sure you want to delete <strong>${group.value.target.label}</strong>` +
              ' group? This action is irreversible and group will be removed from all ' +
              'entries and widgets.',
            group.value.target.name
          )
        ) {
          await gtwHelper.delete(group.value.target);
        }
      },
      edit() {
        const grp = group.value.target as BCMSGroup;
        window.bcms.services.modal.addUpdate.group.show({
          mode: 'update',
          label: grp.label,
          title: `Edit ${grp.label} Group`,
          desc: grp.desc,
          groupNames: group.value.items.map((e) => e.name),
          async onDone(data) {
            await gtwHelper.update({
              _id: grp._id,
              label: data.label,
              desc: data.desc,
            });
          },
        });
      },
      prop: {
        add() {
          if (!group.value.target) {
            return;
          }
          window.bcms.services.modal.props.add.show({
            takenPropNames: group.value.target.props.map((e) => e.name),
            onDone(data) {
              const grp = group.value.target as BCMSGroup;
              gtwHelper.addProp(grp._id, data);
            },
          });
        },
        async move(data: { direction: -1 | 1; index: number }) {
          const grp = group.value.target as BCMSGroup;
          const prop = grp.props[data.index];
          await gtwHelper.updateProp({
            id: grp._id,
            prop,
            data: {
              label: prop.label,
              move: data.direction,
              required: prop.required,
            },
          });
        },
        async remove(index: number) {
          const grp = group.value.target as BCMSGroup;
          const prop = grp.props[index];
          if (
            await window.bcms.services.confirm(
              `Remove property ${prop.label}`,
              `Are you sure you want to delete property ${prop.label}?`
            )
          ) {
            await gtwHelper.removeProp(grp._id, prop);
          }
        },
        async edit(index: number) {
          const grp = group.value.target as BCMSGroup;
          const prop: BCMSProp = JSON.parse(JSON.stringify(grp.props[index]));
          window.bcms.services.modal.props.edit.show({
            title: `Edit property ${prop.name}`,
            prop,
            takenPropNames: grp.props
              .filter((_e, i) => i !== index)
              .map((e) => e.name),
            async onDone(data) {
              await gtwHelper.updateProp({
                id: grp._id,
                prop: prop,
                data: {
                  required: data.prop.required,
                  move: 0,
                  label: data.prop.label,
                  enumItems:
                    data.prop.type === BCMSPropType.ENUMERATION
                      ? (data.prop.value as BCMSPropEnum).items
                      : undefined,
                },
              });
            },
          });
        },
      },
    };
    async function redirect() {
      if (!lastState.id && route.params.id) {
        lastState.id = route.params.id as string;
      }
      const targetId = lastState.id ? lastState.id : group.value.items[0]._id;
      if (targetId) {
        await router.push({
          path: '/dashboard/group/' + targetId,
          replace: true,
        });
      }
    }

    onMounted(async () => {
      window.bcms.services.headMeta.set({ title: 'Groups' });
      if (!group.value.target) {
        await window.bcms.services.error.wrapper(
          async () => {
            return window.bcms.sdk.group.getAll();
          },
          async (result) => {
            store.commit(BCMSStoreMutationTypes.group_set, result);
          }
        );
        if (group.value.items.length > 0) {
          await redirect();
        }
      } else {
        await redirect();
      }
    });

    return () => (
      <div>
        {group.value.target ? (
          <Teleport to="#managerNav">
            <BCMSManagerNav
              label="Groups"
              actionText="Add new group"
              items={group.value.items.map((e) => {
                return {
                  name: e.label,
                  link: `/dashboard/group/${e._id}`,
                  onClick: () => {
                    lastState.id = e._id;
                    router.push({
                      path: `/dashboard/group/${e._id}`,
                      replace: true,
                    });
                  },
                  selected: group.value.target?._id === e._id,
                };
              })}
              onAction={logic.createNewItem}
            />
          </Teleport>
        ) : (
          ''
        )}
        {group.value.items.length > 0 ? (
          <>
            {group.value.target ? (
              <>
                <BCMSManagerInfo
                  id={group.value.target._id}
                  name={group.value.target.label}
                  createdAt={group.value.target.createdAt}
                  updatedAt={group.value.target.updatedAt}
                  onEdit={logic.edit}
                />
                <BCMSPropsViewer
                  props={group.value.target.props}
                  onDeleteEntity={logic.remove}
                  onAdd={logic.prop.add}
                  onPropMove={logic.prop.move}
                  onPropDelete={logic.prop.remove}
                  onPropEdit={logic.prop.edit}
                />
              </>
            ) : (
              ''
            )}
          </>
        ) : (
          <BCMSEmptyView message="Create your first group.">
            <BCMSButton onClick={logic.createNewItem}>Add new group</BCMSButton>
          </BCMSEmptyView>
        )}
      </div>
    );
  },
});
export default component;
</script>
