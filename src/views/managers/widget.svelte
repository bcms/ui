<script lang="ts">
  import { onMount, onDestroy, beforeUpdate } from 'svelte';
  import type { Widget, Prop, EntryLite } from '@becomes/cms-sdk';
  import {
    ManagerLayout,
    ManagerInfo,
    ManagerPropsEditor,
    AddPropModal,
    NoEntities,
    NameDescModal,
    Spinner,
    WhereIsItUsedModal,
    RemoveManagerModal,
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

  const widgetStoreUnsub = StoreService.subscribe('widget', async (value) => {
    if (value) {
      widgets = value;
      if (widget) {
        widget = widgets.find((e) => e._id === widget._id);
      }
    }
  });
  let widgets: Widget[] = [];
  let widget: Widget;
  let editWidgetData = {
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
    if (
      await ConfirmService.confirm(
        'Delete Property',
        `Are you sure you want to delete property "${prop.label}"?`
      )
    ) {
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
    if ((!params.id || params.id === '-') && widgets.length > 0) {
      widget = widgets[0];
      Router.navigate(`/dashboard/widget/editor/${widgets[0]._id}`, {
        replace: true,
      });
    } else {
      widget = widgets.find((e) => e._id === params.id);
    }
  });
  beforeUpdate(async () => {
    Router.setTitle(widget ? widget.label : 'Widgets');
    if (idBuffer !== params.id) {
      idBuffer = '' + params.id;
      if (params.id === '-') {
        widget = widgets[0];
      } else {
        widget = widgets.find((e) => e._id === params.id);
      }
    }
  });
  onDestroy(() => {
    widgetStoreUnsub();
  });
</script>

<div class="gm">
  <ManagerLayout
    label="Widgets"
    actionText="Add new widget"
    on:action={() => {
      editWidgetData.title = 'Add new widget';
      StoreService.update('NameDescModal', true);
    }}
    items={widgets.map((e) => {
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
            editWidgetData.title = 'Edit widget';
            StoreService.update('NameDescModal', true);
          }} />
        <ManagerPropsEditor
          sourceComponent="widget"
          props={widget.props}
          whereIsItUsed={true}
          on:edit={(event) => {
            updateProp(event.detail);
          }}
          on:deleteEntity={() => {
            StoreService.update('RemoveManagerModal', true);
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
        name="Widget"
        on:action={() => {
          editWidgetData.title = 'Add new widget';
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
  title={editWidgetData.title}
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
  title="Where is this widget used"
  items={whereIsItUsedItems}
  on:cancel={() => {
    whereIsItUsedItems = [];
  }}
  on:done={() => {
    whereIsItUsedItems = [];
  }} />
<Spinner show={showSpinner} />
{#if widget}
  <RemoveManagerModal
    title={`Delete "${widget.label}" Widget`}
    warningMessage={`Are you sure you want to delete "${widget.label}" widget?
      If deleted, widget will be removed from all the entries that are using it.`}
    inputLabel="Confirm widget name"
    managerName={widget.label}
    on:done={remove} />
{/if}
