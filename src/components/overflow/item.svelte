<script lang="ts">
  import {
    ArrowUpIcon,
    ArrowDownIcon,
    EditIcon,
    TrashIcon,
    CodeIcon,
    PlusIcon,
  } from '../icons';

  export { className as class };
  export let text: string;
  export let icon:
    | 'arrow-up'
    | 'arrow-down'
    | 'edit'
    | 'trash'
    | 'add-section'
    | 'view-model' = undefined;

  let className = '';
</script>

<div class="overflowMenu--item {className}">
  <button on:click>
    {#if icon}
      {#if icon === 'arrow-up'}
        <ArrowUpIcon />
      {:else if icon === 'arrow-down'}
        <ArrowDownIcon />
      {:else if icon === 'edit'}
        <EditIcon />
      {:else if icon === 'trash'}
        <TrashIcon />
      {:else if icon === 'add-section'}
        <PlusIcon />
      {:else if icon === 'view-model'}
        <CodeIcon />
      {/if}
    {/if}
    <span>{text}</span>
  </button>
</div>
