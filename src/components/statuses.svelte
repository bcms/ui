<script lang="ts">
  import type { Status, User } from '@becomes/cms-sdk';
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import { GeneralService, sdk, StoreService } from '../services';
  import type { SelectOption, StatusUpdateData } from '../types';
  import { Select } from './input';
  import { EditStatusesModal } from './modals';
  import Spinner from './spinner.svelte';

  export { className as class };
  export let selected = '';
  export let placeholder = 'Select a status';
  export let invalidText = '';

  const dispatch = createEventDispatcher();
  const statusStoreUnsub = StoreService.subscribe(
    'status',
    async (value: Status[]) => {
      if (value) {
        statuses = value;
        selectOptions = statuses.map((e) => {
          return {
            _id: e._id,
            label: e.label,
            value: e.name,
          };
        });
        console.log(selected)
        if (selected && !selectedValue) {
          const selectedStatus = statuses.find(e => e._id === selected);
          if (selectedStatus) {
            selectedValue = selectedStatus.name;
          }
        }
        if (user && user.roles[0].name === 'ADMIN') {
          selectOptions.push({
            _id: user._id,
            label: 'Edit statuses',
            value: '___edit___',
            special: 'editStatuses',
          });
        }
      }
    }
  );
  let className = '';
  let statuses: Status[] = [];
  let selectedStatus: Status;
  let selectedValue = '';
  let selectOptions: SelectOption[] = [];
  let showSpinner = false;
  let user: User;

  function onSelect(name: string) {
    selectedValue = name;
    selectedStatus = statuses.find((e) => e.name === name);
    dispatch('change', selectedStatus);
  }

  async function doUpdates(updates: StatusUpdateData[]) {
    showSpinner = true;
    for (const i in updates) {
      const update = updates[i];
      if (update.type === 'remove') {
        await deleteStatus(update._id);
      } else {
        await createStatus({
          label: update.label,
          color: update.color,
        });
      }
    }
    showSpinner = false;
  }
  async function deleteStatus(id: string) {
    await GeneralService.errorWrapper(
      async () => {
        return await sdk.status.deleteById(id);
      },
      async () => {
        StoreService.update('status', (values: Status[]) => {
          return values.filter((e) => e._id !== id);
        });
      }
    );
  }
  async function createStatus(data: { label: string; color?: string }) {
    await GeneralService.errorWrapper(
      async () => {
        return await sdk.status.add(data);
      },
      async (value) => {
        StoreService.update('status', (values: Status[]) => {
          values.push(value);
          return values;
        });
      }
    );
  }

  onMount(async () => {
    await GeneralService.errorWrapper(
      async () => {
        return {
          statuses: await sdk.status.getAll(),
          user: await sdk.user.get(),
        };
      },
      async (value) => {
        user = value.user;
        StoreService.update('status', value.statuses);
      }
    );
  });
  onDestroy(() => {
    statusStoreUnsub();
  });
</script>

<div class="statuses {className}">
  <Select
    {placeholder}
    {invalidText}
    selected={selectedValue}
    options={selectOptions}
    on:change={(event) => {
      if (event.detail.value === '___edit___') {
        StoreService.update('EditStatusesModal', {
          show: true,
          statuses,
        });
      } else {
        onSelect(event.detail.value);
      }
    }}
  />
</div>
<EditStatusesModal
  {statuses}
  on:done={(event) => {
    doUpdates(event.detail);
  }}
/>
<Spinner show={showSpinner} />
