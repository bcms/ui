<script lang="ts">
  import { onDestroy } from 'svelte';

  import * as uuid from 'uuid';
  import { NotificationService } from '../services';
  import type { NotificationMessageType } from '../types';
  import { AlertTriangleIcon, CloseIcon, SuccessIcon } from './icons';

  interface Message {
    id: string;
    type: NotificationMessageType;
    content: string;
  }

  const notificationRegistrationId = NotificationService.register(
    (type, content) => {
      const message: Message = {
        id: uuid.v4(),
        type,
        content,
      };
      switch (type) {
        case 'info':
          {
            setTimeout(() => {
              messages = messages.filter((e) => e.id !== message.id);
            }, timeout);
          }
          break;
        case 'success':
          {
            setTimeout(() => {
              messages = messages.filter((e) => e.id !== message.id);
            }, timeout);
          }
          break;
      }
      messages = [...messages, message];
    }
  );
  const timeout = 8000;
  let messages: Message[] = [];

  onDestroy(() => {
    NotificationService.unregister(notificationRegistrationId);
  });
</script>

<div class="bcmsNotification--wrapper">
  {#each messages as message}
    <div class="bcmsNotification--inner">
      <div
        id={message.id}
        class="bcmsNotification bcmsNotification_{message.type}">
        {#if message.type === 'error'}
          <AlertTriangleIcon />
        {:else if message.type === 'success'}
          <SuccessIcon />
        {/if}
        <p class="bcmsNotification--message">{message.content}</p>
        <button
          class="bcmsNotification--close"
          on:click={() => {
            messages = messages.filter((e) => e.id !== message.id);
          }}>
          <CloseIcon />
        </button>
      </div>
    </div>
  {/each}
</div>
