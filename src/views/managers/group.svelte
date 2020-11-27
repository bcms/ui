<script lang="ts">
  import { onMount, onDestroy, beforeUpdate } from 'svelte';
  import type { Group, Prop, Template, Widget } from '@becomes/cms-sdk';
  import {
    Layout,
    ManagerLayout,
    EntityInfo,
    EntityEditor,
    AddPropModal,
    NoEntities,
    NameDescModal,
    WhereIsItUsedModal,
    Spinner,
  } from '../../components';
  import {
    GeneralService,
    sdk,
    StoreService,
    EntityManagerService,
    popup,
  } from '../../services';
  import type { WhereIsItUsedItem } from '../../types';

  export let id: string = undefined;

  const groupStoreUnsub = StoreService.subscribe('group', async (value) => {
    if (value) {
      groups = value;
      if (group) {
        group = groups.find((e) => e._id === group._id);
      }
    }
  });
  const pathUnsub = StoreService.subscribe('path', async (value) => {
    const link = value as string;
    if (link.startsWith('/dashboard/group/editor')) {
      const tempId = link.split('/')[link.split('/').length - 1];
      if (tempId === '-') {
        group = groups[0];
      } else {
        id = tempId;
        group = groups.find((e) => e._id === id);
      }
    }
  });
  let groups: Group[] = [];
  let group: Group;
  let editGroupData = {
    label: '',
    desc: '',
  };
  let idBuffer = '' + id;
  let showSpinner = false;
  let whereIsItUsedItems: WhereIsItUsedItem[] = [];

  async function create(label: string, desc: string) {
    await GeneralService.errorWrapper(
      async () => {
        await EntityManagerService.create('group', label, desc);
      },
      async () => {
        popup.success('Group successfully created.');
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
        popup.success('Group updated successfully.');
      }
    );
  }
  async function remove() {
    if (confirm('Are you sure you want to delete the group?')) {
      await GeneralService.errorWrapper(
        async () => {
          await EntityManagerService.delete('group', group._id);
        },
        async () => {
          popup.success('Group was successfully deleted.');
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
        popup.success('Property successfully added.');
      }
    );
  }
  async function updateProp(data: {
    name: string;
    label: string;
    required: boolean;
    move: number;
  }) {
    console.log(data);
    await GeneralService.errorWrapper(
      async () => {
        console.log(group.props);
        return EntityManagerService.updateProp(
          'group',
          group._id,
          group.props,
          data
        );
      },
      async (grp: Group) => {
        console.log(grp);
        group = grp;
        popup.success('Property successfully updated.');
      }
    );
  }
  async function removeProp(prop: Prop) {
    if (confirm('Are you sure you want to delete the property.')) {
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
          popup.success('Property successfully deleted.');
        }
      );
    }
  }
  async function whereIsItUsed() {
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
    if ((!id || id === '-') && groups.length > 0) {
      group = groups[0];
      GeneralService.navigate(`/dashboard/group/editor/${groups[0]._id}`);
    } else {
      group = groups.find((e) => e._id === id);
    }
  });
  beforeUpdate(async () => {
    if (idBuffer !== id) {
      idBuffer = '' + id;
      if (id === '-') {
        group = groups[0];
      } else {
        group = groups.find((e) => e._id === id);
      }
    }
  });
  onDestroy(() => {
    groupStoreUnsub();
    pathUnsub();
  });
</script>

<Layout>
  <div class="gm">
    <ManagerLayout
      label="Groups"
      actionText="Add new Group"
      on:action={() => {
        StoreService.update('NameDescModal', true);
      }}
      items={groups.map((e, i) => {
        return { name: e.label, link: `/dashboard/group/editor/${e._id}`, selected: group && group._id === e._id };
      })}>
      {#if groups.length > 0}
        {#if group}
          <EntityInfo
            id={group._id}
            createdAt={group.createdAt}
            updatedAt={group.updatedAt}
            name={group.label}
            description={group.desc}
            whereIsItUsed={true}
            on:search={() => {
              whereIsItUsed();
            }}
            on:edit={() => {
              editGroupData.label = group.label;
              editGroupData.desc = group.desc;
              StoreService.update('NameDescModal', true);
            }}
            on:delete={() => {
              remove();
            }} />
          <EntityEditor
            sourceComponent="group"
            props={group.props}
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
            }} />
        {/if}
      {:else}
        <NoEntities
          name="Groups"
          on:action={() => {
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
    title="Create/Update a group"
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
    title="Where this group is used"
    items={whereIsItUsedItems}
    on:cancel={() => {
      whereIsItUsedItems = [];
    }}
    on:done={() => {
      whereIsItUsedItems = [];
    }} />
  <Spinner show={showSpinner} />
</Layout>
