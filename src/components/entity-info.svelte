<script lang="ts">
  import { GeneralService, MD } from '../services';
  import Button from './button.svelte';

  export let id: string;
  export let createdAt: number;
  export let updatedAt: number;
  export let name: string;
  export let description: string;
</script>

<div class="entity-info">
  <div class="entity-info--left">
    <div class="name">
      <h3>{GeneralService.string.toPretty(name)}</h3>
      <Button class="ml--20" kind="ghost" onlyIcon={true} icon="fas fa-edit" />
    </div>
    {@html description ? MD.render(description) : '<p>This entity does not have a description.</p>'}
  </div>
  <div class="entity-info--right">
    <div class="stat">
      <label for="id">ID</label>
      <p>{id}</p>
    </div>
    <div class="stat">
      <label for="created-at">Created at</label>
      <p>{new Date(createdAt).toLocaleString()}</p>
    </div>
    <div class="stat">
      <label for="updated-at">Updated at</label>
      <p>{new Date(updatedAt).toLocaleString()}</p>
    </div>
  </div>
</div>
