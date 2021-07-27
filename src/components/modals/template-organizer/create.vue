<script lang="tsx">
import { defineComponent, ref } from 'vue';
import {
  BCMSModalInputDefaults,
  BCMSTemplateOrganizerCreateModalInputData,
  BCMSTemplateOrganizerCreateModalOutputData,
} from '../../../types';
import Modal from '../_modal.vue';
import { BCMSTextInput } from '../../input';

interface Data
  extends BCMSModalInputDefaults<BCMSTemplateOrganizerCreateModalOutputData> {
  name: {
    value: string;
    error: string;
  };
}

const component = defineComponent({
  setup() {
    const show = ref(false);
    const modalData = ref<Data>(getData());

    window.bcms.modal.templateOrganizer.create = {
      hide() {
        show.value = false;
      },
      show(data) {
        modalData.value = getData(data);
        show.value = true;
      },
    };

    function getData(
      inputData?: BCMSTemplateOrganizerCreateModalInputData
    ): Data {
      const d: Data = {
        title: 'Organize entries',
        name: {
          value: '',
          error: '',
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
        if (inputData.name) {
          d.name.value = inputData.name;
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
      window.bcms.modal.templateOrganizer.create.hide();
    }
    function done() {
      if (modalData.value.name.value.replace(/ /g, '') === '') {
        modalData.value.name.error = 'Please name your collection.';
        return;
      }
      modalData.value.name.error = '';
      if (modalData.value.onDone) {
        const result = modalData.value.onDone({
          name: modalData.value.name.value,
        });
        if (result instanceof Promise) {
          result.catch((error) => {
            console.error(error);
          });
        }
      }
      window.bcms.modal.templateOrganizer.create.hide();
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
            value={modalData.value.name.value}
            invalidText={modalData.value.name.error}
            placeholder="Name the collection"
            onInput={(value) => {
              modalData.value.name.value = value;
            }}
          />
        </Modal>
      );
    };
  },
});
export default component;
</script>
