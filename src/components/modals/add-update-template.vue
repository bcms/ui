<script lang="tsx">
import { defineComponent, ref } from 'vue';
import type {
  BCMSAddUpdateTemplateModalInputData,
  BCMSAddUpdateTemplateModalOutputData,
  BCMSModalInputDefaults,
} from '../../types';
import Modal from './_modal.vue';
import { BCMSMarkdownInput, BCMSTextInput, BCMSToggleInput } from '../input';
import { useI18n } from 'vue-i18n';

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
    const { t: i18n } = useI18n();
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
        title: i18n('modal.addUpdateTemplate.title'),
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
        modalData.value.errors.label = i18n(
          'modal.addUpdateTemplate.error.emptyLabel'
        );
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
        modalData.value.errors.label = i18n(
          'modal.addUpdateTemplate.error.duplicateLabel',
          { label: modalData.value.label }
        );
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
            label={i18n('modal.addUpdateTemplate.input.label.label')}
            placeholder={i18n(
              'modal.addUpdateTemplate.input.label.placeholder'
            )}
            invalidText={modalData.value.errors.label}
            v-model={modalData.value.label}
            focusOnLoad
          />
        </div>
        <div class="mb-4">
          <BCMSMarkdownInput
            label={i18n('modal.addUpdateTemplate.input.description.label')}
            placeholder={i18n(
              'modal.addUpdateTemplate.input.description.placeholder'
            )}
            invalidText={modalData.value.errors.desc}
            v-model={modalData.value.desc}
            helperText={i18n(
              'modal.addUpdateTemplate.input.description.helperText'
            )}
          />
        </div>
        <div class="mb-4">
          <BCMSToggleInput
            label={i18n('modal.addUpdateTemplate.input.singleEntry.label')}
            v-model={modalData.value.singleEntry}
            helperText={i18n(
              'modal.addUpdateTemplate.input.singleEntry.helperText'
            )}
          />
        </div>
      </Modal>
    );
  },
});
export default component;
</script>
