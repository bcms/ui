<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { MD } from '../services';
  import Button from './button.svelte';

  export let id: string;
  export let createdAt: number;
  export let updatedAt: number;
  export let name: string;
  export let description: string;

  const dispatch = createEventDispatcher();
</script>

<div class="entity-info">
  <div class="entity-info--left">
    <div class="name">
      <h3>{name}</h3>
      <Button
        class="ml--20"
        kind="ghost"
        onlyIcon={true}
        icon="fas fa-edit"
        on:click={() => {
          dispatch('edit');
        }} />
      <Button
        class="ml--auto"
        kind="danger"
        icon="fas fa-trash"
        on:click={() => {
          dispatch('delete');
        }}>
        Delete
      </Button>
    </div>
    <div class="desc">
      {@html description ? MD.render(description) : '<p>This entity does not have a description.</p>'}
    </div>
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
