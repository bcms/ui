<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type {
    Prop,
    PropEntryPointer,
    PropGroupPointer,
  } from '@becomes/cms-sdk';
  import { GeneralService, StoreService } from '../services';
  import { OverflowMenu, OverflowMenuItem } from './overflow';
  import Link from './link.svelte';
  import { EditPropModal } from './modals';
  import Button from './button.svelte';

  export let props: Prop[] = [];

  const dispatch = createEventDispatcher();
  let targetPropForEdit: Prop;

  function getGroupId(prop: Prop): string {
    return (prop.value as PropGroupPointer)._id;
  }
  function getTemplateId(prop: Prop): string {
    return (prop.value as PropEntryPointer).templateId;
  }
  function getManagerName(): string {
    return window.location.pathname.split('/')[2];
  }
</script>

<div class="entityEditor">
  <div class="entityEditor--top entityEditor--cols">
    <div class="entityEditor--top-buttons">
      <Button
        class="mr--10"
        on:click={() => {
          dispatch('add');
        }}>
        Add property
      </Button>
      <Button
        kind="danger"
        on:click={() => {
          dispatch('deleteEntity');
        }}>
        Delete
      </Button>
    </div>
    <p class="entityEditor--top-propsCount">
      {props.length}
      properties in this
      <span class="entityEditor--top-managerName"> {getManagerName()} </span>
    </p>
  </div>
  <div class="entityEditor--bottom">
    <ul class="entityEditor--list">
      <li class="entityEditor--list-item entityEditor--cols">
        <div class="entityEditor--list-name"><span /> <span>Label</span></div>
        <div class="entityEditor--list-name">Name</div>
        <div class="entityEditor--list-type"><span>Type</span></div>
      </li>
      {#each props as prop}
        <li class="entityEditor--list-item entityEditor--cols">
          <div class="entityEditor--list-name">
            <span>
              <i class="fas fa-{prop.required ? 'lock' : 'unlock'}" />
            </span>
            <span>{prop.label}</span>
          </div>
          <div class="entityEditor--list-name">{prop.name}</div>
          <div
            class="entityEditor--list-type {prop.type === 'GROUP_POINTER' || prop.type === 'ENTRY_POINTER' ? 'entityEditor--list-type_link' : ''}">
            {#if prop.type === 'GROUP_POINTER'}
              <Link href="/dashboard/group/editor/{getGroupId(prop)}">
                <span>{GeneralService.string.toPretty(prop.type)}</span>
                <span class="ml--5">{prop.array ? 'Array' : ''} </span>
              </Link>
            {:else if prop.type === 'ENTRY_POINTER'}
              <Link href="/dashboard/template/editor/{getTemplateId(prop)}">
                <span>{GeneralService.string.toPretty(prop.type)}</span>
                <span class="ml--5">{prop.array ? 'Array' : ''} </span>
              </Link>
            {:else}
              <span>{GeneralService.string.toPretty(prop.type)}</span>
              <span class="ml--5">{prop.array ? 'Array' : ''} </span>
            {/if}
          </div>
          {#if !['title', 'slug'].includes(prop.name)}
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
                  dispatch('deleteProp', prop);
                }} />
            </OverflowMenu>
          {/if}
        </li>
      {/each}
    </ul>
  </div>
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
