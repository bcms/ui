<script lang="tsx">
import { defineComponent, ref } from 'vue';
import {
  BCMSAddUpdateTemplateModalInputData,
  BCMSAddUpdateTemplateModalOutputData,
  BCMSModalInputDefaults,
} from '../../types';
import Modal from './_modal.vue';
import { BCMSMarkdownInput, BCMSTextInput, BCMSToggleInput } from '../input';

interface Data
  extends BCMSModalInputDefaults<BCMSAddUpdateTemplateModalOutputData> {
  label: string;
  originalLabel: string;
  mode: 'add' | 'update';
  desc: string;
  names: string[];
  singleEntry: boolean;
  errors: {
    label: string;
    desc: string;
  };
}

const component = defineComponent({
  setup() {
    const show = ref(false);
    const modalData = ref(getData());

    window.bcms.modal.addUpdate.template = {
      hide() {
        show.value = false;
      },
      show(data) {
        modalData.value = getData(data);
        show.value = true;
      },
    };

    function getData(inputData?: BCMSAddUpdateTemplateModalInputData) {
      const d: Data = {
        title: 'Add/Update template',
        label: '',
        originalLabel: '',
        desc: '',
        mode: 'add',
        singleEntry: false,
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
        if (inputData.singleEntry) {
          d.singleEntry = inputData.singleEntry;
        }
        d.mode = inputData.mode;
        d.names = inputData.templateNames;
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
      window.bcms.modal.addUpdate.template.hide();
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
        modalData.value.errors.label = `Template with label "${modalData.value.label}" already exist.`;
        return;
      }
      modalData.value.errors.label = '';
      if (modalData.value.onDone) {
        const result = modalData.value.onDone({
          label: modalData.value.label,
          desc: modalData.value.desc,
          singleEntry: modalData.value.singleEntry,
        });
        if (result instanceof Promise) {
          result.catch((error) => {
            console.error(error);
          });
        }
      }
      window.bcms.modal.addUpdate.template.hide();
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
            placeholder="Template's label"
            invalidText={modalData.value.errors.label}
            v-model={modalData.value.label}
          />
        </div>
        <div class="mb-4">
          <BCMSMarkdownInput
            label="Description"
            placeholder="Template's description"
            invalidText={modalData.value.errors.desc}
            v-model={modalData.value.desc}
            helperText="*Supports markdown"
          />
        </div>
        <div class="mb-4">
          <BCMSToggleInput
            label="Single entry"
            v-model={modalData.value.singleEntry}
            helperText="This template will be able to have only 1 entry."
          />
        </div>
      </Modal>
    );
  },
});
export default component;
</script>
