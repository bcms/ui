<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { Template } from '@becomes/cms-sdk';
  import { Button, ManagerLayout, EntityInfo } from '../components';
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
    {:else}
      <div class="tm--none">There are not Templates available.</div>
      <Button icon="fas fa-plus">Add new Template</Button>
    {/if}
  </ManagerLayout>
</div>
