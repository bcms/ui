<script lang="ts">
  import type { BreadcrumbTreeItem } from '../../types';
  import { beforeUpdate, createEventDispatcher, onMount } from 'svelte';
  import { GeneralService, sdk } from '../../services';
  import type { Media } from '@becomes/cms-sdk';
  import { ChevronRightIcon } from '../icons';

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
    </li>
    {#each tree as item}
      <li class="media--breadcrumb-list-item">
        <ChevronRightIcon />
        <button
          on:click={() => {
            dispatch('open', item.id);
          }}><span>{item.label}</span></button>
      </li>
    {/each}
  </ul>
</nav>
