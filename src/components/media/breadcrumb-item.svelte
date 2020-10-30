<script lang="ts">
  import { MediaAggregate, MediaType } from '@becomes/cms-sdk';
  import { Link } from '../index';

  export let item: MediaAggregate;

  function isActive() {
    const id = window.location.pathname.split('/')[4];
    function containsId(item: MediaAggregate) {
      if (item.type !== MediaType.DIR) {
        return false;
      }
      if (item._id === id) {
        return true;
      } else if (item.children && item.children.length) {
        return item.children.find((e) => {
          return containsId(e);
        });
      } else {
        return false;
      }
    }

    return containsId(item);
  }
</script>

{#if isActive()}
  <li class="media--breadcrumb-list-item">
    <Link href={`/dashboard/media/editor/${item._id}`}>
      <span>{item.name}</span>
    </Link>
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
    {#if item.children?.length}
      <div>
        <ul>
          {#each item.children as childItem}
            <svelte:self item={childItem} />
          {/each}
        </ul>
      </div>
    {/if}
  </li>
{/if}
