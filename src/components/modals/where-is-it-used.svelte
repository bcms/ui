<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { GeneralService, StoreService } from '../../services';
  import Modal from './modal.svelte';
  import type { WhereIsItUsedItem } from '../../types';
  import Link from '../link.svelte';
  import { LinkIcon } from '../icons';

  export let items: WhereIsItUsedItem[] = [];
  export let title: string = undefined;

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

<Modal
  name={modalName}
  class="bcmsModal_whereIsItUsed"
  on:cancel={cancel}
  on:done={done}>
  <div slot="header">
    <h2 class="bcmsModal--title">{title}</h2>
  </div>
  {#if items.length > 0}
    <ul class="bcmsModal_whereIsItUsed--list">
      <li
        class="bcmsModal_whereIsItUsed--list-item bcmsModal_whereIsItUsed--list-cols">
        <div
          class="bcmsModal_whereIsItUsed--list-item-type bcmsModal_whereIsItUsed--list-item-col"
          data-column-name="Type">
          Type
        </div>
        <div
          class="bcmsModal_whereIsItUsed--list-item-label bcmsModal_whereIsItUsed--list-item-col"
          data-column-name="Label">
          Label
        </div>
        <div
          class="bcmsModal_whereIsItUsed--list-item-location bcmsModal_whereIsItUsed--list-item-col"
          data-column-name="Location">
          Location
        </div>
      </li>
      {#each items as item}
        <li
          class="bcmsModal_whereIsItUsed--list-item bcmsModal_whereIsItUsed--list-cols">
          <div
            class="bcmsModal_whereIsItUsed--list-item-type bcmsModal_whereIsItUsed--list-item-col"
            data-column-name="Type">
            {GeneralService.string.toPretty(item.type)}
          </div>
          <div
            class="bcmsModal_whereIsItUsed--list-item-label bcmsModal_whereIsItUsed--list-item-col"
            data-column-name="Label">
            {#if item.template}<span>{item.template.label}</span>{/if}
            {item.label}
          </div>
          <div
            class="bcmsModal_whereIsItUsed--list-item-location bcmsModal_whereIsItUsed--list-item-col"
            data-column-name="Location">
            {#if item.type === 'entry'}
              <Link
                on:click={() => {
                  close();
                }}
                href="/dashboard/template/{item.template.id}/entry/{item.id}">
                <span>Open entry</span>
                <LinkIcon />
              </Link>
            {:else if item.type === 'widget'}
              <Link
                on:click={() => {
                  close();
                }}
                href="/dashboard/widget/editor/{item.id}">
                <span>Open widget</span>
                <LinkIcon />
              </Link>
            {:else if item.type === 'group'}
              <Link
                on:click={() => {
                  close();
                }}
                href="/dashboard/group/editor/{item.id}">
                <span>Open group</span>
                <LinkIcon />
              </Link>
            {:else if item.type === 'template'}
              <Link
                on:click={() => {
                  close();
                }}
                href="/dashboard/template/editor/{item.id}">
                <span>Open group</span>
                <LinkIcon />
              </Link>
            {/if}
          </div>
        </li>
      {/each}
    </ul>
  {:else}
    <div class="managerPropsEditor--empty">It hasn't been used yet</div>
  {/if}
</Modal>
