<script lang="tsx">
import { defineComponent, ref } from 'vue';
import Modal from '../_modal.vue';
import {
  BCMSViewUserModalInputData,
  BCMSViewUserModalOutputData,
  BCMSModalInputDefaults,
} from '../../../types';

type Data = BCMSModalInputDefaults<BCMSViewUserModalOutputData>;

const component = defineComponent({
  setup() {
    const show = ref(false);
    const modalData = ref<Data>(getData());

    window.bcms.modal.settings.view = {
      hide() {
        show.value = false;
      },
      show(data) {
        modalData.value = getData(data);
        show.value = true;
      },
    };

    function getData(inputData?: BCMSViewUserModalInputData): Data {
      const d: Data = {
        title: 'View user',
        onCancel() {
          // ...
        },
        onDone() {
          // ...
        },
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
      window.bcms.modal.settings.view.hide();
    }
    function done() {
      if (modalData.value.onDone) {
        const result = modalData.value.onDone();
        if (result instanceof Promise) {
          result.catch((error) => {
            console.error(error);
          });
        }
      }
      window.bcms.modal.settings.view.hide();
    }

    return () => {
      return (
        <Modal
          title={modalData.value.title}
          show={show.value}
          actionName="Done"
          onDone={done}
          onCancel={cancel}
        ></Modal>
      );
    };
  },
});
export default component;
</script>
