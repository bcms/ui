<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { DateUtil } from '../../util';
  import { EditIcon } from '../icons';

  export let id: string;
  export let createdAt: number;
  export let updatedAt: number;
  export let name: string;
  export let description: string;
  export let whereIsItUsed: boolean = false;
  // export let singleEntry: boolean = undefined;

  const dispatch = createEventDispatcher();
</script>

<div class="managerInfo managerInfo--cols">
  <div class="managerInfo--col managerInfo--col_left">
    <div class="managerInfo--heading">
      <h2 class="managerInfo--title">{name}</h2>
      <button
        class="managerInfo--heading-rename ml-20"
        on:click={() => {
          dispatch('edit');
        }}>
        <EditIcon />
      </button>
      {#if whereIsItUsed}
        <div class="managerInfo--heading-whereIsItUsed">
          <button
            class="bcmsButton bcmsButton_ghost"
            on:click={() => {
              dispatch('search');
            }}>
            <span>See where it is used</span>
          </button>
        </div>
      {/if}
    </div>
    {#if description !== ''}
      <div>
        <p
          on:dblclick={() => {
            dispatch('edit');
          }}
          class="managerInfo--description">
          {description}
        </p>
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
        <span class="checkboxLabel--textContent ml-10">Single</span>
      </label>
    {/if} -->
  </div>
  <div class="managerInfo--col managerInfo--col_right">
    <p class="managerInfo--basicInfo">
      <span class="managerInfo--basicInfo-title mb-10">ID</span>
      <span class="managerInfo--basicInfo-value">{id}</span>
    </p>
    <p class="managerInfo--basicInfo">
      <span class="managerInfo--basicInfo-title mb-10">Created at</span>
      <span
        class="managerInfo--basicInfo-value"
        title={DateUtil.readableDate(createdAt).tooltipDateFormat}>{DateUtil.readableDate(createdAt).dateFormat}</span>
    </p>
    <p class="managerInfo--basicInfo">
      <span class="managerInfo--basicInfo-title mb-10">Updated at</span>
      <span
        class="managerInfo--basicInfo-value"
        title={DateUtil.readableDate(updatedAt).tooltipDateFormat}>{DateUtil.readableDate(updatedAt).dateFormat}</span>
    </p>
  </div>
</div>
