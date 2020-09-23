<script lang="ts">
  import type {
    Prop,
    PropEntryPointer,
    PropGroupPointer,
  } from '@becomes/cms-sdk';
  import { GeneralService } from '../../services';
  import { OverflowMenu, OverflowMenuItem } from '../overflow';
  import Link from '../link.svelte';

  export { className as class };
  export let showGhostProps: boolean = false;
  export let props: Prop[] = [];
  let className = '';

  function getGroupId(prop: Prop): string {
    return (prop.value as PropGroupPointer)._id;
  }
  function getTemplateId(prop: Prop): string {
    return (prop.value as PropEntryPointer).templateId;
  }
</script>

<div class="prop-list-table {className}">
  <table>
    <thead>
      <tr>
        <th class="required" />
        <th>Name</th>
        <th>Type</th>
        <th class="menu" />
      </tr>
    </thead>
    <tbody>
      {#if showGhostProps}
        <tr>
          <td class="required">
            <div class="fas fa-lock" />
          </td>
          <td>Title</td>
          <td>String</td>
          <td />
        </tr>
        <tr>
          <td class="required">
            <div class="fas fa-lock" />
          </td>
          <td>Slug</td>
          <td>String</td>
          <td />
        </tr>
        <tr>
          <td class="required">
            <div class="fas fa-unlock" />
          </td>
          <td>Description</td>
          <td>String</td>
          <td />
        </tr>
        <tr>
          <td class="required">
            <div class="fas fa-unlock" />
          </td>
          <td>Cover Image</td>
          <td>Media</td>
          <td />
        </tr>
      {/if}
      {#each props as prop}
        <tr>
          <td class="required">
            <div class="fas fa-{prop.required ? 'lock' : 'unlock'}" />
          </td>
          <td>{GeneralService.string.toPretty(prop.name)}</td>
          <td class="type">
            {GeneralService.string.toPretty(prop.type)}
            {#if prop.type === 'GROUP_POINTER_ARRAY' || prop.type === 'GROUP_POINTER'}
              <span class="fas fa-link" />
              <Link href="/dashboard/group/editor/{getGroupId(prop)}">
                See the group
              </Link>
            {/if}
            {#if prop.type === 'ENTRY_POINTER' || prop.type === 'ENTRY_POINTER_ARRAY'}
              <span class="fas fa-link" />
              <Link href="/dashboard/template/editor/{getTemplateId(prop)}">
                See the Entry Template
              </Link>
            {/if}
          </td>
          <td>
            <OverflowMenu position="right">
              <OverflowMenuItem text="Move up" on:click={() => {}} />
              <OverflowMenuItem text="Move down" on:click={() => {}} />
              <OverflowMenuItem text="Edit" on:click={() => {}} />
              <OverflowMenuItem
                text="Delete"
                danger={true}
                on:click={() => {}} />
            </OverflowMenu>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
