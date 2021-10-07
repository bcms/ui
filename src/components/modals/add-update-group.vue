<script lang="tsx">
import { defineComponent, ref } from 'vue';
import {
  BCMSAddUpdateGroupModalInputData,
  BCMSAddUpdateGroupModalOutputData,
  BCMSModalInputDefaults,
} from '../../types';
import Modal from './_modal.vue';
import { BCMSMarkdownInput, BCMSTextInput } from '../input';

interface Data
  extends BCMSModalInputDefaults<BCMSAddUpdateGroupModalOutputData> {
  label: string;
  originalLabel: string;
  mode: 'add' | 'update';
  desc: string;
  names: string[];
  errors: {
    label: string;
    desc: string;
  };
}

const component = defineComponent({
  setup() {
    const show = ref(false);
    const modalData = ref(getData());

    window.bcms.modal.addUpdate.group = {
      hide() {
        show.value = false;
      },
      show(data) {
        modalData.value = getData(data);
        show.value = true;
      },
    };

    function getData(inputData?: BCMSAddUpdateGroupModalInputData) {
      const d: Data = {
        title: 'Add/Update group',
        label: '',
        originalLabel: '',
        desc: '',
        mode: 'add',
        names: [],
        errors: {
          label: '',
          desc: '',
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
        if (inputData.label) {
          d.label = inputData.label;
          d.originalLabel = inputData.label;
        }
        if (inputData.desc) {
          d.desc = inputData.desc;
        }
        d.mode = inputData.mode;
        d.names = inputData.groupNames;
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
      window.bcms.modal.addUpdate.group.hide();
    }
    function done() {
      if (modalData.value.label.replace(/ /g, '') === '') {
        modalData.value.errors.label = 'Label cannot be empty.';
        return;
      } else if (
        (modalData.value.mode === 'add' &&
          modalData.value.names.includes(
            window.bcms.util.string.toSlugUnderscore(modalData.value.label)
          )) ||
        (modalData.value.originalLabel !== modalData.value.label &&
          modalData.value.names.includes(
            window.bcms.util.string.toSlugUnderscore(modalData.value.label)
          ))
      ) {
        modalData.value.errors.label = `Group with label "${modalData.value.label}" already exist.`;
        return;
      }
      modalData.value.errors.label = '';
      if (modalData.value.onDone) {
        const result = modalData.value.onDone({
          label: modalData.value.label,
          desc: modalData.value.desc,
        });
        if (result instanceof Promise) {
          result.catch((error) => {
            console.error(error);
          });
        }
      }
      window.bcms.modal.addUpdate.group.hide();
    }

    return () => (
      <Modal
        class="editWidgetModal"
        title={modalData.value.title}
        onCancel={cancel}
        onDone={done}
        show={show.value}
      >
        <div class="mb-4">
          <BCMSTextInput
            label="Label"
            placeholder="Group's label"
            invalidText={modalData.value.errors.label}
            v-model={modalData.value.label}
          />
        </div>
        <div class="mb-4">
          <BCMSMarkdownInput
            label="Description"
            placeholder="Group's description"
            invalidText={modalData.value.errors.desc}
            v-model={modalData.value.desc}
            helperText="*Supports markdown"
          />
        </div>
      </Modal>
    );
  },
});
export default component;
</script>
