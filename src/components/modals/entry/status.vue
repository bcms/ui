<script lang="tsx">
import { defineComponent, onMounted, ref } from 'vue';
import type { BCMSStatus } from '@becomes/cms-sdk/types';
import {
  BCMSEntryStatusModalInputData,
  BCMSEntryStatusModalOutputData,
  BCMSModalServiceItemInputDefaults,
  BCMSStatusUpdateData,
} from '../../../types';
import { MutationTypes, useStore } from '../../../store';
import Modal from '../_modal.vue';
import { BCMSMultiAddInput } from '../../input';

interface Data
  extends BCMSModalServiceItemInputDefaults<BCMSEntryStatusModalOutputData> {
  updates: BCMSStatusUpdateData[];
}

const component = defineComponent({
  setup() {
    const store = useStore();
    const show = ref(false);
    const modalData = ref(getData());
    const startingStatusSet = ref<BCMSStatus[]>([]);
    const statuses = ref<BCMSStatus[]>([]);

    window.bcms.services.modal.entry.status = {
      hide() {
        show.value = false;
      },
      show(data) {
        modalData.value = getData(data);
        show.value = true;
      },
    };

    onMounted(async () => {
      statuses.value = store.getters.status_items;
      if (statuses.value.length === 0) {
        await window.bcms.services.error.wrapper(
          async () => {
            return await window.bcms.sdk.status.getAll();
          },
          async (result) => {
            store.commit(MutationTypes.status_set, result);
            statuses.value = result;
          }
        );
      }
      startingStatusSet.value = statuses.value;
    });

    function getData(inputData?: BCMSEntryStatusModalInputData): Data {
      const d: Data = {
        title: 'Edit entry statuses',
        updates: [],
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
      window.bcms.services.modal.entry.status.hide();
    }
    function done() {
      if (modalData.value.onDone) {
        const result = modalData.value.onDone({
          updates: modalData.value.updates,
        });
        if (result instanceof Promise) {
          result.catch((error) => {
            console.error(error);
          });
        }
      }
      window.bcms.services.modal.entry.status.hide();
    }
    function doUpdate(items: string[]) {
      if (items.length > startingStatusSet.value.length) {
        modalData.value.updates = modalData.value.updates.filter(
          (e) => e.label !== items[items.length - 1]
        );
        const statusExist = statuses.value.find(
          (e) => e.label === items[items.length - 1]
        );
        if (!statusExist) {
          modalData.value.updates.push({
            label: items[items.length - 1],
            color: '',
            type: 'create',
          });
        }
        itemsBuffer.push(items[items.length - 1]);
      } else {
        for (let i = 0; i < itemsBuffer.length; i++) {
          if (items[i] !== itemsBuffer[i]) {
            updates = updates.filter((e) => e.label !== itemsBuffer[i]);
            const statusToRemove = statuses.find(
              (e) => e.label === itemsBuffer[i]
            );
            if (statusToRemove) {
              updates.push({
                _id: statusToRemove._id,
                label: statusToRemove.label,
                color: '',
                type: 'remove',
              });
            }
            itemsBuffer.splice(i, 1);
            break;
          }
        }
      }
    }

    return () => (
      <Modal
        title={modalData.value.title}
        onCancel={cancel}
        onDone={done}
        show={show.value}
      >
        <BCMSMultiAddInput
          label="Add new status"
          placeholder="Status name"
          value={statuses.value.map((e) => e.label)}
          validate={(items) => {
            if (
              items
                .splice(0, items.length - 1)
                .includes(items[items.length - 1])
            ) {
              return `Status with name "${
                items[items.length - 1]
              }" is already added.`;
            }
            return null;
          }}
          onInput={(data) => {
            doUpdate(data);
          }}
        />
      </Modal>
    );
  },
});
export default component;
</script>
