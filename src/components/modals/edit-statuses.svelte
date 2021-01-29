<script lang="ts">
  import type { Status } from '@becomes/cms-sdk';
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import { StoreService } from '../../services';
  import type { StatusUpdateData } from '../../types';
  import { MultiAddInput } from '../input';
  import Modal from './modal.svelte';

  export let statuses: Status[] = [];

  const modalName = 'EditStatusesModal';
  const dispatch = createEventDispatcher();
  let selfUnsub: () => void = () => {};
  let updates: StatusUpdateData[] = [];
  let itemsBuffer: string[] = [];

  function update(items: string[]) {
    if (items.length > itemsBuffer.length) {
      updates = updates.filter((e) => e.label !== items[items.length - 1]);
      const statusExist = statuses.find(
        (e) => e.label === items[items.length - 1]
      );
      if (!statusExist) {
        updates.push({
          label: items[items.length - 1],
          color: '',
          type: 'create',
        });
      }
      itemsBuffer.push(items[items.length - 1]);
    } else {
      for (let i = 0; i < itemsBuffer.length; i++) {
        if (items[i] !== itemsBuffer[i]) {
          updates = updates.filter((e) => e.label !== itemsBuffer[i]);
          const statusToRemove = statuses.find(
            (e) => e.label === itemsBuffer[i]
          );
          if (statusToRemove) {
            updates.push({
              _id: statusToRemove._id,
              label: statusToRemove.label,
              color: '',
              type: 'remove',
            });
          }
          itemsBuffer.splice(i, 1);
          break;
        }
      }
    }
  }
  function close() {
    StoreService.update(modalName, false);
  }
  function cancel() {
    dispatch('cancel');
    close();
  }
  function done() {
    dispatch('done', updates);
    close();
  }
  onMount(() => {
    selfUnsub = StoreService.subscribe(modalName, async () => {
      itemsBuffer = statuses.map((e) => e.label);
      updates = [];
    });
  });
  onDestroy(() => {
    selfUnsub();
  });
</script>

<Modal title="Edit statuses" name={modalName} on:done={done} on:cancel={cancel}>
  <MultiAddInput
    label="Status name"
    placeholder="Status name"
    value={statuses.map((e) => e.label)}
    validate={(items) => {
      if (items.splice(0, items.length - 1).includes(items[items.length - 1])) {
        return `Status with name "${
          items[items.length - 1]
        }" is already added.`;
      }
    }}
    on:update={(event) => {
      update(event.detail);
    }}
  />
</Modal>
