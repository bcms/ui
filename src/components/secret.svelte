<script lang="ts">
  import * as uuid from 'uuid';
  import { EyeHideIcon, EyeShowIcon } from './icons';

  export { className as class };
  export let label = '';
  export let disabled: boolean = false;
  export let secret = '';

  const id = uuid.v4();
  const hiddenValue = '************';
  let className = '';
  let show = false;
</script>

<div class="secret {className}">
  {#if label}<label for={id} class="bcmsInput--label">{label}</label>{/if}
  <div class="bcmsInput--inner">
    <div {id} class="secret--value customScrollbar">{show ? secret : hiddenValue}</div>
    <button
      class="secret--toggle secret--toggle-{show ? 'show' : 'hide'}"
      {disabled}
      on:click={() => {
        show = !show;
      }}>
      {#if show}
        <EyeShowIcon />
      {:else}
        <EyeHideIcon />
      {/if}
    </button>
  </div>
</div>
