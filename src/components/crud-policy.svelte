<script lang="ts">
  import { createEventDispatcher, beforeUpdate } from 'svelte';
  import type { UserPolicyCRUD } from '@becomes/cms-sdk';
  import { CheckboxInput } from './input';
  import Button from './button.svelte';

  export { className as class };
  export let initialValue: UserPolicyCRUD = {
    get: false,
    post: false,
    put: false,
    delete: false,
  };
  export let title: string = '';

  const dispatch = createEventDispatcher();
  let className = '';
  let data: UserPolicyCRUD = getData();

  $: allChecked = data.get && data.post && data.put && data.delete;

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

  function checkAll() {
    if (allChecked) {
      data.get = false;
      data.post = false;
      data.put = false;
      data.delete = false;
    } else {
      data.get = true;
      data.post = true;
      data.put = true;
      data.delete = true;
    }

    dispatch('change', JSON.parse(JSON.stringify(data)));
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
  <h3 class="crud-policy--name">
    {@html title}
  </h3>
  <div class="crud-policy--options">
    <Button class="mb-10" kind="ghost" on:click={checkAll}>
      {allChecked ? 'Uncheck all' : 'Check all'}
    </Button>
    <CheckboxInput
      description="Can get resources"
      class="mb-20 ml-20"
      value={data.get}
      on:input={(event) => {
        change('get', event.detail);
      }} />
    <CheckboxInput
      description="Can add data"
      class="mb-20 ml-20"
      value={data.post}
      on:input={(event) => {
        change('post', event.detail);
      }} />
    <CheckboxInput
      description="Can update data"
      class="mb-20 ml-20"
      value={data.put}
      on:input={(event) => {
        change('put', event.detail);
      }} />
    <CheckboxInput
      description="Can delete data"
      class="mb-20 ml-20"
      value={data.delete}
      on:input={(event) => {
        change('delete', event.detail);
      }} />
  </div>
</div>
