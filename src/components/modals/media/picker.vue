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
import { useI18n } from 'vue-i18n';

interface Data extends BCMSModalInputDefaults<BCMSMediaPickerModalOutputData> {
  media?: BCMSMedia;
}

const component = defineComponent({
  setup() {
    const { t: i18n } = useI18n();
    const show = ref(false);
    const modalData = ref(getData());

    window.bcms.modal.media.picker.hide = () => {
      show.value = false;
    };
    window.bcms.modal.media.picker.show = (data) => {
      modalData.value = getData(data);
      show.value = true;
    };

    function getData(inputData?: BCMSMediaPickerModalInputData): Data {
      const d: Data = {
        title: i18n('modal.mediaPicker.title'),
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
        window.bcms.notification.warning(
          i18n('modal.mediaPicker.error.emptyFile')
        );
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
        onScroll={(event) => {
          if (window.bcms.modal.media.picker.triggerEvent) {
            window.bcms.modal.media.picker.triggerEvent('scroll', event);
          }
        }}
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
