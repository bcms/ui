<script lang="ts">
  import { onMount, onDestroy, beforeUpdate } from 'svelte';
  import type { Group, Prop, Template, Widget } from '@becomes/cms-sdk';
  import {
    ManagerLayout,
    ManagerInfo,
    ManagerPropsEditor,
    AddPropModal,
    NoEntities,
    NameDescModal,
    WhereIsItUsedModal,
    Spinner,
Meta,
  } from '../../components';
  import {
    GeneralService,
    sdk,
    StoreService,
    EntityManagerService,
    NotificationService,
    ConfirmService,
  } from '../../services';
  import type { WhereIsItUsedItem } from '../../types';
  import { Router } from '../../router';

  export let params: {
    id?: string;
  } = {};

  const groupStoreUnsub = StoreService.subscribe('group', async (value) => {
    if (value) {
      groups = value;
      if (group) {
        group = groups.find((e) => e._id === group._id);
      }
    }
  });
  let groups: Group[] = [];
  let group: Group;
  let editGroupData = {
    label: '',
    desc: '',
    title: '',
  };
  let idBuffer = '' + params.id;
  let showSpinner = false;
  let whereIsItUsedItems: WhereIsItUsedItem[] = [];

  async function create(label: string, desc: string) {
    await GeneralService.errorWrapper(
      async () => {
        await EntityManagerService.create('group', label, desc);
      },
      async () => {
        NotificationService.success('Group successfully created.');
      }
    );
  }
  async function update(label: string, desc: string) {
    await GeneralService.errorWrapper(
      async () => {
        return await EntityManagerService.update<Group>(
          'group',
          group._id,
          label,
          desc
        );
      },
      async (grp: Group) => {
        group = grp;
        NotificationService.success('Group updated successfully.');
      }
    );
  }
  async function remove() {
    if (
      await ConfirmService.confirm(
        `Delete ${group.label} Group`,
        `Are you sure you want to delete <strong>${group.label}</strong> group?
        If deleted, the group will be removed from all templates, widgets
        and entries that are using it.`,
        group.name
      )
    ) {
      await GeneralService.errorWrapper(
        async () => {
          await EntityManagerService.delete('group', group._id);
        },
        async () => {
          NotificationService.success('Group was successfully deleted.');
        }
      );
    }
  }
  async function addProp(prop: Prop) {
    await GeneralService.errorWrapper(
      async () => {
        return await EntityManagerService.addProp('group', group._id, prop);
      },
      async (grp: Group) => {
        group = grp;
        NotificationService.success('Property successfully added.');
      }
    );
  }
  async function updateProp(data: {
    name: string;
    label: string;
    required: boolean;
    move: number;
  }) {
    await GeneralService.errorWrapper(
      async () => {
        return EntityManagerService.updateProp(
          'group',
          group._id,
          group.props,
          data
        );
      },
      async (grp: Group) => {
        group = grp;
        NotificationService.success('Property successfully updated.');
      }
    );
  }
  async function removeProp(prop: Prop) {
    if (
      await ConfirmService.confirm(
        'Delete Property',
        `Are you sure you want to delete "${prop.label}" property?`
      )
    ) {
      await GeneralService.errorWrapper(
        async () => {
          return await EntityManagerService.removeProp(
            'group',
            group._id,
            prop
          );
        },
        async (grp: Group) => {
          group = grp;
          NotificationService.success('Property successfully deleted.');
        }
      );
    }
  }
  async function search() {
    showSpinner = true;
    const result: {
      templates: Template[];
      groups: Group[];
      widgets: Widget[];
    } = await GeneralService.errorWrapper(
      async () => {
        return await sdk.group.whereIsItUsed(group._id);
      },
      async (value: {
        templates: Template[];
        groups: Group[];
        widgets: Widget[];
      }) => {
        return value;
      }
    );
    if (result) {
      whereIsItUsedItems = [];
      for (const i in result.templates) {
        const item = result.templates[i];
        whereIsItUsedItems.push({
          id: item._id,
          label: item.label,
          type: 'template',
        });
      }
      for (const i in result.groups) {
        const item = result.groups[i];
        whereIsItUsedItems.push({
          id: item._id,
          label: item.label,
          type: 'group',
        });
      }
      for (const i in result.widgets) {
        const item = result.widgets[i];
        whereIsItUsedItems.push({
          id: item._id,
          label: item.label,
          type: 'widget',
        });
      }
      StoreService.update('WhereIsItUsedModal', true);
    }
    showSpinner = false;
  }

  onMount(async () => {
    StoreService.update('group', await sdk.group.getAll());
    if ((!params.id || params.id === '-') && groups.length > 0) {
      Router.navigate(`/dashboard/group/editor/${groups[0]._id}`, {
        replace: true,
      });
      return;
    } else {
      group = groups.find((e) => e._id === params.id);
    }
  });
  beforeUpdate(async () => {
    if (idBuffer !== params.id) {
      idBuffer = '' + params.id;
      if (params.id === '-') {
        group = groups[0];
      } else {
        group = groups.find((e) => e._id === params.id);
      }
    }
  });
  onDestroy(() => {
    groupStoreUnsub();
  });
</script>

<Meta title={group ? group.label : 'Groups'} />
<div class="gm">
  <ManagerLayout
    label="Groups"
    actionText="Add new group"
    on:action={() => {
      editGroupData.title = 'Add new group';
      StoreService.update('NameDescModal', true);
    }}
    items={groups.map((e) => {
      return { name: e.label, link: `/dashboard/group/editor/${e._id}`, selected: group && group._id === e._id };
    })}>
    {#if groups.length > 0}
      {#if group}
        <ManagerInfo
          id={group._id}
          createdAt={group.createdAt}
          updatedAt={group.updatedAt}
          name={group.label}
          description={group.desc}
          on:edit={() => {
            editGroupData.label = group.label;
            editGroupData.desc = group.desc;
            editGroupData.title = 'Edit group';
            StoreService.update('NameDescModal', true);
          }} />
        <ManagerPropsEditor
          sourceComponent="group"
          props={group.props}
          whereIsItUsed={true}
          on:edit={(event) => {
            updateProp(event.detail);
          }}
          on:deleteEntity={() => {
            remove();
          }}
          on:deleteProp={(event) => {
            removeProp(event.detail);
          }}
          on:add={() => {
            StoreService.update('AddPropModal', true);
          }}
          on:search={search} />
      {/if}
    {:else}
      <NoEntities
        name="Group"
        on:action={() => {
          editGroupData.title = 'Add new group';
          StoreService.update('NameDescModal', true);
        }} />
    {/if}
  </ManagerLayout>
</div>
<AddPropModal
  excludeGroups={group ? [group._id] : []}
  on:done={(event) => {
    addProp(event.detail);
  }} />
<NameDescModal
  title={editGroupData.title}
  name={editGroupData.label}
  desc={editGroupData.desc}
  on:cancel={() => {
    editGroupData.label = '';
    editGroupData.desc = '';
  }}
  on:done={(event) => {
    if (editGroupData.label !== '') {
      editGroupData.label = '';
      editGroupData.desc = '';
      update(event.detail.name, event.detail.desc);
    } else {
      create(event.detail.name, event.detail.desc);
    }
  }} />
<WhereIsItUsedModal
  title="Where is this group used"
  items={whereIsItUsedItems}
  on:cancel={() => {
    whereIsItUsedItems = [];
  }}
  on:done={() => {
    whereIsItUsedItems = [];
  }} />
<Spinner show={showSpinner} />
