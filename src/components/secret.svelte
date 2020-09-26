<script lang="ts">
  import * as uuid from 'uuid';

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
  {#if label}<label for={id}>{label}</label>{/if}
  <div class="secret--wrapper">
    <div {id} class="secret--value">{show ? secret : hiddenValue}</div>
    <button
      class="fas fa-eye{show ? '' : '-slash'} secret--toggle secret--toggle-{show ? 'show' : 'hide'}"
      {disabled}
      on:click={() => {
        show = !show;
      }} />
  </div>
</div>
