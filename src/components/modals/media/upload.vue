<script lang="tsx">
import { defineComponent, onMounted, ref } from 'vue';
import type {
  BCMSModalServiceItemInputDefaults,
  BCMSUploadMediaModalInputData,
  BCMSUploadMediaModalOutputData,
} from '../../../types';
import type { UppyFile } from '@uppy/core';
import Modal from '../_modal.vue';
import { Uppy } from '@uppy/core';
import UppyDashboard from '@uppy/dashboard';
import UppyImageEditor from '@uppy/image-editor';

interface Data
  extends BCMSModalServiceItemInputDefaults<BCMSUploadMediaModalOutputData> {
  files: UppyFile[];
}

const component = defineComponent({
  setup() {
    const show = ref(false);
    const modalData = ref(getData());
    const container = ref<HTMLDivElement>();
    let uppy: Uppy;

    window.bcms.services.modal.media.upload = {
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
        title: 'Upload files',
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
      uppy.cancelAll();
      window.bcms.services.modal.media.upload.hide();
    }
    function done() {
      modalData.value.files = uppy.getFiles();
      if (modalData.value.files.length === 0) {
        window.bcms.services.notification.warning(
          'There are no files to upload.'
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
      uppy.cancelAll();
      window.bcms.services.modal.media.upload.hide();
    }

    onMounted(() => {
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
