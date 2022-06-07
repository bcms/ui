<script lang="tsx">
import { defineComponent, ref } from 'vue';
import Modal from '../_modal.vue';
import type {
  BCMSAddUpdateApiKeyModalInputData,
  BCMSAddUpdateApiKeyModalOutputData,
  BCMSModalInputDefaults,
} from '../../../types';
import { BCMSTextAreaInput, BCMSTextInput } from '../../input';
import { useI18n } from 'vue-i18n';

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
    const { t: i18n } = useI18n();
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
        title: i18n('modal.addUpdateApiKey.addTitle'),
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
        modalData.value.name.error = i18n(
          'modal.addUpdateApiKey.error.emptyLabel'
        );
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
          actionName={i18n('modal.addUpdateApiKey.actionName')}
          onDone={done}
          onCancel={cancel}
        >
          <BCMSTextInput
            class="mt-5"
            label={i18n('modal.addUpdateApiKey.input.label.label')}
            v-model={modalData.value.name.value}
            invalidText={modalData.value.name.error}
            placeholder={i18n('modal.addUpdateApiKey.input.label.placeholder')}
            focusOnLoad
          />
          <BCMSTextAreaInput
            class="mt-5"
            label={i18n('modal.addUpdateApiKey.input.description.label')}
            v-model={modalData.value.desc}
            placeholder={i18n(
              'modal.addUpdateApiKey.input.description.placeholder'
            )}
          />
        </Modal>
      );
    };
  },
});
export default component;
</script>
