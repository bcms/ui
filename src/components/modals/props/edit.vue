<script lang="tsx">
import { defineComponent, ref } from 'vue';
import {
  BCMSProp,
  BCMSPropType,
  BCMSPropEnumData,
} from '@becomes/cms-sdk/types';
import Modal from '../_modal.vue';
import {
  BCMSEditPropModalInputData,
  BCMSEditPropModalOutputData,
  BCMSModalInputDefaults,
} from '../../../types';
import { BCMSTextInput, BCMSMultiAddInput, BCMSToggleInput } from '../../input';

interface Data extends BCMSModalInputDefaults<BCMSEditPropModalOutputData> {
  prop: BCMSProp;
  takenPropNames: string[];
  errors: {
    label: string;
    enum: string;
  };
}

const component = defineComponent({
  setup() {
    const show = ref(false);
    const modalData = ref(getData());

    window.bcms.modal.props.edit = {
      hide() {
        show.value = false;
      },
      show(data) {
        modalData.value = getData(data);
        show.value = true;
      },
    };

    function getData(inputData?: BCMSEditPropModalInputData) {
      const d: Data = {
        title: 'Edit property',
        prop: {
          id: '',
          label: '',
          required: false,
          name: '',
          defaultData: [''],
          type: BCMSPropType.STRING,
          array: false,
        },
        takenPropNames: [],
        errors: {
          label: '',
          enum: '',
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
        d.prop = JSON.parse(JSON.stringify(inputData.prop));
        d.takenPropNames = inputData.takenPropNames;
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
      window.bcms.modal.props.edit.hide();
    }
    function done() {
      if (modalData.value.prop.label.replace(/ /g, '') === '') {
        modalData.value.errors.label = 'Label is required.';
        return;
      } else if (
        modalData.value.takenPropNames.includes(
          window.bcms.util.string.toSlugUnderscore(modalData.value.prop.label)
        )
      ) {
        modalData.value.errors.label = 'Label is already taken.';
        return;
      }
      modalData.value.errors.label = '';
      if (
        modalData.value.prop.type === BCMSPropType.ENUMERATION &&
        (modalData.value.prop.defaultData as BCMSPropEnumData).items.length ===
          0
      ) {
        modalData.value.errors.enum = 'At least 1 value must be provided.';
        return;
      }
      modalData.value.errors.enum = '';
      if (modalData.value.onDone) {
        const result = modalData.value.onDone({
          prop: modalData.value.prop,
        });
        if (result instanceof Promise) {
          result.catch((error) => {
            console.error(error);
          });
        }
      }
      window.bcms.modal.props.edit.hide();
    }

    return () => (
      <Modal
        title={modalData.value.title}
        show={show.value}
        actionName="Update"
        onDone={done}
        onCancel={cancel}
      >
        <div class="mb-4">
          <BCMSTextInput
            label="Label"
            placeholder="Property's label"
            invalidText={modalData.value.errors.label}
            v-model={modalData.value.prop.label}
            focusOnLoad
          />
        </div>
        {modalData.value.prop.type === BCMSPropType.ENUMERATION ? (
          <div class="mb-4">
            <BCMSMultiAddInput
              label="Enumerations"
              placeholder="Type something and press Enter key"
              value={
                (modalData.value.prop.defaultData as BCMSPropEnumData).items
              }
              invalidText={modalData.value.errors.enum}
              format={(value) => {
                return window.bcms.util.string.toEnum(value);
              }}
              validate={(items) => {
                if (
                  items
                    .splice(0, items.length - 1)
                    .includes(items[items.length - 1])
                ) {
                  return `Enumeration with name '${
                    items[items.length - 1]
                  }' is already added.`;
                }
                return null;
              }}
              onInput={(items) => {
                (modalData.value.prop.defaultData as BCMSPropEnumData).items =
                  items;
              }}
            />
          </div>
        ) : (
          ''
        )}
        {modalData.value.prop.type !== BCMSPropType.GROUP_POINTER ? (
          <div class="mb-4">
            <BCMSToggleInput
              v-model={modalData.value.prop.required}
              label="Required"
              states={['Yes', 'No']}
            />
          </div>
        ) : (
          ''
        )}
      </Modal>
    );
  },
});
export default component;
</script>
