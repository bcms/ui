<script lang="tsx">
import { defineComponent, ref } from 'vue';
import type { BCMSMedia } from '@becomes/cms-sdk/types';
import {
  BCMSMediaPickerModalInputData,
  BCMSMediaPickerModalOutputData,
  BCMSModalInputDefaults,
} from '../../../types';
import Modal from '../_modal.vue';
import { BCMSMediaViewer } from '../../media';

interface Data extends BCMSModalInputDefaults<BCMSMediaPickerModalOutputData> {
  media?: BCMSMedia;
}

const component = defineComponent({
  setup() {
    const show = ref(false);
    const modalData = ref(getData());

    window.bcms.modal.media.picker = {
      hide() {
        show.value = false;
      },
      show(data) {
        modalData.value = getData(data);
        show.value = true;
      },
    };

    function getData(inputData?: BCMSMediaPickerModalInputData): Data {
      const d: Data = {
        title: 'Media picker',
      };
      if (inputData) {
        if (inputData.title) {
          d.title = inputData.title;
        }
        if (inputData.onDone) {
          d.onDone = inputData.onDone;
        }
        if (inputData.onCancel) {
          d.onCancel = inputData.onCancel;
        }
        if (inputData.media) {
          d.media = inputData.media;
        }
      }
      return d;
    }
    function cancel() {
      if (modalData.value.onCancel) {
        const result = modalData.value.onCancel();
        if (result instanceof Promise) {
          result.catch((error) => {
            console.error(error);
          });
        }
      }
      window.bcms.modal.media.picker.hide();
    }
    function done() {
      if (!modalData.value.media) {
        window.bcms.notification.warning('You must select a media file.');
        return;
      }
      if (modalData.value.onDone) {
        const result = modalData.value.onDone({
          media: modalData.value.media,
        });
        if (result instanceof Promise) {
          result.catch((error) => {
            console.error(error);
          });
        }
      }
      window.bcms.modal.media.picker.hide();
    }

    return () => (
      <Modal
        title={modalData.value.title}
        onCancel={cancel}
        onDone={done}
        show={show.value}
        class="bcmsModal_mediaPicker"
      >
        <div class="mb-4">
          <BCMSMediaViewer
            mode="select"
            media={modalData.value.media}
            onSelect={(media) => {
              modalData.value.media = media;
            }}
          />
        </div>
      </Modal>
    );
  },
});
export default component;
</script>

<style lang="scss">
.bcmsModal_mediaPicker {
  .bcmsModal {
    &--inner {
      max-width: 700px !important;
      header {
        @apply mb-7.5 #{!important};
        .bcmsButton {
          &:first-of-type {
            @apply mr-0 mb-2.5 xs:mr-5 #{!important};
          }
        }
      }
    }
  }
  &.bcmsModal {
    .view--title {
      display: none;
    }
    .media {
      &--breadcrumb {
        margin-bottom: 20px;
      }
      &--list {
        margin-top: 30px;
        grid-gap: 10px;
        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
        padding: 5px;
      }
      &--item {
        border-radius: 6px;
        &-click {
          display: block;
          height: 100%;
          outline: none;
          &_more {
            border-radius: 6px;
            padding: 0 5px;
          }
        }
        &-visual {
          &::before {
            padding-top: 100%;
          }
          &-inner {
            height: 100%;
          }
        }
        &-name {
          margin-right: 10px;
        }
        &-delete {
          display: none;
        }
        &_DIR {
          grid-column: span 2;
        }
        &:not(.media--item_DIR) {
          transition: opacity 0.22s;
          &:hover {
            opacity: 0.85;
          }
          .media--item {
            &-footer {
              display: none;
            }
          }
        }
        &_selected {
          box-shadow: 0px 2px 10px rgba(151, 152, 171, 0.25);
          border: 2px solid rgba(var(--green), 1);
        }
      }
    }
  }
}
</style>
