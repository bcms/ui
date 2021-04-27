<template>
  <Modal
    :title="title"
    :show="show"
    actionName="Confirm"
    @done="done"
    @cancel="cancel"
    class="bcmsModal_addProp"
  >
    <template v-slot:header>
      <div>
        <h2 v-if="stage === 0">Select a property type</h2>
        <button v-else class="bcmsModal--header-addNewProp" @click="back">
          <span class="mr-10">&#9666;</span>
          <h2 class="bcmsModal--title">
            {{
              window.bcms.services.general.string.toPretty(
                modalData.selected.type
              )
            }}
          </h2>
        </button>
      </div>
    </template>
    <div class="bcmsModal--property">
      <template v-if="stage === 0">
        <div>
          <template
            v-for="(propType, propTypeIndex) in modalData.types"
            :key="propTypeIndex"
          >
            <button
              @click="
                () => {
                  modalData.selected.type = propType.value;
                  next();
                }
              "
              class="bcmsModal--property-button mb-20"
              title="{propType.desc}"
            >
              <div class="bcmsModal--property-name mr-20">
                {{ propType.name }}
              </div>
              <div class="bcmsModal--property-description">
                {{ propType.desc }}
              </div>
            </button>
          </template>
        </div>
      </template>
      <template v-else>
        <div class="bcmsModal--row">
          <BCMSTextInput
            label="Label"
            placeholder="Label"
            v-model="modalData.prop.label"
            :invalidText="modalData.errors.name"
          />
        </div>
        <template v-if="modalData.selected.type === 'ENUMERATION'">
          <div class="bcmsModal--row">
            <BCMSMultiAddInput
              label="Enumerations"
              placeholder="Type something and press Enter key"
              :value="[]"
              :invalidText="modalData.errors.enum"
              :format="enumLogic.format"
              :validate="enumLogic.validate"
              @input="enumLogic.addItems"
            />
          </div>
        </template>
        <template v-else-if="modalData.selected.type === 'GROUP_POINTER'">
          <div class="bcmsModal--row">
            <BCMSGroupPointerSelect
              :selected="modalData.prop.value._id"
              :invalidText="modalData.errors.groupPointer"
              @change="
                (data) => {
                  modalData.prop.value._id = data.value;
                }
              "
            />
          </div>
        </template>
        <template v-else-if="modalData.selected.type === 'ENTRY_POINTER'">
          <div class="bcmsModal--row">
            <BCMSEntryPointerSelect
              :selected="modalData.prop.value.templateId"
              :invalidText="modalData.errors.entryPointer"
              @change="
                (data) => {
                  modalData.prop.value.templateId = data.value;
                }
              "
            />
          </div>
        </template>
        <div
          v-if="modalData.selected.type !== 'GROUP_POINTER'"
          class="bcmsModal--row"
        >
          <BCMSToggleInput
            v-model="modalData.prop.required"
            label="Required"
            :states="['Yes', 'No']"
          />
        </div>
        <div
          v-if="
            modalData.selected.type !== 'ENUMERATION' &&
            modalData.selected.type !== 'RICH_TEXT'
          "
          class="bcmsModal--row"
        >
          <BCMSToggleInput
            v-model="modalData.prop.array"
            label="Array"
            :states="['Yes', 'No']"
          />
        </div>
      </template>
    </div>
    <template v-slot:actions>
      <template v-if="stage > 0">
        <BCMSButton @click="done">
          <span>Create</span>
        </BCMSButton>
        <BCMSButton kind="ghost" @click="back">Back</BCMSButton>
      </template>
    </template>
  </Modal>
</template>

<script lang="tsx">
import { defineComponent, ref } from 'vue';
import {
  BCMSProp,
  BCMSPropType,
  BCMSPropEnum,
  BCMSPropQuill,
  BCMSPropEntryPointer,
  BCMSPropGroupPointer,
} from '@becomes/cms-sdk/types';
import {
  BCMSTextInput,
  BCMSMultiAddInput,
  BCMSGroupPointerSelect,
  BCMSEntryPointerSelect,
  BCMSToggleInput,
} from '../../input';
import Modal from '../_modal.vue';
import {
  BCMSAddPropModalInputData,
  BCMSAddPropModalOutputData,
  BCMSModalServiceItemInputDefaults,
} from '../../../types';
import BCMSButton from '../../button.vue';

interface Data
  extends BCMSModalServiceItemInputDefaults<BCMSAddPropModalOutputData> {
  title: string;
  stage: number;
  prop: BCMSProp;
  takenPropNames: string[];
  errors: {
    name: string;
    enum: string;
    groupPointer: string;
    entryPointer: string;
  };
  types: Array<{
    name: string;
    desc: string;
    value: BCMSPropType;
    hide?: boolean;
  }>;
  selected: {
    type: BCMSPropType;
    entryPointer: string;
    groupPointer: string;
  };
}

const component = defineComponent({
  components: {
    Modal,
    BCMSButton,
    BCMSTextInput,
    BCMSMultiAddInput,
    BCMSGroupPointerSelect,
    BCMSEntryPointerSelect,
    BCMSToggleInput,
  },
  setup() {
    const show = ref(false);
    const stage = ref(0);
    const title = ref('Add property');
    const modalData = ref(getData());

    window.bcms.services.modal.props.add = {
      hide() {
        show.value = false;
      },
      show(data) {
        modalData.value = getData(data);
        title.value = modalData.value.title;
        show.value = true;
      },
    };

    function getData(inputData?: BCMSAddPropModalInputData) {
      stage.value = 0;
      const d: Data = {
        stage: 0,
        title: 'Add property',
        takenPropNames: ['title', 'slug'],
        prop: {
          label: '',
          name: '',
          type: BCMSPropType.STRING,
          array: false,
          required: false,
          value: [''],
        },
        errors: {
          name: '',
          enum: '',
          groupPointer: '',
          entryPointer: '',
        },
        types: [
          {
            name: 'String',
            desc: 'Any character array value.',
            value: BCMSPropType.STRING,
          },
          {
            name: 'Rich Text',
            desc: 'Text with options for bold, itelicm, list...',
            value: BCMSPropType.RICH_TEXT,
          },
          {
            name: 'Number',
            desc: 'Any real number.',
            value: BCMSPropType.NUMBER,
          },
          {
            name: 'Date',
            desc: 'Unix timestamp - date in milliseconds.',
            value: BCMSPropType.DATE,
          },
          {
            name: 'Boolean',
            desc: 'Yes or no, true or false, 1 or 0.',
            value: BCMSPropType.BOOLEAN,
          },
          {
            name: 'Enumeration',
            desc: 'List of choices.',
            value: BCMSPropType.ENUMERATION,
          },
          {
            name: 'Media',
            desc: 'Select a media file using media picker',
            value: BCMSPropType.MEDIA,
          },
          {
            name: 'Group Pointer',
            desc: 'Extend properties od a group',
            value: BCMSPropType.GROUP_POINTER,
            hide: true,
          },
          {
            name: 'Entry Pointer',
            desc: 'Extend properties of an entry.',
            value: BCMSPropType.ENTRY_POINTER,
            hide: true,
          },
        ],
        selected: {
          type: BCMSPropType.STRING,
          entryPointer: '',
          groupPointer: '',
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
        if (inputData.takenPropNames) {
          d.takenPropNames = inputData.takenPropNames;
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
      window.bcms.services.modal.props.add.hide();
    }
    function done() {
      if (modalData.value.prop.label.replace(/ /g, '') === '') {
        modalData.value.errors.name = 'Label is required.';
        return;
      } else if (
        modalData.value.takenPropNames.includes(
          window.bcms.services.general.string.toUriLowDash(
            modalData.value.prop.label
          )
        )
      ) {
        modalData.value.errors.name = 'Label is already taken.';
        return;
      }
      modalData.value.errors.name = '';
      if (
        modalData.value.prop.type === BCMSPropType.GROUP_POINTER &&
        (modalData.value.prop.value as BCMSPropGroupPointer)._id === ''
      ) {
        modalData.value.errors.groupPointer = 'Please select a group.';
        return;
      }
      modalData.value.errors.groupPointer = '';
      if (
        modalData.value.prop.type === BCMSPropType.ENTRY_POINTER &&
        (modalData.value.prop.value as BCMSPropEntryPointer).templateId === ''
      ) {
        modalData.value.errors.entryPointer = 'Please select a template.';
        return;
      }
      modalData.value.errors.entryPointer = '';
      if (
        modalData.value.prop.type === BCMSPropType.ENUMERATION &&
        (modalData.value.prop.value as BCMSPropEnum).items.length === 0
      ) {
        modalData.value.errors.enum = 'At least 1 value must be provided.';
        return;
      }
      modalData.value.errors.enum = '';
      if (modalData.value.onDone) {
        const result = modalData.value.onDone(modalData.value.prop);
        if (result instanceof Promise) {
          result.catch((error) => {
            console.error(error);
          });
        }
      }
      window.bcms.services.modal.props.add.hide();
    }
    function back() {
      stage.value--;
    }
    function next() {
      switch (stage.value) {
        case 0: {
          if (!modalData.value.selected.type) {
            window.bcms.services.notification.warning(
              'You must select a type.'
            );
            return;
          }
          switch (modalData.value.selected.type) {
            case BCMSPropType.STRING:
              {
                modalData.value.prop.type = BCMSPropType.STRING;
                modalData.value.prop.value = [''];
              }
              break;
            case BCMSPropType.RICH_TEXT:
              {
                modalData.value.prop.type = BCMSPropType.RICH_TEXT;
                (modalData.value.prop.value as BCMSPropQuill) = {
                  ops: [],
                  text: '',
                };
              }
              break;
            case BCMSPropType.NUMBER:
              {
                modalData.value.prop.type = BCMSPropType.NUMBER;
                modalData.value.prop.value = [0];
              }
              break;
            case BCMSPropType.DATE:
              {
                modalData.value.prop.type = BCMSPropType.DATE;
                modalData.value.prop.value = [0];
              }
              break;
            case BCMSPropType.BOOLEAN:
              {
                modalData.value.prop.type = BCMSPropType.BOOLEAN;
                modalData.value.prop.value = [false];
              }
              break;
            case BCMSPropType.ENUMERATION:
              {
                modalData.value.prop.type = BCMSPropType.ENUMERATION;
                (modalData.value.prop.value as BCMSPropEnum) = {
                  items: [],
                  selected: '',
                };
              }
              break;
            case BCMSPropType.MEDIA:
              {
                modalData.value.prop.type = BCMSPropType.MEDIA;
                modalData.value.prop.value = [''];
              }
              break;
            case BCMSPropType.GROUP_POINTER:
              {
                modalData.value.prop.type = BCMSPropType.GROUP_POINTER;
                const value: BCMSPropGroupPointer = {
                  _id: '',
                  items: [],
                };
                modalData.value.prop.value = value;
              }
              break;
            case BCMSPropType.ENTRY_POINTER:
              {
                modalData.value.prop.type = BCMSPropType.ENTRY_POINTER;
                const value: BCMSPropEntryPointer = {
                  entryIds: [''],
                  displayProp: 'title',
                  templateId: '',
                };
                modalData.value.prop.value = value;
              }
              break;
          }
          stage.value++;
          return;
        }
      }
    }

    const enumLogic = {
      format(value: string): string {
        return window.bcms.services.general.string.toEnum(value);
      },
      validate(items: string[]): string | null {
        if (
          items.splice(0, items.length - 1).includes(items[items.length - 1])
        ) {
          return `Enumeration with name '${
            items[items.length - 1]
          }' is already added.`;
        }
        return null;
      },
      addItems(items: string[]): void {
        (modalData.value.prop.value as BCMSPropEnum).items = items;
      },
    };

    return {
      show,
      stage,
      modalData,
      title,
      window,

      done,
      cancel,
      back,
      next,
      enumLogic,
    };
  },
});
export default component;
</script>
