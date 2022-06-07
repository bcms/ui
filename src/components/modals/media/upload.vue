<script lang="tsx">
import { defineComponent, ref, watch } from 'vue';
import type {
  BCMSModalInputDefaults,
  BCMSUploadMediaModalInputData,
  BCMSUploadMediaModalOutputData,
} from '../../../types';
import { UppyFile, Uppy } from '@uppy/core';
import Modal from '../_modal.vue';
import UppyDashboard from '@uppy/dashboard';
import UppyImageEditor from '@uppy/image-editor';
import { useI18n } from 'vue-i18n';

interface Data extends BCMSModalInputDefaults<BCMSUploadMediaModalOutputData> {
  files: UppyFile[];
}

const component = defineComponent({
  setup() {
    const { t: i18n } = useI18n();
    const show = ref(false);
    const modalData = ref(getData());
    const container = ref<HTMLDivElement>();
    let uppy: Uppy;

    window.bcms.modal.media.upload = {
      hide() {
        show.value = false;
      },
      show(data) {
        modalData.value = getData(data);
        show.value = true;
      },
    };

    function getData(inputData?: BCMSUploadMediaModalInputData): Data {
      const d: Data = {
        title: i18n('modal.uploadMedia.title'),
        files: [],
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
      if (uppy) {
        uppy.cancelAll();
      }
      window.bcms.modal.media.upload.hide();
    }
    function done() {
      modalData.value.files = uppy.getFiles();
      if (modalData.value.files.length === 0) {
        window.bcms.notification.warning(
          i18n('modal.uploadMedia.notification.emptyFile')
        );
        return;
      }
      if (modalData.value.onDone) {
        const result = modalData.value.onDone({
          files: modalData.value.files,
        });
        if (result instanceof Promise) {
          result.catch((error) => {
            console.error(error);
          });
        }
      }
      if (uppy) {
        uppy.cancelAll();
      }
      window.bcms.modal.media.upload.hide();
    }

    watch(container, () => {
      if (!uppy && container.value) {
        uppy = new Uppy()
          .use(UppyDashboard, {
            inline: true,
            target: container.value,
            hideUploadButton: true,
          })
          .use(UppyImageEditor, {
            target: UppyDashboard,
            quality: 0.8,
          });
      } else if (uppy && !container.value) {
        uppy = null as never;
      }
    });

    return () => (
      <Modal
        title={modalData.value.title}
        onCancel={cancel}
        onDone={done}
        show={show.value}
      >
        <div ref={container} class="bcmsUppy" />
      </Modal>
    );
  },
});
export default component;
</script>
