<script lang="tsx">
import { defineComponent, ref } from 'vue';
import {
  BCMSAddUpdateDirModalInputData,
  BCMSAddUpdateDirModalOutputData,
  BCMSModalInputDefaults,
} from '../../../types';
import Modal from '../_modal.vue';
import { BCMSTextInput } from '../../input';

interface Data extends BCMSModalInputDefaults<BCMSAddUpdateDirModalOutputData> {
  name: string;
  takenNames: string[];
  mode: 'add' | 'update';
  errors: {
    name: string;
  };
}

const component = defineComponent({
  setup() {
    const show = ref(false);
    const modalData = ref(getData());

    window.bcms.modal.media.addUpdateDir = {
      hide() {
        show.value = false;
      },
      show(data) {
        modalData.value = getData(data);
        show.value = true;
      },
    };

    function getData(inputData?: BCMSAddUpdateDirModalInputData): Data {
      const d: Data = {
        title: 'Add directory',
        name: '',
        takenNames: [],
        mode: 'add',
        errors: {
          name: '',
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
          d.name = inputData.name;
        }
        d.mode = inputData.mode;
        d.takenNames = inputData.takenNames;
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
      window.bcms.modal.media.addUpdateDir.hide();
    }
    function done() {
      if (modalData.value.name === '') {
        modalData.value.errors.name = 'Folder name is required.';
        return;
      } else if (
        modalData.value.mode === 'add' &&
        modalData.value.takenNames.includes(modalData.value.name)
      ) {
        modalData.value.errors.name =
          `Folder "${modalData.value.name}" already exist.` +
          ' Please chose a different name.';
        return;
      }
      modalData.value.errors.name = '';
      if (modalData.value.onDone) {
        const result = modalData.value.onDone({
          name: modalData.value.name,
        });
        if (result instanceof Promise) {
          result.catch((error) => {
            console.error(error);
          });
        }
      }
      window.bcms.modal.media.addUpdateDir.hide();
    }

    return () => (
      <Modal
        title={modalData.value.title}
        onCancel={cancel}
        onDone={done}
        show={show.value}
      >
        <div class="bcmsModal--row">
          <BCMSTextInput
            label="Folder name"
            placeholder="Folder name"
            value={modalData.value.name}
            invalidText={modalData.value.errors.name}
            onInput={(value) => {
              modalData.value.name = window.bcms.util.string.toSlug(value);
            }}
          />
        </div>
      </Modal>
    );
  },
});
export default component;
</script>
