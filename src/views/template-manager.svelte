<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { Prop, Template } from '@becomes/cms-sdk';
  import {
    Button,
    ManagerLayout,
    EntityInfo,
    PropListTable,
    AddPropModal,
    NoEntities,
    NameDescModal,
    popup,
  } from '../components';
  import { GeneralService, sdk, StoreService } from '../services';

  export let id: string = undefined;
  const templateStoreUnsub = StoreService.subscribe(
    'templates',
    async (value) => {
      templates = value;
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

  async function createTemplate(label: string, desc: string) {
    let temp: Template;
    try {
      temp = await sdk.template.add({
        label,
        desc,
        singleEntry: false,
      });
      StoreService.update('templates', (value: Template[]) => {
        value.push(temp);
        return value;
      });
    } catch (error) {
      popup.error(error.message);
      return;
    }
    popup.success('Template was successfully created.');
    const pathParts = window.location.pathname.split('/');
    GeneralService.navigate(
      [...pathParts.splice(0, pathParts.length - 1), temp._id].join('/')
    );
  }
  async function deleteTemplate() {
    if (confirm('Are you sure you want to delete the template?')) {
      try {
        await sdk.template.deleteById(template._id);
        const id = template._id;
        template = undefined;
        StoreService.update('templates', (value: Template[]) => {
          return value.filter((e) => e._id !== id);
        });
      } catch (error) {
        popup.error(error.message);
        return;
      }
      popup.success('Template was successfully deleted.');
      const pathParts = window.location.pathname.split('/');
      GeneralService.navigate(
        [...pathParts.splice(0, pathParts.length - 1), '-'].join('/')
      );
    }
  }
  async function addProp(prop: Prop) {
    let temp: Template;
    try {
      temp = await sdk.template.update({
        _id: template._id,
        propChanges: [
          {
            add: prop,
          },
        ],
      });
    } catch (error) {
      popup.error(error.message);
      return;
    }
    template = temp;
  }
  async function updateTemplateInfo(label: string, desc: string) {
    let temp: Template;
    try {
      temp = await sdk.template.update({
        _id: template._id,
        label,
        desc,
      });
    } catch (error) {
      popup.error(error.message);
      return;
    }
    template = temp;
    popup.success('Template updated successfully.');
  }

  onMount(async () => {
    templates = await sdk.template.getAll();
    if (!id || id === '-') {
      template = templates[0];
    } else {
      template = templates.find((e) => e._id === id);
    }
  });
  onDestroy(() => {
    pathUnsub();
    templateStoreUnsub();
  });
</script>

<div class="tm">
  <ManagerLayout
    label="TEMPLATES"
    actionText="Add new Template"
    on:action={() => {
      StoreService.update('NameDescModal', true);
    }}
    items={templates.map((e, i) => {
      return { name: e.label, link: `/dashboard/template/editor/${e._id}`, selected: template && template._id === e._id };
    })}>
    {#if templates.length > 0}
      {#if template}
        <EntityInfo
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
          on:delete={() => {
            deleteTemplate();
          }} />
        <div class="ml--auto mt--50 mb--20">
          <Button
            icon="fas fa-plus"
            on:click={() => {
              StoreService.update('AddPropModal', true);
            }}>
            Add new property
          </Button>
        </div>
        <PropListTable props={template.props} />
        <div class="ml--auto mr--auto mt--50 mb--20">
          <Button
            kind="ghost"
            icon="fas fa-plus"
            on:click={() => {
              StoreService.update('AddPropModal', true);
            }}>
            Add new property
          </Button>
        </div>
      {/if}
    {:else}
      <NoEntities
        name="Templates"
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
  title="Add new template"
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
      updateTemplateInfo(event.detail.name, event.detail.desc);
    } else {
      createTemplate(event.detail.name, event.detail.desc);
    }
  }} />
