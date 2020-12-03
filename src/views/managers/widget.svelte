<script lang="ts">
  import { onMount, onDestroy, beforeUpdate } from 'svelte';
  import type { Widget, Prop, EntryLite } from '@becomes/cms-sdk';
  import {
    Layout,
    ManagerLayout,
    ManagerInfo,
    ManagerPropsEditor,
    AddPropModal,
    NoEntities,
    NameDescModal,
    Spinner,
    WhereIsItUsedModal,
    ConfirmDeleteModal,
  } from '../../components';
  import {
    GeneralService,
    sdk,
    StoreService,
    EntityManagerService,
    NotificationService,
  } from '../../services';
  import type { WhereIsItUsedItem } from '../../types';

  export let id: string = undefined;

  const widgetStoreUnsub = StoreService.subscribe('widget', async (value) => {
    if (value) {
      widgets = value;
      if (widget) {
        widget = widgets.find((e) => e._id === widget._id);
      }
    }
  });
  const pathUnsub = StoreService.subscribe('path', async (value) => {
    const link = value as string;
    if (link.startsWith('/dashboard/widget/editor')) {
      const tempId = link.split('/')[link.split('/').length - 1];
      if (tempId === '-') {
        widget = widgets[0];
      } else {
        id = tempId;
        widget = widgets.find((e) => e._id === id);
      }
    }
  });
  let widgets: Widget[] = [];
  let widget: Widget;
  let editWidgetData = {
    label: '',
    desc: '',
  };
  let idBuffer = '' + id;
  let showSpinner = false;
  let whereIsItUsedItems: WhereIsItUsedItem[] = [];
  let propToDelete: Prop = undefined;

  async function create(label: string, desc: string) {
    await GeneralService.errorWrapper(
      async () => {
        await EntityManagerService.create('widget', label, desc);
      },
      async () => {
        NotificationService.success('Widget successfully created.');
      }
    );
  }
  async function update(label: string, desc: string) {
    await GeneralService.errorWrapper(
      async () => {
        return await EntityManagerService.update<Widget>(
          'widget',
          widget._id,
          label,
          desc
        );
      },
      async (value: Widget) => {
        widget = value;
        NotificationService.success('Widget updated successfully.');
      }
    );
  }
  async function remove() {
    await GeneralService.errorWrapper(
      async () => {
        await EntityManagerService.delete('widget', widget._id);
      },
      async () => {
        NotificationService.success('Widget was successfully deleted.');
      }
    );
  }
  async function addProp(prop: Prop) {
    await GeneralService.errorWrapper(
      async () => {
        return await EntityManagerService.addProp('widget', widget._id, prop);
      },
      async (value: Widget) => {
        widget = value;
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
          'widget',
          widget._id,
          widget.props,
          data
        );
      },
      async (value: Widget) => {
        widget = value;
        NotificationService.success('Property successfully updated.');
      }
    );
  }
  async function removeProp(prop: Prop) {
    await GeneralService.errorWrapper(
      async () => {
        return await EntityManagerService.removeProp(
          'widget',
          widget._id,
          prop
        );
      },
      async (value: Widget) => {
        widget = value;
        NotificationService.success('Property successfully deleted.');
      }
    );
  }
  async function search() {
    showSpinner = true;
    const entries: EntryLite[] = await GeneralService.errorWrapper(
      async () => {
        return await sdk.widget.whereIsItUsed(widget._id);
      },
      async (value: EntryLite[]) => {
        return value;
      }
    );
    if (entries) {
      whereIsItUsedItems = [];
      for (const i in entries) {
        const e = entries[i];
        whereIsItUsedItems.push({
          id: e._id,
          label: e.meta[0].props[0].value[0],
          type: 'entry',
          template: {
            id: e.templateId,
            label: (await sdk.template.get(e.templateId)).label,
          },
        });
      }
      StoreService.update('WhereIsItUsedModal', true);
    }
    showSpinner = false;
  }

  onMount(async () => {
    StoreService.update('widget', await sdk.widget.getAll());
    if ((!id || id === '-') && widgets.length > 0) {
      widget = widgets[0];
      GeneralService.navigate(`/dashboard/widget/editor/${widgets[0]._id}`);
    } else {
      widget = widgets.find((e) => e._id === id);
    }
  });
  beforeUpdate(async () => {
    if (idBuffer !== id) {
      idBuffer = '' + id;
      if (id === '-') {
        widget = widgets[0];
      } else {
        widget = widgets.find((e) => e._id === id);
      }
    }
  });
  onDestroy(() => {
    widgetStoreUnsub();
    pathUnsub();
  });
</script>

<Layout>
  <div class="gm">
    <ManagerLayout
      label="Widgets"
      actionText="Add new Widget"
      on:action={() => {
        StoreService.update('NameDescModal', true);
      }}
      items={widgets.map((e, i) => {
        return { name: e.label, link: `/dashboard/widget/editor/${e._id}`, selected: widget && widget._id === e._id };
      })}>
      {#if widgets.length > 0}
        {#if widget}
          <ManagerInfo
            id={widget._id}
            createdAt={widget.createdAt}
            updatedAt={widget.updatedAt}
            name={widget.label}
            description={widget.desc}
            on:edit={() => {
              editWidgetData.label = widget.label;
              editWidgetData.desc = widget.desc;
              StoreService.update('NameDescModal', true);
            }}
            whereIsItUsed={true}
            on:search={() => {
              search();
            }} />
          <ManagerPropsEditor
            sourceComponent="widget"
            props={widget.props}
            on:edit={(event) => {
              updateProp(event.detail);
            }}
            on:deleteEntity={() => {
              StoreService.update('ConfirmDeleteModal', true);
            }}
            on:deleteProp={(event) => {
              propToDelete = event.detail;
              StoreService.update('ConfirmDeleteModal', true);
            }}
            on:add={() => {
              StoreService.update('AddPropModal', true);
            }} />
        {/if}
      {:else}
        <NoEntities
          name="Widgets"
          on:action={() => {
            StoreService.update('NameDescModal', true);
          }} />
      {/if}
    </ManagerLayout>
  </div>
  <AddPropModal
    on:done={(event) => {
      addProp(event.detail);
    }} />
  <NameDescModal
    title="Create/Update a widget"
    name={editWidgetData.label}
    desc={editWidgetData.desc}
    on:cancel={() => {
      editWidgetData.label = '';
      editWidgetData.desc = '';
    }}
    on:done={(event) => {
      if (editWidgetData.label !== '') {
        editWidgetData.label = '';
        editWidgetData.desc = '';
        update(event.detail.name, event.detail.desc);
      } else {
        create(event.detail.name, event.detail.desc);
      }
    }} />
  <WhereIsItUsedModal
    title="Where this widget is used"
    items={whereIsItUsedItems}
    on:cancel={() => {
      whereIsItUsedItems = [];
    }}
    on:done={() => {
      whereIsItUsedItems = [];
    }} />
  <ConfirmDeleteModal
    on:done={() => {
      if (propToDelete) {
        removeProp(propToDelete);
        propToDelete = undefined;
      } else {
        remove();
        propToDelete = undefined;
      }
    }}
    on:cancel={() => {
      propToDelete = undefined;
    }} />
  <Spinner show={showSpinner} />
</Layout>
