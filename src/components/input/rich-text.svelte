<script lang="ts">
  import InputWrapper from './_wrapper.svelte';
  import { onMount, createEventDispatcher } from 'svelte';
  import * as uuid from 'uuid';
  import SimpleMDE from 'simplemde';

  export { className as class };
  export let value = '';
  export let placeholder = '';
  export let label = '';
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
            if (smd) {
              dispatch('input', smd.value());
            }
          },
        },
      ],
    });
  });
</script>

<InputWrapper class="{className} bcmsInput_richText" {label} {invalidText}>
  <textarea rows="3" {placeholder} id={areaId} />
</InputWrapper>
