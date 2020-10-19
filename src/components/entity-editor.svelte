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
              {#if prop.required}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <path
                    fill="#000"
                    fill-rule="evenodd"
                    d="M5 12a1 1 0 00-1 1v7a1 1 0 001 1h14a1 1 0 001-1v-7a1 1 0 00-1-1H5zm-3 1a3 3 0 013-3h14a3 3 0 013 3v7a3 3 0 01-3 3H5a3 3 0 01-3-3v-7z"
                    clip-rule="evenodd" />
                  <path
                    fill="#000"
                    fill-rule="evenodd"
                    d="M12 3a4 4 0 00-4 4v4a1 1 0 11-2 0V7a6 6 0 1112 0v4a1 1 0 11-2 0V7a4 4 0 00-4-4z"
                    clip-rule="evenodd" />
                </svg>
              {:else}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <path
                    fill="#000"
                    fill-rule="evenodd"
                    d="M5 12a1 1 0 00-1 1v7a1 1 0 001 1h14a1 1 0 001-1v-7a1 1 0 00-1-1H5zm-3 1a3 3 0 013-3h14a3 3 0 013 3v7a3 3 0 01-3 3H5a3 3 0 01-3-3v-7z"
                    clip-rule="evenodd" />
                  <path
                    fill="#000"
                    d="M9.172 4.172A4 4 0 0116 7h2A6 6 0 106 7v4a1 1 0 102 0V7a4 4 0 011.172-2.828z" />
                  <path fill="#000" d="M18 7a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              {/if}
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
