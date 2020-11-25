<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let item: string;

  const dispatch = createEventDispatcher();
</script>

<li class="bcmsInput--enumeration-item">
  <button
    on:click={() => {
      dispatch('update');
    }}>
    <i class="icon fas fa-times" />
  </button>
  <span class="ml--10">{item}</span>
</li>
