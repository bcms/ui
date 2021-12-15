<script lang="tsx">
import { defineComponent, ref } from 'vue';
import Modal from '../_modal.vue';
import {
  BCMSInviteUserModalInputData,
  BCMSInviteUserModalOutputData,
  BCMSModalInputDefaults,
} from '../../../types';
import { BCMSSelect } from '../../input';

type Data = BCMSModalInputDefaults<BCMSInviteUserModalOutputData>;

const component = defineComponent({
  setup() {
    const show = ref(false);
    const role = ref({
      selected: {
        value: '',
        error: '',
      },
      options: ['Admin', 'Developer', 'Custom'],
    });
    const modalData = ref<Data>(getData());

    window.bcms.modal.settings.invite = {
      hide() {
        show.value = false;
      },
      show(data) {
        modalData.value = getData(data);
        show.value = true;
        role.value.selected.value = '';
      },
    };

    function getData(inputData?: BCMSInviteUserModalInputData): Data {
      const d: Data = {
        title: 'Invite user',
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
      window.bcms.modal.settings.invite.hide();
    }
    function done() {
      if (!role.value.selected.value) {
        role.value.selected.error = 'Role is required';
        return;
      }
      role.value.selected.error = '';

      if (modalData.value.onDone) {
        const result = modalData.value.onDone();
        if (result instanceof Promise) {
          result.catch((error) => {
            console.error(error);
          });
        }
      }
      window.bcms.modal.settings.invite.hide();
    }

    return () => {
      return (
        <Modal
          title={modalData.value.title}
          show={show.value}
          actionName="Invite"
          allowBodyScroll={false}
          onDone={done}
          onCancel={cancel}
        >
          <BCMSSelect
            label="Select role"
            placeholder="Admin, Developer or Custom"
            selected={role.value.selected.value}
            options={role.value.options.map((e) => {
              return { label: `${e}`, value: e.toLowerCase() };
            })}
            invalidText={role.value.selected.error}
            onChange={(option) => {
              role.value.selected.value = option.value;
            }}
          />
        </Modal>
      );
    };
  },
});
export default component;
</script>
