<script lang="ts">
  import { createEventDispatcher } from 'svelte';
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
  let data: UserPolicyCRUD = {
    get: initialValue.get ? true : false,
    post: initialValue.post ? true : false,
    put: initialValue.put ? true : false,
    delete: initialValue.delete ? true : false,
  };

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
</script>

<div class="crud-policy {className}">
  <h4>{title}</h4>
  <div class="crud-policy--options">
    <CheckboxInput
      value={data.get}
      label="Can get resources"
      on:input={(event) => {
        change('get', event.detail);
      }} />
    <CheckboxInput
      value={data.post}
      label="Can add data"
      on:input={(event) => {
        change('post', event.detail);
      }} />
    <CheckboxInput
      value={data.put}
      label="Can update  data"
      on:input={(event) => {
        change('put', event.detail);
      }} />
    <CheckboxInput
      value={data.delete}
      label="Can delete data"
      on:input={(event) => {
        change('delete', event.detail);
      }} />
  </div>
</div>
