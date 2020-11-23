<script lang="ts">
  import type { User } from '@becomes/cms-sdk';
  import { beforeUpdate } from 'svelte';
  import { Image, Layout } from '../../components';
  import { popup, sdk } from '../../services';

  export let id: string;

  const buffer = {
    id,
  };
  let user: User;

  async function init() {
    if (await sdk.isLoggedIn()) {
      if (!id) {
        user = await sdk.user.get();
        console.log(user);
      } else {
      }
    }
  }
  init().catch((error) => {
    console.error(error);
    popup.error(error.message);
  });
  beforeUpdate(() => {
    if (buffer.id !== id) {
      buffer.id = '' + id;
      init().catch((error) => {
        console.error(error);
        popup.error(error.message);
      });
    }
  });
</script>

<Layout>
  {#if user}
    <!-- <div class="userProfile">
      <div class="userProfile--info">
        <div class="avatar">
          {#if user.customPool.personal.avatarUri}
            <Image href={user.customPool.personal.avatarUri} alt="Avatar" />
          {:else}
            <div class="default fas fa-user" />
          {/if}
        </div>
      </div>
    </div> -->
  {/if}
</Layout>
