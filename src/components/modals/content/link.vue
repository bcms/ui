<script lang="tsx">
import { defineComponent, ref } from 'vue';
import Modal from '../_modal.vue';
import { BCMSTextInput } from '../../input';
import {
  BCMSContentEditorLinkModalInputData,
  BCMSContentEditorLinkModalOutputData,
  BCMSModalInputDefaults,
} from '../../../types';
import { useI18n } from 'vue-i18n';

interface Data
  extends BCMSModalInputDefaults<BCMSContentEditorLinkModalOutputData> {
  href: {
    value: string;
    error: string;
  };
}

const component = defineComponent({
  setup() {
    const { t: i18n } = useI18n();
    const show = ref(false);
    const modalData = ref<Data>(getData());

    window.bcms.modal.content.link = {
      hide() {
        show.value = false;
      },
      show(data) {
        modalData.value = getData(data);
        show.value = true;
      },
    };

    function getData(inputData?: BCMSContentEditorLinkModalInputData): Data {
      const d: Data = {
        title: i18n('modal.contentLink.title'),
        href: {
          value: '',
          error: '',
        },
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
        if (inputData.href) {
          d.href.value = inputData.href;
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
      window.bcms.modal.content.link.hide();
    }
    function done() {
      if (
        modalData.value.href.value &&
        !modalData.value.href.value.startsWith('http://') &&
        !modalData.value.href.value.startsWith('https://')
      ) {
        modalData.value.href.error = i18n('modal.contentLink.error.wrongUrl');
        return;
      }
      modalData.value.href.error = '';
      if (modalData.value.onDone) {
        const result = modalData.value.onDone({
          href: modalData.value.href.value,
        });
        if (result instanceof Promise) {
          result.catch((error) => {
            console.error(error);
          });
        }
      }
      window.bcms.modal.content.link.hide();
    }

    return () => {
      return (
        <Modal
          title={modalData.value.title}
          show={show.value}
          actionName="Set"
          onDone={done}
          onCancel={cancel}
        >
          <BCMSTextInput
            label={i18n('modal.contentLink.input.url.label')}
            invalidText={modalData.value.href.error}
            helperText={i18n('modal.contentLink.input.url.helperText')}
            focusOnLoad
            value={modalData.value.href.value}
            onInput={(value) => {
              modalData.value.href.value = value;
            }}
          />
        </Modal>
      );
    };
  },
});
export default component;
</script>
