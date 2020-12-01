<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { CloseIcon } from '../../icons';

  export let item: string;

  const dispatch = createEventDispatcher();
</script>

<li class="bcmsInput--enumeration-item">
  <button
    on:click={() => {
      dispatch('update');
    }}>
    <CloseIcon />
  </button>
  <span class="ml--10">{item}</span>
</li>
