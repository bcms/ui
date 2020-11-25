<script lang="ts">
  import type { BreadcrumbTreeItem } from '../../types';
  import { beforeUpdate, createEventDispatcher, onMount } from 'svelte';
  import { GeneralService, sdk } from '../../services';
  import type { Media } from '@becomes/cms-sdk';

  export let mediaId: string = '';

  const dispatch = createEventDispatcher();
  const buffer = {
    mediaId: '' + mediaId,
  };
  let tree: BreadcrumbTreeItem[] = [];

  async function getParentTree(
    parentId?: string
  ): Promise<
    Array<{
      label: string;
      id: string;
    }>
  > {
    const output: Array<{
      label: string;
      id: string;
    }> = [];
    if (!parentId) {
      return output;
    }
    const parent: Media = await GeneralService.errorWrapper(
      async () => {
        return await sdk.media.get(parentId);
      },
      async (value: Media) => {
        return value;
      }
    );
    // const parent = await sdk.media.get(parentId);
    if (!parent) {
      return output;
    }
    output.push({
      label: parent.name,
      id: parent._id,
    });
    if (parent.isInRoot) {
      return output;
    }
    return [...output, ...(await getParentTree(parent.parentId))];
  }

  onMount(async () => {
    tree = (await getParentTree(mediaId)).reverse();
  });
  beforeUpdate(async () => {
    if (buffer.mediaId !== mediaId) {
      buffer.mediaId = '' + mediaId;
      tree = (await getParentTree(mediaId)).reverse();
    }
  });
</script>

<nav class="media--breadcrumb">
  <ul class="media--breadcrumb-list">
    <li class="media--breadcrumb-list-item">
      <button
        on:click={() => {
          dispatch('open', '');
        }}><span>Media Manager</span></button>
      <svg
        height="8"
        viewBox="0 0 5 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0.167368 7.83263C-0.0557891 7.60948 -0.0557892 7.24767 0.167368 7.02451L3.19188 4L0.167367 0.975489C-0.0557895 0.752333 -0.0557895 0.390525 0.167367 0.167367C0.390524 -0.055789 0.752333 -0.055789 0.975489 0.167367L4.40406 3.59594C4.62722 3.8191 4.62722 4.1809 4.40406 4.40406L0.97549 7.83263C0.752333 8.05579 0.390524 8.05579 0.167368 7.83263Z" />
      </svg>
    </li>
    {#each tree as item}
      <li class="media--breadcrumb-list-item">
        <button
          on:click={() => {
            dispatch('open', item.id);
          }}><span>{item.label}</span></button>
        <svg
          height="8"
          viewBox="0 0 5 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M0.167368 7.83263C-0.0557891 7.60948 -0.0557892 7.24767 0.167368 7.02451L3.19188 4L0.167367 0.975489C-0.0557895 0.752333 -0.0557895 0.390525 0.167367 0.167367C0.390524 -0.055789 0.752333 -0.055789 0.975489 0.167367L4.40406 3.59594C4.62722 3.8191 4.62722 4.1809 4.40406 4.40406L0.97549 7.83263C0.752333 8.05579 0.390524 8.05579 0.167368 7.83263Z" />
        </svg>
      </li>
    {/each}
  </ul>
</nav>
