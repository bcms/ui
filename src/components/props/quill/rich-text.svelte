<script context="module" lang="ts">
  const toolbar = [
    [
      { header: 1 },
      { header: 2 },
      { header: 3 },
      { header: 4 },
      { header: 5 },
      { header: 6 },
    ],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'bullet' }],
    ['link'],
  ];
</script>

<script lang="ts">
  import type { Prop, PropQuill } from '@becomes/cms-sdk';
  import { beforeUpdate, createEventDispatcher, onDestroy } from 'svelte';
  import { LocalStorageService, PropsCheckerService } from '../../../services';
  import SinglePropWrapper from '../single-prop-wrapper.svelte';
  import QuillContainer from './quill.svelte';

  export { className as class };
  export let id: string = undefined;
  export let prop: Prop;

  const unregisterFromChecher = PropsCheckerService.register(() => {
    let isOk = true;
    if (prop.required) {
      if (!value.text || (value.ops[0] && value.ops[0].insert === '\n')) {
        error = 'Input must contain some text.';
        isOk = false;
      }
    }
    return isOk;
  });
  const dispatch = createEventDispatcher();
  let className = '';
  let value = prop.value as PropQuill;
  let error = '';

  beforeUpdate(() => {
    value = prop.value as PropQuill;
  });
  onDestroy(() => {
    unregisterFromChecher();
  });
</script>

<SinglePropWrapper class={className} {prop}>
  <div class="prop--rich-text">
    <!-- {#if prop.array}
      <SinglePropArrayWrapper
        {prop}
        showSlot={values.length > 0}
        on:add={() => {
          addItem();
        }}>
        {#each values as value, i}
          <SinglePropArrayItem
            position={i}
            elementLength={values.length}
            on:move={(event) => {
              moveItem(i, event.detail.move);
            }}
            on:remove={(event) => {
              removeItem(event.detail.position);
            }}>
            <TextArea
              value={prop.value[i]}
              placeholder="Item {i + 1}"
              on:input={(event) => {
                prop.value[i] = event.detail;
                dispatch('update', prop);
              }} />
          </SinglePropArrayItem>
        {/each}
      </SinglePropArrayWrapper>
    {:else} -->
    <div class={error ? 'bcmsInput--inner_isError' : ''}>{error}</div>
    <QuillContainer
      {id}
      class="prop-quill--rich-text {className}"
      placeholder={prop.label}
      name={prop.name + LocalStorageService.get('lang')}
      ops={value.ops}
      noMenu={true}
      on:update={(event) => {
        value.ops = event.detail.ops;
        value.text = event.detail.text;
        prop.value = value;
        dispatch('update', prop);
      }}
      {toolbar}
      on:move
      on:add
      on:remove />
    <!-- {/if} -->
  </div>
</SinglePropWrapper>
