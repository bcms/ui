<script lang="tsx">
import * as uuid from 'uuid';
import { defineComponent, ref, onUnmounted } from 'vue';
import { BCMSNotificationMessage, BCMSNotificationMessageType } from '../types';
import BCMSIcon from './icon.vue';

const component = defineComponent({
  setup() {
    const notification = window.bcms.notification;
    const timeout = 8000;
    const notifUnreg = notification.register((type, content) => {
      const message: BCMSNotificationMessage = {
        id: uuid.v4(),
        type,
        content,
      };
      switch (type) {
        case 'info':
          {
            setTimeout(() => {
              messages.value = messages.value.filter(
                (e) => e.id !== message.id
              );
            }, timeout);
          }
          break;
        case 'warning':
          {
            setTimeout(() => {
              messages.value = messages.value.filter(
                (e) => e.id !== message.id
              );
            }, timeout);
          }
          break;
        case 'success':
          {
            setTimeout(() => {
              messages.value = messages.value.filter(
                (e) => e.id !== message.id
              );
            }, timeout);
          }
          break;
      }
      messages.value = [...messages.value, message];
    });
    const messages = ref<BCMSNotificationMessage[]>([]);

    onUnmounted(() => {
      notifUnreg();
    });

    function getTypeIcon(type: BCMSNotificationMessageType) {
      switch (type) {
        case 'error': {
          return <BCMSIcon src="/alert-triangle" />;
        }
        case 'success': {
          return <BCMSIcon src="/success" />;
        }
        case 'warning': {
          return <BCMSIcon src="/bell" />;
        }
      }
    }

    return () => {
      return (
        <div class="bcmsNotification--wrapper">
          {messages.value.map((message) => {
            return (
              <div class="bcmsNotification--inner">
                <div
                  id={message.id}
                  class={`bcmsNotification bcmsNotification_${message.type}`}
                >
                  {getTypeIcon(message.type)}
                  <p class="bcmsNotification--message">{message.content}</p>
                  <button
                    class="bcmsNotification--close"
                    onClick={() => {
                      messages.value = messages.value.filter(
                        (e) => e.id !== message.id
                      );
                    }}
                  >
                    <BCMSIcon src="/close" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      );
    };
  },
});
export default component;
</script>
