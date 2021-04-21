<template>
  <Modal
    :title="title"
    :show="show"
    actionName="Confirm"
    @done="done"
    @cancel="cancel"
  >
    <template v-slot:header
      ><div>
        <h2 v-if="stage === 0">{{ title }}</h2>
        <button
          v-else
          class="bcmsModal--header-addNewProp"
          @click="
            () => {
              back();
            }
          "
        >
          <span class="mr-10">&#9666;</span>
          <h2 class="bcmsModal--title">
            {{
              window.bcms.services.general.string.toPretty(
                modalData.selected.type
              )
            }}
          </h2>
        </button>
      </div></template
    >
    <div>TEST</div>
  </Modal>
</template>

<script lang="tsx">
import { defineComponent, ref } from 'vue';
import Modal from '../_modal.vue';
import {
  BCMSAddPropModalInputData,
  BCMSAddPropModalOutputData,
  BCMSModalServiceItemInputDefaults,
} from '../../../types';
import BCMSButton from '../../button.vue';
import { BCMSProp, BCMSPropType } from '@becomes/cms-sdk/types';

interface Data
  extends BCMSModalServiceItemInputDefaults<BCMSAddPropModalOutputData> {
  title: string;
  stage: number;
  prop: BCMSProp;
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
    // BCMSButton,
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
      const d: Data = {
        stage: 0,
        title: 'Add property',
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
      // TODO
    }
    function next() {
      // TODO
    }

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
    };
  },
});
export default component;
</script>

<!--<div v-slot="header">-->
<!--{modalData.value.stage === 0 ? (-->
<!--<h2 class="bcmsModal&#45;&#45;title">{modalData.value.title}</h2>-->
<!--) : (-->
<!--<button-->
<!--  class="bcmsModal&#45;&#45;header-addNewProp"-->
<!--  onClick={() => {-->
<!--// TODO: resetState();-->
<!--}}-->
<!--&gt;-->
<!--<span class="mr-10">&#9666;</span>-->
<!--<h2 class="bcmsModal&#45;&#45;title">-->
<!--  {window.bcms.services.general.string.toPretty(-->
<!--  modalData.value.selected.type-->
<!--  )}-->
<!--</h2>-->
<!--</button>-->
<!--)}-->
<!--</div>-->

<!--<div v-slot="actions">-->
<!--{modalData.value.stage === 0 ? (-->
<!--<>-->
<!--<BCMSButton onClick={next}>-->
<!--  <span>Next</span>-->
<!--</BCMSButton>-->
<!--</>-->
<!--) : (-->
<!--<>-->
<!--<BCMSButton onClick={done}>-->
<!--<span>Create</span>-->
<!--</BCMSButton>-->
<!--<BCMSButton kind="ghost" onClick={back}>-->
<!--Back-->
<!--</BCMSButton>-->
<!--</>-->
<!--)}-->
<!--</div>-->
