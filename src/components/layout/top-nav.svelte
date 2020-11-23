<script lang="ts">
  import type { User } from '@becomes/cms-sdk';
  import { popup, sdk } from '../../services';
  import Link from '../link.svelte';

  let user: User;

  async function init() {
    if (await sdk.isLoggedIn()) {
      user = await sdk.user.get();
    }
  }
  init().catch((error) => {
    console.error(error);
    popup.error(error.message);
  });
</script>

<div class="layout--topNav">
  <div class="layout--topNav-left">
    <Link href="/dashboard/user" class="user">
      <div class="fas fa-user icon" />&nbsp;
      <div class="name">{user ? user.username : 'Pending...'}</div>
    </Link>
  </div>
  <div class="layout--topNav-right">
    <button class="history">
      <div class="fas fa-history" />
    </button>
  </div>
</div>
