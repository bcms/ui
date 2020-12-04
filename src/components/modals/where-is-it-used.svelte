<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { GeneralService, StoreService } from '../../services';
  import Modal from './modal.svelte';
  import type { WhereIsItUsedItem } from '../../types';
  import Link from '../link.svelte';

  export let items: WhereIsItUsedItem[] = [];

  const dispatch = createEventDispatcher();
  const modalName = 'WhereIsItUsedModal';

  function close() {
    StoreService.update(modalName, false);
  }
  function cancel() {
    dispatch('cancel');
    close();
  }
  function done() {
    close();
  }
</script>

<Modal name={modalName} on:cancel={cancel} on:done={done}>
  <div class="prop-list-table">
    <table>
      <thead>
        <tr>
          <th style="width: 80px;">Type</th>
          <th>Label</th>
          <th style="text-align: center; width: 100px;">Location</th>
        </tr>
      </thead>
      <tbody>
        {#each items as item}
          <tr class="whereIsItUsed--item">
            <td class="name">{GeneralService.string.toPretty(item.type)}</td>
            <td class="label" style="font-size: 14px;">
              {#if item.template}
                <span style="color: var(--c-gray);">{item.template.label}
                </span><br />
              {/if}
              {item.label}
            </td>
            <td style="text-align: center;">
              {#if item.type === 'entry'}
                <Link
                  style="font-size: 14px; text-decoration: none; color(--c-primary);"
                  on:click={() => {
                    close();
                  }}
                  href="/dashboard/template/{item.template.id}/entry/{item.id}">
                  Open&nbsp;entry
                </Link>
              {:else if item.type === 'widget'}
                <Link
                  style="font-size: 14px; text-decoration: none; color(--c-primary);"
                  on:click={() => {
                    close();
                  }}
                  href="/dashboard/widget/editor/{item.id}">
                  Open&nbsp;widget
                </Link>
              {:else if item.type === 'group'}
                <Link
                  style="font-size: 14px; text-decoration: none; color(--c-primary);"
                  on:click={() => {
                    close();
                  }}
                  href="/dashboard/group/editor/{item.id}">
                  Open&nbsp;group
                </Link>
              {:else if item.type === 'template'}
                <Link
                  style="font-size: 14px; text-decoration: none; color(--c-primary);"
                  on:click={() => {
                    close();
                  }}
                  href="/dashboard/template/editor/{item.id}">
                  Open&nbsp;group
                </Link>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</Modal>
