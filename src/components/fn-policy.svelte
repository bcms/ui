<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { APIFunction } from '@becomes/cms-sdk';
  import { CheckboxInput } from './input';

  export { className as class };
  export let title = '';
  export let checked: boolean = false;
  export let initialValue: APIFunction = {
    _id: '',
    public: false,
  };

  const dispatch = createEventDispatcher();
  let className = '';
  let data: APIFunction & {
    checked: boolean;
    disabled: boolean;
  } = {
    _id: initialValue._id ? '' + initialValue._id : '',
    public: initialValue.public ? true : false,
    checked: initialValue.public ? true : checked ? true : false,
    disabled: initialValue.public ? true : false,
  };
</script>

<div class="fn-policy {data.disabled ? 'fn-policy--disabled' : ''} {className}">
  <h4>{title}</h4>
  <div class="fn-policy--options">
    <CheckboxInput
      value={data.checked}
      disabled={data.disabled}
      label="Can call a function"
      on:input={(event) => {
        dispatch('change', event.detail);
      }} />
  </div>
</div>
