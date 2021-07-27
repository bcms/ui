<script lang="tsx">
import { computed, defineComponent, onMounted, ref } from 'vue';
import {
  BCMSEntryStatusModalInputData,
  BCMSEntryStatusModalOutputData,
  BCMSModalInputDefaults,
  BCMSStatusUpdateData,
} from '../../../types';
import Modal from '../_modal.vue';
import { BCMSMultiAddInput } from '../../input';
import { useThrowable } from '../../../util';

interface Data extends BCMSModalInputDefaults<BCMSEntryStatusModalOutputData> {
  updates: BCMSStatusUpdateData[];
}

const component = defineComponent({
  setup() {
    const throwable = useThrowable();
    const store = window.bcms.sdk.store;
    const show = ref(false);
    const modalData = ref(getData());
    const startingStatusSet = computed(() => {
      return store.getters.status_find(
        (e) => e.name !== 'active' && e.name !== 'draft'
      );
    });
    const statuses = ref<string[]>([]);

    window.bcms.modal.entry.status = {
      hide() {
        show.value = false;
      },
      show(data) {
        statuses.value = startingStatusSet.value.map((e) => e.label);
        modalData.value = getData(data);
        show.value = true;
      },
    };

    onMounted(async () => {
      if (startingStatusSet.value.length === 0) {
        await throwable(async () => {
          return await window.bcms.sdk.status.getAll();
        });
      }
      statuses.value = startingStatusSet.value.map((e) => e.label);
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
      window.bcms.modal.entry.status.hide();
    }
    function done() {
      window.bcms
        .confirm('Update statuses', 'Are you sure you want to update statues?')
        .then((yes) => {
          if (yes) {
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
            window.bcms.modal.entry.status.hide();
          }
        });
    }
    function doUpdate(items: string[]) {
      if (items.length > statuses.value.length) {
        modalData.value.updates = modalData.value.updates.filter(
          (e) => e.label !== items[items.length - 1]
        );
        const statusExist = startingStatusSet.value.find(
          (e) => e.label === items[items.length - 1]
        );
        if (!statusExist) {
          modalData.value.updates.push({
            label: items[items.length - 1],
            color: '',
            type: 'create',
          });
        }
        statuses.value.push(items[items.length - 1]);
      } else {
        for (let i = 0; i < statuses.value.length; i++) {
          if (items[i] !== statuses.value[i]) {
            modalData.value.updates = modalData.value.updates.filter(
              (e) => e.label !== statuses.value[i]
            );
            const statusToRemove = startingStatusSet.value.find(
              (e) => e.label === statuses.value[i]
            );
            if (statusToRemove) {
              modalData.value.updates.push({
                _id: statusToRemove._id,
                label: statusToRemove.label,
                color: '',
                type: 'remove',
              });
            }
            statuses.value.splice(i, 1);
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
          value={statuses.value}
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
