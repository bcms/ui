<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Button from './button.svelte';
  import { DateUtil } from '../util';

  export let id: string;
  export let createdAt: number;
  export let updatedAt: number;
  export let name: string;
  export let description: string;
  export let singleEntry: boolean = undefined;

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
    </div>
    <p class="entityInfo--description mb--60">
      {description ? description : 'No description provided'}
    </p>
    {#if typeof singleEntry === 'boolean'}
      <p class="bcmsInput--label">Entry type</p>
      <label class="checkboxLabel">
        <input
          type="checkbox"
          checked={singleEntry}
          on:change={(event) => {
            dispatch('editEntryType', event.target.checked);
          }} />
        <span class="checkboxLabel-textContent ml--10">Single</span>
      </label>
    {/if}
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
