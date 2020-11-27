<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Button } from '../';
  import { DateUtil } from '../util';
  import MarkdownBoxDisplay from './markdown-box-display.svelte';

  export let id: string;
  export let createdAt: number;
  export let updatedAt: number;
  export let name: string;
  export let description: string;
  export let whereIsItUsed: boolean = false;
  // export let singleEntry: boolean = undefined;

  const dispatch = createEventDispatcher();
</script>

<div class="entityInfo entityInfo--cols">
  <div class="entityInfo--col entityInfo--col_left">
    <div class="entityInfo--heading">
      <h2 class="entityInfo--title">{name}</h2>
      <Button
        class="entityInfo--heading-rename ml--10"
        kind="ghost"
        icon="fas fa-edit"
        size="s"
        on:click={() => {
          dispatch('edit');
        }} />
      {#if whereIsItUsed}
        <Button
          class="ml--auto"
          kind="ghost"
          icon="fas fa-search"
          on:click={() => {
            dispatch('search');
          }}>
          Where is it used
        </Button>
      {/if}
    </div>
    {#if description !== ''}
      <div>
        <p class="entityInfo--description">{description}</p>
      </div>
    {/if}
    <!-- TODO: Uncomment this part when single entry functionality is added to the backend -->
    <!-- {#if typeof singleEntry === 'boolean'}
      <p class="bcmsInput--label">Entry type</p>
      svelte-ignore a11y-label-has-associated-control
      <label class="checkboxLabel">
        <ToggleInput
          value={singleEntry}
          on:input={(event) => {
            dispatch('editEntryType', event.detail);
          }} />
        <span class="checkboxLabel--textContent ml--10">Single</span>
      </label>
    {/if} -->
  </div>
  <div class="entityInfo--col entityInfo--col_right">
    <p class="entityInfo--basicInfo">
      <span class="entityInfo--basicInfo-title mb--10">ID</span>
      <span class="entityInfo--basicInfo-value">{id}</span>
    </p>
    <p class="entityInfo--basicInfo">
      <span class="entityInfo--basicInfo-title mb--10">Created at</span>
      <span
        class="entityInfo--basicInfo-value"
        title={DateUtil.readableDate(createdAt).dateFormat}>{DateUtil.readableDate(createdAt).dateFormat}</span>
    </p>
    <p class="entityInfo--basicInfo">
      <span class="entityInfo--basicInfo-title mb--10">Updated at</span>
      <span
        class="entityInfo--basicInfo-value"
        title={DateUtil.readableDate(updatedAt).dateFormat}>{DateUtil.readableDate(updatedAt).dateFormat}</span>
    </p>
  </div>
</div>
