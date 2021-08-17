<script lang="tsx">
import { defineComponent, ref } from 'vue';
import type { BCMSEntry } from '@becomes/cms-sdk/types';
import Modal from '../_modal.vue';
import BCMSCodeEditor from '../../code-editor.vue';
import {
  BCMSModalInputDefaults,
  BCMSViewEntryModelModalInputData,
  BCMSViewEntryModelModalOutputData,
} from '../../../types';
import BCMSButton from '../../button.vue';

interface Data
  extends BCMSModalInputDefaults<BCMSViewEntryModelModalOutputData> {
  entryId: string;
  templateId: string;
}

const component = defineComponent({
  setup() {
    const throwable = window.bcms.util.throwable;
    const store = window.bcms.sdk.store;
    const show = ref(false);
    const code = ref('// No entry is selected');
    const modalData = ref(getData());
    const type = ref<'original' | 'parsed'>('original');

    window.bcms.modal.entry.viewModel = {
      hide() {
        show.value = false;
      },
      show(data) {
        modalData.value = getData(data);
        show.value = true;
      },
    };

    function parseEntry(entry: BCMSEntry): string {
      return JSON.stringify(entry, null, '  ');
    }
    function getData(inputData?: BCMSViewEntryModelModalInputData): Data {
      code.value = '// No entry is selected';
      const d: Data = {
        title: 'View entry model',
        templateId: '',
        entryId: '',
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
        d.templateId = inputData.templateId;
        d.entryId = inputData.entryId;
        const entry = store.getters.entry_findOne((e) => e._id === d.entryId);
        if (entry) {
          code.value = parseEntry(entry);
        } else {
          throwable(
            async () => {
              return await window.bcms.sdk.entry.get({
                templateId: d.templateId,
                entryId: d.entryId,
              });
            },
            async (result) => {
              code.value = parseEntry(result);
            }
          ).catch((error) => {
            console.error(error);
          });
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
      window.bcms.modal.entry.viewModel.hide();
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
      window.bcms.modal.entry.viewModel.hide();
    }

    return () => (
      <Modal
        title={modalData.value.title}
        onCancel={cancel}
        onDone={done}
        show={show.value}
        class="bcmsViewModelModal"
      >
        <div class="bcmsViewModelModal--head">
          <BCMSButton
            class={type.value === 'original' ? 'is-active' : ''}
            disabled={type.value === 'original'}
            kind="alternate"
            onClick={() => {
              type.value = 'original';
            }}
          >
            Original
          </BCMSButton>
          <BCMSButton
            class={type.value === 'parsed' ? 'is-active' : ''}
            disabled={type.value === 'parsed'}
            kind="alternate"
            onClick={() => {
              type.value = 'parsed';
            }}
          >
            Parsed
          </BCMSButton>
        </div>
        <BCMSCodeEditor readOnly={true} code={code.value} />
      </Modal>
    );
  },
});
export default component;
</script>
