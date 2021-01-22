<script lang="ts">
  import { blur } from 'svelte/transition';
  import { Meta } from '../../components';
  import type { Status } from '@becomes/cms-sdk';
  import { onDestroy, onMount } from 'svelte';
  import { GeneralService, sdk, StoreService } from '../../services';

  const statusStoreUnsub = StoreService.subscribe(
    'status',
    async (value?: Status[]) => {
      if (value) {
        statuses = value;
      }
    }
  );
  let statuses: Status[] = [];

  // TODO: Add status
  // TODO: Update status
  // TODO: Delete status

  onMount(async () => {
    await GeneralService.errorWrapper(
      async () => {
        return sdk.status.getAll();
      },
      async (value: Status[]) => {
        StoreService.update('status', value);
      }
    );
  });
  onDestroy(() => {
    statusStoreUnsub();
  });
</script>

<Meta title="Status" />
<div
  in:blur={{ delay: 250, duration: 200 }}
  out:blur={{ duration: 200 }}
  class="status"
>
  <pre><code>{JSON.stringify(statuses, null, '  ')}</code></pre>
</div>
