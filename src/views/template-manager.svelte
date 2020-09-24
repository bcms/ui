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
  } from '../components';
  import { GeneralService, sdk, StoreService } from '../services';

  export let id: string = undefined;
  const pathUnsub = StoreService.subscribe('path', async (value) => {
    const link = value as string;
    if (
      link.startsWith('/dashboard/template/editor') &&
      !link.startsWith('/dashboard/template/editor/-')
    ) {
      id = link.split('/')[link.split('/').length - 1];
      template = templates.find((e) => e._id === id);
    }
  });
  let templates: Template[] = [];
  let template: Template;

  async function addProp(prop: Prop) {}

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
      return { name: GeneralService.string.toPretty(e.name), link: `/dashboard/template/editor/${e._id}`, selected: template && template._id === e._id };
    })}>
    {#if template}
      <EntityInfo
        id={template._id}
        createdAt={template.createdAt}
        updatedAt={template.updatedAt}
        name={template.name}
        description={template.desc} />
      <div class="ml--auto mt--50 mb--20">
        <Button
          icon="fas fa-plus"
          on:click={() => {
            StoreService.update('AddPropModal', true);
          }}>
          Add new property
        </Button>
      </div>
      <PropListTable showGhostProps={true} props={template.entryTemplate} />
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
    console.log(event.detail);
  }} />
<NameDescModal title="Add new template" />
