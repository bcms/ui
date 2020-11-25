<script lang="ts">
  import { createEventDispatcher, beforeUpdate } from 'svelte';
  import type { UserPolicyCRUD } from '@becomes/cms-sdk';
  import { CheckboxInput } from './input';

  export { className as class };
  export let title = '';
  export let initialValue: UserPolicyCRUD = {
    get: false,
    post: false,
    put: false,
    delete: false,
  };

  const dispatch = createEventDispatcher();
  let className = '';
  let data: UserPolicyCRUD = getData();

  function getData(): UserPolicyCRUD {
    if (initialValue) {
      return {
        get: initialValue.get ? true : false,
        post: initialValue.post ? true : false,
        put: initialValue.put ? true : false,
        delete: initialValue.delete ? true : false,
      };
    }
    return {
      get: false,
      post: false,
      put: false,
      delete: false,
    };
  }
  function change(name: 'get' | 'post' | 'put' | 'delete', value: boolean) {
    switch (name) {
      case 'get':
        {
          data.get = value;
          if (value === false) {
            data.post = false;
            data.put = false;
            data.delete = false;
          }
        }
        break;
      case 'post':
        {
          data.post = value;
          if (value === true) {
            data.get = true;
          }
        }
        break;
      case 'put':
        {
          data.put = value;
          if (value === true) {
            data.get = true;
          }
        }
        break;
      case 'delete':
        {
          data.delete = value;
          if (value === true) {
            data.get = true;
          }
        }
        break;
    }
    dispatch('change', JSON.parse(JSON.stringify(data)));
  }

  beforeUpdate(() => {
    data = getData();
  });
</script>

<div class="crud-policy {className}">
  <h4>{title}</h4>
  <div class="crud-policy--options">
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label class="checkboxLabel mb--20">
      <CheckboxInput
        value={data.get}
        on:input={(event) => {
          change('get', event.detail);
        }} />
      <span class="checkboxLabel--textContent ml--10">Can get resources</span>
    </label>

    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label class="checkboxLabel mb--20">
      <CheckboxInput
        value={data.post}
        on:input={(event) => {
          change('post', event.detail);
        }} />
      <span class="checkboxLabel--textContent ml--10">Can add data</span>
    </label>

    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label class="checkboxLabel mb--20">
      <CheckboxInput
        value={data.put}
        on:input={(event) => {
          change('put', event.detail);
        }} />
      <span class="checkboxLabel--textContent ml--10">Can update data</span>
    </label>

    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label class="checkboxLabel mb--20">
      <CheckboxInput
        value={data.delete}
        on:input={(event) => {
          change('delete', event.detail);
        }} />
      <span class="checkboxLabel--textContent ml--10">Can delete data</span>
    </label>
  </div>
</div>
