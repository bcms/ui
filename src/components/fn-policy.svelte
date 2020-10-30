<script lang="ts">
  import { beforeUpdate, createEventDispatcher } from 'svelte';
  import type { APIFunction } from '@becomes/cms-sdk';
  import { CheckboxInput } from './input';

  export { className as class };
  export let title = '';
  export let checked: boolean = false;
  export let initialValue: APIFunction = {
    _id: '',
    public: false,
  };

  type Data = APIFunction & {
    checked: boolean;
    disabled: boolean;
  };

  const dispatch = createEventDispatcher();
  let className = '';
  let data: Data = getData();
  function getData(): Data {
    return {
      _id: initialValue._id ? '' + initialValue._id : '',
      public: initialValue.public ? true : false,
      checked: initialValue.public ? true : checked ? true : false,
      disabled: initialValue.public ? true : false,
    };
  }
  beforeUpdate(() => {
    data = getData();
  });
</script>

<div class="fn-policy {data.disabled ? 'fn-policy--disabled' : ''} {className}">
  <h4>{title}</h4>
  <div class="fn-policy--options">
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label
      class="checkboxLabel {data.disabled ? 'checkboxLabel_disabled' : ''} mb--20">
      <CheckboxInput
        value={data.checked}
        disabled={data.disabled}
        on:input={(event) => {
          dispatch('change', event.detail);
        }} />
      <span class="checkboxLabel--textContent ml--10">Can call a function</span>
    </label>
  </div>
</div>
