<script lang="ts">
  import { onMount, onDestroy, beforeUpdate } from 'svelte';
  import type { Prop, Template } from '@becomes/cms-sdk';
  import {
    ManagerLayout,
    ManagerInfo,
    ManagerPropsEditor,
    AddPropModal,
    NoEntities,
    NameDescModal,
  } from '../../components';
  import {
    EntityManagerService,
    GeneralService,
    sdk,
    StoreService,
    NotificationService,
    ConfirmService,
  } from '../../services';
  import { Router } from '../../router';

  export let params: {
    id?: string;
  } = {};

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
  let templates: Template[] = [];
  let template: Template;
  let editTemplateData = {
    name: '',
    desc: '',
    title: '',
  };
  let idBuffer = '' + params.id;

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
  async function update(label: string, desc: string) {
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
    if (
      await ConfirmService.confirm(
        `Delete "${template.label}" Template`,
        `Are you sure you want to delete <strong>${template.label}</strong>
          template? This action is irreversible and all entries in
          this template will also be deleted.`,
        template.name
      )
    ) {
      await GeneralService.errorWrapper(
        async () => {
          await EntityManagerService.delete('template', template._id);
        },
        async () => {
          NotificationService.success('Template was successfully deleted.');
        }
      );
    }
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
    if (
      await ConfirmService.confirm(
        'Delete Property',
        `Are you sure you want to delete "${prop.label}" property?`
      )
    ) {
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
  }

  onMount(async () => {
    StoreService.update('template', await sdk.template.getAll());
    if ((!params.id || params.id === '-') && templates.length > 0) {
      template = templates[0];
      Router.navigate(
        `/dashboard/template/editor/${templates[0]._id}`,
        {
          replace: true,
        }
      );
    } else {
      template = templates.find((e) => e._id === params.id);
    }
  });
  beforeUpdate(async () => {
    Router.setTitle(template ? template.label : 'Templates');
    if (idBuffer !== params.id) {
      idBuffer = '' + params.id;
      if (params.id === '-') {
        template = templates[0];
      } else {
        template = templates.find((e) => e._id === params.id);
      }
    }
  });
  onDestroy(() => {
    templateStoreUnsub();
  });
</script>

<ManagerLayout
  label="Templates"
  actionText="Add new template"
  on:action={() => {
    editTemplateData.title = 'Add new template';
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
          editTemplateData.title = 'Edit template';
          StoreService.update('NameDescModal', true);
        }}
        on:editEntryType={() => {
          update(template.label, template.desc);
        }} />
      <ManagerPropsEditor
        sourceComponent="template"
        props={template.props}
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
      name="Template"
      on:action={() => {
        editTemplateData.title = 'Add new template';
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
  title={editTemplateData.title}
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
