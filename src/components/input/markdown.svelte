<script lang="ts">
  import InputWrapper from './_input.svelte';
  import { createEventDispatcher } from 'svelte';
  import * as uuid from 'uuid';

  export { className as class };
  export let value = '';
  export let placeholder = '';
  export let label = '';
  export let invalidText = '';
  export let disabled = false;
  export let helperText: string = undefined;

  const inputId = uuid.v4();
  const dispatch = createEventDispatcher();
  let className = '';

  function handleInput(event: Event) {
    const el = event.target as HTMLInputElement;
    dispatch('input', el.value);
  }
  // onMount(() => {
  //   // smd = new SimpleMDE({
  //   //   element: document.getElementById(areaId),
  //   //   initialValue: '' + value,
  //   //   placeholder,
  //   //   toolbar: [
  //   //     'bold',
  //   //     'italic',
  //   //     'heading',
  //   //     '|',
  //   //     'unordered-list',
  //   //     'ordered-list',
  //   //     '|',
  //   //     'preview',
  //   //   ],
  //   //   renderingConfig: {
  //   //     codeSyntaxHighlighting: true,
  //   //   },
  //   //   status: [
  //   //     {
  //   //       className: 'keystrokes',
  //   //       defaultValue: () => {},
  //   //       onUpdate: () => {
  //   //         if (smd) {
  //   //           dispatch('input', smd.value());
  //   //         }
  //   //       },
  //   //     },
  //   //   ],
  //   // });
  // });
</script>

<InputWrapper id={inputId} class={className} {label} {invalidText} {helperText}>
  <div
    class="_bcmsInput--markdown {disabled
      ? '_bcmsInput--markdown_disabled'
      : ''}"
  >
    <textarea
      rows="3"
      {placeholder}
      {value}
      id={label ? label : inputId}
      on:keyup={handleInput}
      on:change={handleInput}
    />
  </div>
</InputWrapper>
