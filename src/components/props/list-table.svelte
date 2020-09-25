<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type {
    Prop,
    PropEntryPointer,
    PropGroupPointer,
  } from '@becomes/cms-sdk';
  import { GeneralService, StoreService } from '../../services';
  import { OverflowMenu, OverflowMenuItem } from '../overflow';
  import Link from '../link.svelte';
  import { EditPropModal } from '../modals';
  import Button from '../button.svelte';

  export { className as class };
  export let props: Prop[] = [];
  export let showAddActions: boolean = true;

  const dispatch = createEventDispatcher();
  let className = '';
  let targetPropForEdit: Prop;

  function getGroupId(prop: Prop): string {
    return (prop.value as PropGroupPointer)._id;
  }
  function getTemplateId(prop: Prop): string {
    return (prop.value as PropEntryPointer).templateId;
  }
</script>

<div class="prop-list-table {className}">
  {#if props.length > 0}
    {#if showAddActions}
      <div class="ml--auto mb--20">
        <Button
          icon="fas fa-plus"
          on:click={() => {
            dispatch('add');
          }}>
          Add new property
        </Button>
      </div>
    {/if}
    <table>
      <thead>
        <tr>
          <th class="required" />
          <th>Label</th>
          <th>Name</th>
          <th>Type</th>
          <th class="menu" />
        </tr>
      </thead>
      <tbody>
        {#each props as prop}
          <tr>
            <td class="required">
              <div class="fas fa-{prop.required ? 'lock' : 'unlock'}" />
            </td>
            <td>{prop.label}</td>
            <td class="name"><code>{prop.name}</code></td>
            <td class="type">
              {GeneralService.string.toPretty(prop.type)}
              {prop.array ? 'Array' : ''}
              {#if prop.type === 'GROUP_POINTER'}
                <span class="fas fa-link" />
                <Link href="/dashboard/group/editor/{getGroupId(prop)}">
                  See the group
                </Link>
              {/if}
              {#if prop.type === 'ENTRY_POINTER'}
                <span class="fas fa-link" />
                <Link href="/dashboard/template/editor/{getTemplateId(prop)}">
                  See the Entry Template
                </Link>
              {/if}
            </td>
            <td>
              {#if prop.name !== 'title' && prop.name !== 'slug'}
                <OverflowMenu position="right">
                  <OverflowMenuItem
                    text="Move up"
                    on:click={() => {
                      dispatch('edit', {
                        move: -1,
                        name: prop.name,
                        label: prop.label,
                        required: prop.required,
                      });
                    }} />
                  <OverflowMenuItem
                    text="Move down"
                    on:click={() => {
                      dispatch('edit', {
                        move: 1,
                        name: prop.name,
                        label: prop.label,
                        required: prop.required,
                      });
                    }} />
                  <OverflowMenuItem
                    text="Edit"
                    on:click={() => {
                      targetPropForEdit = prop;
                      StoreService.update('EditPropModal', true);
                    }} />
                  <OverflowMenuItem
                    text="Delete"
                    danger={true}
                    on:click={() => {
                      dispatch('delete', prop);
                    }} />
                </OverflowMenu>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
    {#if showAddActions}
      <div class="ml--auto mr--auto mt--50 mb--20">
        <Button
          kind="ghost"
          icon="fas fa-plus"
          on:click={() => {
            dispatch('add');
          }}>
          Add new property
        </Button>
      </div>
    {/if}
  {:else}
    <div class="no-props">
      <h3>There are no properties available.</h3>
      {#if showAddActions}
        <Button
          class="mt--20"
          icon="fas fa-plus"
          on:click={() => {
            dispatch('add');
          }}>
          Add new property
        </Button>
      {/if}
    </div>
  {/if}
</div>
<EditPropModal
  prop={targetPropForEdit}
  on:done={(event) => {
    dispatch('edit', {
      move: 0,
      name: targetPropForEdit.name,
      ...event.detail,
    });
  }} />
