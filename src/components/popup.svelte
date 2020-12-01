<script lang="ts">
  import * as uuid from 'uuid';
  import { popup } from '../services';
  import { AlertTriangleIcon, CloseIcon, SuccessIcon } from './icons';

  let messages = [];
  const timeout = 8000;

  popup.remove = (messageId) => {
    messages = messages.filter((message) => message.id !== messageId);
  };
  popup.error = (content) => {
    popup.push('error', content);
  };
  popup.success = (content) => {
    popup.push('success', content);
  };
  popup.push = (type, content) => {
    switch (type) {
      case 'error':
        {
          const message = {
            id: uuid.v4(),
            position: 0,
            type,
            content,
          };
          messages = [...messages, message];
          setTimeout(() => {
            message.position = 370;
            messages = [...messages];
          }, 100);
        }
        break;
      case 'success':
        {
          const message = {
            id: uuid.v4(),
            position: 0,
            type,
            content,
          };
          messages = [...messages, message];
          setTimeout(() => {
            message.position = 370;
            messages = [...messages];
          }, 100);
          setTimeout(() => {
            popup.remove(message.id);
          }, timeout);
        }
        break;
      default: {
        throw new Error(`Message of type '${type}' does not exist.`);
      }
    }
  };
</script>

<div class="bcmsPopup--wrapper">
  {#each messages as message}
    <div class="bcmsPopup--inner">
      <div id={message.id} class="bcmsPopup bcmsPopup_{message.type}">
        {#if message.type === 'error'}
          <AlertTriangleIcon />
        {:else if message.type === 'success'}
          <SuccessIcon />
        {/if}
        <p class="bcmsPopup--message">{message.content}</p>
        <button
          class="bcmsPopup--close"
          on:click={() => {
            popup.remove(message.id);
          }}>
          <CloseIcon />
        </button>
      </div>
    </div>
  {/each}
</div>
