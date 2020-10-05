<script lang="ts">
  import * as uuid from 'uuid';
  import { GeneralService, popup } from '../services';

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

<div class="popup">
  {#each messages as message}
    <div
      id={message.id}
      class="popup--message"
      style="right: {message.position}px;">
      <div class="popup--toast popup--{message.type}">
        <div class="type">
          <span
            class="fas fa-{message.type === 'error' ? 'exclamation-circle' : 'check-circle'}
              icon" />
          <span
            class="text">{GeneralService.string.toPretty(message.type)}</span>
          <button
            class="fas fa-times close"
            on:click={() => {
              popup.remove(message.id);
            }} />
        </div>
        <div class="popup--content">{message.content}</div>
      </div>
    </div>
  {/each}
</div>
