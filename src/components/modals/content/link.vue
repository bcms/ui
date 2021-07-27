<script lang="tsx">
import { defineComponent, ref } from 'vue';
import Modal from '../_modal.vue';
import { BCMSTextInput } from '../../input';
import {
  BCMSContentEditorLinkModalInputData,
  BCMSContentEditorLinkModalOutputData,
  BCMSModalInputDefaults,
} from '../../../types';

interface Data
  extends BCMSModalInputDefaults<BCMSContentEditorLinkModalOutputData> {
  href: {
    value: string;
    error: string;
  };
}

const component = defineComponent({
  setup() {
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
        title: 'Link URL',
        href: {
          value: 'test',
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
        !modalData.value.href.value.startsWith('http://') &&
        !modalData.value.href.value.startsWith('https://')
      ) {
        modalData.value.href.error = 'Invalid URL was provided.';
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
          actionName="Add"
          onDone={done}
          onCancel={cancel}
        >
          <BCMSTextInput
            label="URL"
            invalidText={modalData.value.href.error}
            helperText="Link must start with http:// or https://"
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
