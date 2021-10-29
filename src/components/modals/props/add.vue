<template>
  <Modal
    :title="title"
    :show="show"
    actionName="Confirm"
    @done="done"
    @cancel="cancel"
    class="bcmsModal_addProp"
    :doNotShowFooter="stage === 0"
  >
    <template v-slot:header>
      <div>
        <div
          class="
            text-dark text-4xl
            -tracking-0.03
            font-normal
            line-break-anywhere
            w-full
          "
          v-if="stage === 0"
        >
          Select a property type
        </div>
        <button v-else class="flex items-center p-[5px]" @click="back">
          <span class="mr-2.5">&#9666;</span>
          <h2
            class="
              text-dark text-4xl
              -tracking-0.03
              font-normal
              line-break-anywhere
              w-full
            "
          >
            {{ window.bcms.util.string.toPretty(modalData.selected.type) }}
          </h2>
        </button>
      </div>
    </template>
    <div class="mb-4 overflow-y-auto px-7.5 xs:px-10">
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
              class="
                group
                bg-light bg-opacity-50
                border border-grey
                rounded-3xl
                w-full
                text-left
                transition-all
                duration-200
                flex
                items-center
                py-[15px]
                px-5
                text-base
                leading-tight
                mb-5
                hover:border-green
                focus:border-green
                disabled:hover:border-dark
                disabled:hover:border-opacity-30
                disabled:focus:border-dark
                disabled:focus:border-opacity-30
              "
              :title="propType.desc"
            >
              <div
                class="
                  min-w-max
                  transition-all
                  duration-200
                  mr-5
                  group-hover:text-green
                  group-focus:text-green
                "
              >
                {{ propType.name }}
              </div>
              <div
                class="
                  text-grey text-opacity-50
                  whitespace-nowrap
                  overflow-hidden overflow-ellipsis
                "
              >
                {{ propType.desc }}
              </div>
            </button>
          </template>
        </div>
      </template>
      <template v-else>
        <div class="mb-4">
          <BCMSTextInput
            label="Label"
            placeholder="Label"
            v-model="modalData.prop.label"
            :invalidText="modalData.errors.name"
          />
        </div>
        <template v-if="modalData.selected.type === 'ENUMERATION'">
          <div class="mb-4">
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
          <div class="mb-4">
            <BCMSGroupPointerSelect
              :selected="modalData.prop.defaultData._id"
              :invalidText="modalData.errors.groupPointer"
              @change="
                (data) => {
                  modalData.prop.defaultData._id = data.value;
                }
              "
            />
          </div>
        </template>
        <template v-else-if="modalData.selected.type === 'ENTRY_POINTER'">
          <div class="mb-4">
            <BCMSEntryPointerSelect
              :selected="modalData.prop.defaultData.templateId"
              :invalidText="modalData.errors.entryPointer"
              @change="
                (data) => {
                  modalData.prop.defaultData.templateId = data.value;
                }
              "
            />
          </div>
        </template>
        <div v-if="modalData.selected.type !== 'GROUP_POINTER'" class="mb-4">
          <BCMSToggleInput
            v-model="modalData.prop.required"
            label="Required"
            :states="['Yes', 'No']"
          />
        </div>
        <div v-if="modalData.selected.type !== 'ENUMERATION'" class="mb-4">
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
        <BCMSButton
          kind="ghost"
          @click="back"
          class="
            text-pink
            hover:text-red hover:shadow-none
            focus:text-red focus:shadow-none
          "
          >Back</BCMSButton
        >
      </template>
    </template>
  </Modal>
</template>

<script lang="tsx">
import { defineComponent, ref } from 'vue';
import {
  BCMSProp,
  BCMSPropType,
  BCMSPropEnumData,
  BCMSPropEntryPointerData,
  BCMSPropGroupPointerData,
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
  BCMSModalInputDefaults,
} from '../../../types';
import BCMSButton from '../../button.vue';

interface Data extends BCMSModalInputDefaults<BCMSAddPropModalOutputData> {
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

    window.bcms.modal.props.add = {
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
          id: '',
          label: '',
          name: '',
          type: BCMSPropType.STRING,
          array: false,
          required: false,
          defaultData: [''],
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
            desc: 'Any character array value',
            value: BCMSPropType.STRING,
          },
          {
            name: 'Rich Text',
            desc: 'Text with options for bold, italic, list...',
            value: BCMSPropType.RICH_TEXT,
          },
          {
            name: 'Number',
            desc: 'Any real number',
            value: BCMSPropType.NUMBER,
          },
          {
            name: 'Date',
            desc: 'Unix timestamp - date in milliseconds',
            value: BCMSPropType.DATE,
          },
          {
            name: 'Boolean',
            desc: 'Yes or no, true or false, 1 or 0',
            value: BCMSPropType.BOOLEAN,
          },
          {
            name: 'Enumeration',
            desc: 'List of choices',
            value: BCMSPropType.ENUMERATION,
          },
          {
            name: 'Media',
            desc: 'Select a media file using media picker',
            value: BCMSPropType.MEDIA,
          },
          {
            name: 'Group Pointer',
            desc: 'Extend properties of a group',
            value: BCMSPropType.GROUP_POINTER,
            hide: true,
          },
          {
            name: 'Entry Pointer',
            desc: 'Extend properties of an entry',
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
      window.bcms.modal.props.add.hide();
    }
    function done() {
      if (modalData.value.prop.label.replace(/ /g, '') === '') {
        modalData.value.errors.name = 'Label is required.';
        return;
      } else if (
        modalData.value.takenPropNames.includes(
          window.bcms.util.string.toSlugUnderscore(modalData.value.prop.label)
        )
      ) {
        modalData.value.errors.name = 'Label is already taken.';
        return;
      }
      modalData.value.errors.name = '';
      if (
        modalData.value.prop.type === BCMSPropType.GROUP_POINTER &&
        (modalData.value.prop.defaultData as BCMSPropGroupPointerData)._id ===
          ''
      ) {
        modalData.value.errors.groupPointer = 'Please select a group.';
        return;
      }
      modalData.value.errors.groupPointer = '';
      if (
        modalData.value.prop.type === BCMSPropType.ENTRY_POINTER &&
        (modalData.value.prop.defaultData as BCMSPropEntryPointerData)
          .templateId === ''
      ) {
        modalData.value.errors.entryPointer = 'Please select a template.';
        return;
      }
      modalData.value.errors.entryPointer = '';
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
        const result = modalData.value.onDone(modalData.value.prop);
        if (result instanceof Promise) {
          result.catch((error) => {
            console.error(error);
          });
        }
      }
      window.bcms.modal.props.add.hide();
    }
    function back() {
      stage.value--;
    }
    function next() {
      switch (stage.value) {
        case 0: {
          if (!modalData.value.selected.type) {
            window.bcms.notification.warning('You must select a type.');
            return;
          }
          switch (modalData.value.selected.type) {
            case BCMSPropType.STRING:
              {
                modalData.value.prop.type = BCMSPropType.STRING;
                modalData.value.prop.defaultData = [''];
              }
              break;
            case BCMSPropType.RICH_TEXT:
              {
                modalData.value.prop.type = BCMSPropType.RICH_TEXT;
                modalData.value.prop.defaultData = [
                  {
                    nodes: [],
                  },
                ];
                // modalData.value.prop.type = BCMSPropType.RICH_TEXT;
                // (modalData.value.prop.defaultData as BCMSPropQuill) = {
                //   ops: [],
                //   text: '',
                // };
              }
              break;
            case BCMSPropType.NUMBER:
              {
                modalData.value.prop.type = BCMSPropType.NUMBER;
                modalData.value.prop.defaultData = [0];
              }
              break;
            case BCMSPropType.DATE:
              {
                modalData.value.prop.type = BCMSPropType.DATE;
                modalData.value.prop.defaultData = [0];
              }
              break;
            case BCMSPropType.BOOLEAN:
              {
                modalData.value.prop.type = BCMSPropType.BOOLEAN;
                modalData.value.prop.defaultData = [false];
              }
              break;
            case BCMSPropType.ENUMERATION:
              {
                modalData.value.prop.type = BCMSPropType.ENUMERATION;
                (modalData.value.prop.defaultData as BCMSPropEnumData) = {
                  items: [],
                  selected: '',
                };
              }
              break;
            case BCMSPropType.MEDIA:
              {
                modalData.value.prop.type = BCMSPropType.MEDIA;
                modalData.value.prop.defaultData = [''];
              }
              break;
            case BCMSPropType.GROUP_POINTER:
              {
                modalData.value.prop.type = BCMSPropType.GROUP_POINTER;
                const value: BCMSPropGroupPointerData = {
                  _id: '',
                };
                modalData.value.prop.defaultData = value;
              }
              break;
            case BCMSPropType.ENTRY_POINTER:
              {
                modalData.value.prop.type = BCMSPropType.ENTRY_POINTER;
                const value: BCMSPropEntryPointerData = {
                  entryIds: [''],
                  displayProp: 'title',
                  templateId: '',
                };
                modalData.value.prop.defaultData = value;
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
        return window.bcms.util.string.toEnum(value);
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
        (modalData.value.prop.defaultData as BCMSPropEnumData).items = items;
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
