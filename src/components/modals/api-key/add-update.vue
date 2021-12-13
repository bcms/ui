<script lang="tsx">
import { defineComponent, ref } from 'vue';
import Modal from '../_modal.vue';
import {
  BCMSAddUpdateApiKeyModalInputData,
  BCMSAddUpdateApiKeyModalOutputData,
  BCMSModalInputDefaults,
} from '../../../types';
import { BCMSTextAreaInput, BCMSTextInput } from '../../input';

interface Data
  extends BCMSModalInputDefaults<BCMSAddUpdateApiKeyModalOutputData> {
  name: {
    value: string;
    error: string;
  };
  desc: string;
}

const component = defineComponent({
  setup() {
    const show = ref(false);
    const modalData = ref<Data>(getData());

    window.bcms.modal.apiKey.addUpdate = {
      hide() {
        show.value = false;
      },
      show(data) {
        modalData.value = getData(data);
        show.value = true;
      },
    };

    function getData(inputData?: BCMSAddUpdateApiKeyModalInputData): Data {
      const d: Data = {
        title: 'Add API Key',
        name: {
          value: '',
          error: '',
        },
        desc: '',
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
        if (inputData.name) {
          d.name.value = inputData.name;
        }
        if (inputData.desc) {
          d.desc = inputData.desc;
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
      window.bcms.modal.apiKey.addUpdate.hide();
    }
    function done() {
      if (!modalData.value.name.value.replace(/ /g, '')) {
        modalData.value.name.error = 'Name is required';
        return;
      }
      if (modalData.value.onDone) {
        const result = modalData.value.onDone({
          name: modalData.value.name.value,
          desc: modalData.value.desc,
        });
        if (result instanceof Promise) {
          result.catch((error) => {
            console.error(error);
          });
        }
      }
      window.bcms.modal.apiKey.addUpdate.hide();
    }

    return () => {
      return (
        <Modal
          title={modalData.value.title}
          show={show.value}
          actionName="Create"
          onDone={done}
          onCancel={cancel}
        >
          <BCMSTextInput
            class="mt-5"
            label="Name"
            v-model={modalData.value.name.value}
            invalidText={modalData.value.name.error}
            placeholder="Name"
          />
          <BCMSTextAreaInput
            class="mt-5"
            label="Description"
            v-model={modalData.value.desc}
            placeholder="Description"
          />
        </Modal>
      );
    };
  },
});
export default component;
</script>
