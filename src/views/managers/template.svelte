<script lang="ts">
  import { onMount, onDestroy, beforeUpdate } from 'svelte';
  import type { Prop, Template } from '@becomes/cms-sdk';
  import {
    Layout,
    ManagerLayout,
    ManagerInfo,
    ManagerPropsEditor,
    AddPropModal,
    NoEntities,
    NameDescModal,
    ConfirmDeleteModal,
  } from '../../components';
  import {
    EntityManagerService,
    GeneralService,
    sdk,
    StoreService,
    NotificationService,
  } from '../../services';

  export let id: string = undefined;
  const templateStoreUnsub = StoreService.subscribe(
    'template',
    async (value) => {
      if (value) {
        templates = value;
        if (template) {
          template = templates.find((e) => e._id === template._id);
        }
      }
    }
  );
  const pathUnsub = StoreService.subscribe('path', async (value) => {
    const link = value as string;
    if (link.startsWith('/dashboard/template/editor')) {
      const tempId = link.split('/')[link.split('/').length - 1];
      if (tempId === '-') {
        template = templates[0];
      } else {
        id = tempId;
        template = templates.find((e) => e._id === id);
      }
    }
  });
  let templates: Template[] = [];
  let template: Template;
  let editTemplateData = {
    name: '',
    desc: '',
  };
  let idBuffer = '' + id;
  let propToDelete: Prop = undefined;

  async function create(label: string, desc: string) {
    await GeneralService.errorWrapper(
      async () => {
        await EntityManagerService.create('template', label, desc);
      },
      async () => {
        NotificationService.success('Template successfully created.');
      }
    );
  }
  async function update(label: string, desc: string, singleEntry?: boolean) {
    await GeneralService.errorWrapper(
      async () => {
        return await EntityManagerService.update<Template>(
          'template',
          template._id,
          label,
          desc
          // singleEntry
        );
      },
      async (tmp: Template) => {
        template = tmp;
        NotificationService.success('Template updated successfully.');
      }
    );
  }
  async function remove() {
    await GeneralService.errorWrapper(
      async () => {
        await EntityManagerService.delete('template', template._id);
      },
      async () => {
        NotificationService.success('Template was successfully deleted.');
      }
    );
  }
  async function addProp(prop: Prop) {
    await GeneralService.errorWrapper(
      async () => {
        return await EntityManagerService.addProp(
          'template',
          template._id,
          prop
        );
      },
      async (value: Template) => {
        template = value;
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
          'template',
          template._id,
          template.props,
          data
        );
      },
      async (value: Template) => {
        template = value;
        NotificationService.success('Property successfully updated.');
      }
    );
  }
  async function removeProp(prop: Prop) {
    await GeneralService.errorWrapper(
      async () => {
        return await EntityManagerService.removeProp(
          'template',
          template._id,
          prop
        );
      },
      async (value: Template) => {
        template = value;
        NotificationService.success('Property successfully deleted.');
      }
    );
  }

  onMount(async () => {
    StoreService.update('template', await sdk.template.getAll());
    if ((!id || id === '-') && templates.length > 0) {
      template = templates[0];
      GeneralService.navigate(
        `/dashboard/template/editor/${templates[0]._id}`,
        {
          replace: true,
        }
      );
    } else {
      template = templates.find((e) => e._id === id);
    }
  });
  beforeUpdate(async () => {
    if (idBuffer !== id) {
      idBuffer = '' + id;
      if (id === '-') {
        template = templates[0];
      } else {
        template = templates.find((e) => e._id === id);
      }
    }
  });
  onDestroy(() => {
    pathUnsub();
    templateStoreUnsub();
  });
</script>

<Layout>
  <ManagerLayout
    label="Templates"
    actionText="Add new Template"
    on:action={() => {
      StoreService.update('NameDescModal', true);
    }}
    items={templates.map((e) => {
      return { name: e.label, link: `/dashboard/template/editor/${e._id}`, selected: template && template._id === e._id };
    })}>
    {#if templates.length > 0}
      {#if template}
        <ManagerInfo
          id={template._id}
          createdAt={template.createdAt}
          updatedAt={template.updatedAt}
          name={template.label}
          description={template.desc}
          on:edit={() => {
            editTemplateData.name = template.label;
            editTemplateData.desc = template.desc;
            StoreService.update('NameDescModal', true);
          }}
          on:editEntryType={(event) => {
            update(template.label, template.desc, event.detail);
          }} />
        <ManagerPropsEditor
          sourceComponent="template"
          props={template.props}
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
        name="Templates"
        on:action={() => {
          StoreService.update('NameDescModal', true);
        }} />
    {/if}
  </ManagerLayout>
  <AddPropModal
    excludeTemplates={template ? [template._id] : []}
    on:done={(event) => {
      addProp(event.detail);
    }} />
  <NameDescModal
    title="Create/Update a template"
    name={editTemplateData.name}
    desc={editTemplateData.desc}
    on:cancel={() => {
      editTemplateData.name = '';
      editTemplateData.desc = '';
    }}
    on:done={(event) => {
      if (editTemplateData.name !== '') {
        editTemplateData.name = '';
        editTemplateData.desc = '';
        update(event.detail.name, event.detail.desc);
      } else {
        create(event.detail.name, event.detail.desc);
      }
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
</Layout>
