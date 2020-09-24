<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import * as uuid from 'uuid';
  import SimpleMDE from 'simplemde';

  export { className as class };
  export let id = uuid.v4();
  export let value = '';
  export let placeholder = '';
  export let label = '';
  export let helperText = '';
  export let invalidText = '';

  const dispatch = createEventDispatcher();
  const areaId = uuid.v4();
  let className = '';
  let smd: SimpleMDE;

  onMount(() => {
    smd = new SimpleMDE({
      element: document.getElementById(areaId),
      initialValue: '' + value,
      placeholder,
      toolbar: [
        'bold',
        'italic',
        'heading',
        '|',
        'unordered-list',
        'ordered-list',
        '|',
        'preview',
      ],
      renderingConfig: {
        codeSyntaxHighlighting: true,
      },
      status: [
        {
          className: 'keystrokes',
          defaultValue: () => {},
          onUpdate: () => {
            dispatch('input', smd.value());
          },
        },
      ],
    });
  });
</script>

<div class="input {className}">
  {#if label !== ''}
    <label class="input--label" for={id}>{label}</label>
    {#if helperText !== ''}
      <div class="input--helper">{helperText}</div>
    {/if}
  {/if}
  {#if invalidText !== ''}
    <div class="input--invalid">
      <span class="fas fa-exclamation icon" />
      {invalidText}
    </div>
  {/if}
  <textarea rows="3" {placeholder} id={areaId} />
</div>
