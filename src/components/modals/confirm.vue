<script lang="tsx">
import { defineComponent, ref } from 'vue';
import Modal from './_modal.vue';
import {
  BCMSConfirmModalInputData,
  BCMSConfirmModalOutputData,
  BCMSModalServiceItemInputDefaults,
} from '../../types';
import { BCMSModalService } from '../../services';
import { TextInput } from '@/components';

interface Data extends ModalServiceItemInputDefaults<ConfirmModalOutputData> {
  body: string;
  prompt?: {
    invalidText: string;
    input: string;
    verify: string;
  };
}

const component = defineComponent({
  setup() {
    const show = ref(false);
    const modalData = ref(getData());

    ModalService.confirm = {
      hide() {
        show.value = false;
      },
      show(data) {
        modalData.value = getData(data);
        show.value = true;
      },
    };

    function getData(inputData?: ConfirmModalInputData): Data {
      const d: Data = {
        title: 'Confirm',
        body: '',
        prompt: undefined,
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
        if (inputData.prompt) {
          d.prompt = {
            invalidText: `You must type "${inputData.prompt}"`,
            input: inputData.prompt,
            verify: '',
          };
        }
        if (inputData.body) {
          d.body = inputData.body;
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
      ModalService.confirm.hide();
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
      ModalService.confirm.hide();
    }

    return () => {
      return (
        <Modal
          title={modalData.value.title}
          show={show.value}
          actionName="Confirm"
          onDone={done}
          onCancel={cancel}
        >
          {modalData.value.body ? (
            <>
              <div
                class="bcmsModal--confirm-warningMessage"
                v-html={modalData.value.body}
              />
              {modalData.value.prompt ? (
                <TextInput
                  class="bcmsModal--confirm-prompt"
                  label="Confirm"
                  helperText="Please write <strong>{data.prompt.input}</strong> "
                  v-model={modalData.value.prompt.verify}
                  placeholder={modalData.value.prompt.input}
                  onEnter={() => {
                    done();
                  }}
                />
              ) : (
                ''
              )}
            </>
          ) : (
            ''
          )}
        </Modal>
      );
    };
  },
});
export default component;
</script>
