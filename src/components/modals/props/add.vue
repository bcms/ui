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
import { useI18n } from 'vue-i18n';

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
    const { t: i18n, tm } = useI18n();
    const show = ref(false);
    const stage = ref(0);
    const title = ref(i18n('modal.addProp.title'));
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
        title: i18n('modal.addProp.title'),
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
            name: i18n('modal.addProp.type.string.label'),
            desc: i18n('modal.addProp.type.string.description'),
            value: BCMSPropType.STRING,
          },
          {
            name: i18n('modal.addProp.type.richText.label'),
            desc: i18n('modal.addProp.type.richText.description'),
            value: BCMSPropType.RICH_TEXT,
          },
          {
            name: i18n('modal.addProp.type.number.label'),
            desc: i18n('modal.addProp.type.number.description'),
            value: BCMSPropType.NUMBER,
          },
          {
            name: i18n('modal.addProp.type.date.label'),
            desc: i18n('modal.addProp.type.date.description'),
            value: BCMSPropType.DATE,
          },
          {
            name: i18n('modal.addProp.type.boolean.label'),
            desc: i18n('modal.addProp.type.boolean.description'),
            value: BCMSPropType.BOOLEAN,
          },
          {
            name: i18n('modal.addProp.type.enumeration.label'),
            desc: i18n('modal.addProp.type.enumeration.description'),
            value: BCMSPropType.ENUMERATION,
          },
          {
            name: i18n('modal.addProp.type.media.label'),
            desc: i18n('modal.addProp.type.media.description'),
            value: BCMSPropType.MEDIA,
          },
          {
            name: i18n('modal.addProp.type.groupPointer.label'),
            desc: i18n('modal.addProp.type.groupPointer.description'),
            value: BCMSPropType.GROUP_POINTER,
            hide: true,
          },
          {
            name: i18n('modal.addProp.type.entryPointer.label'),
            desc: i18n('modal.addProp.type.entryPointer.description'),
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
        modalData.value.errors.name = i18n('modal.addProp.error.emptyLabel');
        return;
      } else if (
        modalData.value.takenPropNames.includes(
          window.bcms.util.string.toSlugUnderscore(modalData.value.prop.label)
        )
      ) {
        modalData.value.errors.name = i18n(
          'modal.addProp.error.duplicateLabel'
        );
        return;
      }
      modalData.value.errors.name = '';
      if (
        modalData.value.prop.type === BCMSPropType.GROUP_POINTER &&
        (modalData.value.prop.defaultData as BCMSPropGroupPointerData)._id ===
          ''
      ) {
        modalData.value.errors.groupPointer = i18n(
          'modal.addProp.error.emptyGroupPointer'
        );
        return;
      }
      modalData.value.errors.groupPointer = '';
      if (
        modalData.value.prop.type === BCMSPropType.ENTRY_POINTER &&
        (modalData.value.prop.defaultData as BCMSPropEntryPointerData)
          .templateId === ''
      ) {
        modalData.value.errors.entryPointer = i18n(
          'modal.addProp.error.emptyTemplatePointer'
        );
        return;
      }
      modalData.value.errors.entryPointer = '';
      if (
        modalData.value.prop.type === BCMSPropType.ENUMERATION &&
        (modalData.value.prop.defaultData as BCMSPropEnumData).items.length ===
          0
      ) {
        modalData.value.errors.enum = i18n(
          'modal.addProp.error.emptyEnumeration'
        );
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
            window.bcms.notification.warning(
              i18n('modal.addProp.error.emptyType')
            );
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
          return i18n('modal.addProp.error.duplicateEnumeration', {
            label: items[items.length - 1],
          });
        }
        return null;
      },
      addItems(items: string[]): void {
        (modalData.value.prop.defaultData as BCMSPropEnumData).items = items;
      },
    };

    const slots = {
      header: () => (
        <div>
          {stage.value === 0 ? (
            <div class="text-dark text-4xl -tracking-0.03 font-normal line-break-anywhere w-full">
              {i18n('modal.addProp.title')}
            </div>
          ) : (
            <button class="flex items-center p-[5px]" onClick={back}>
              <span class="mr-2.5">&#9666;</span>
              <h2 class="text-dark text-4xl -tracking-0.03 font-normal line-break-anywhere w-full">
                {window.bcms.util.string.toPretty(
                  modalData.value.selected.type
                )}
              </h2>
            </button>
          )}
        </div>
      ),
      actions: () => (
        <div>
          {stage.value > 0 && (
            <>
              <BCMSButton onClick={done}>
                <span>{i18n('modal.addProp.actionSlot.createLabel')}</span>
              </BCMSButton>
              <BCMSButton
                kind="ghost"
                onClick={back}
                class="text-pink hover:text-red hover:shadow-none focus:text-red focus:shadow-none"
              >
                {i18n('modal.addProp.actionSlot.backLabel')}
              </BCMSButton>
            </>
          )}
        </div>
      ),
    };

    return () => (
      <Modal
        title={title.value}
        show={show.value}
        onDone={done}
        onCancel={cancel}
        class="bcmsModal_addProp"
        doNotShowFooter={stage.value === 0}
        v-slots={slots}
      >
        <div class="mb-4 overflow-y-auto px-7.5 xs:px-10">
          {stage.value === 0 ? (
            <div>
              {modalData.value.types.map((propType) => {
                return (
                  <button
                    onClick={() => {
                      modalData.value.selected.type = propType.value;
                      next();
                    }}
                    class="group bg-light bg-opacity-50 border border-grey rounded-3xl w-full text-left transition-all duration-200 flex items-center py-[15px] px-5 text-base leading-tight mb-5 hover:border-green focus:border-green disabled:hover:border-dark disabled:hover:border-opacity-30 disabled:focus:border-dark disabled:focus:border-opacity-30"
                    title={propType.desc}
                  >
                    <div class="min-w-max transition-all duration-200 mr-5 group-hover:text-green group-focus:text-green">
                      {propType.name}
                    </div>
                    <div class="text-grey text-opacity-50 whitespace-nowrap overflow-hidden overflow-ellipsis">
                      {propType.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <>
              <div class="mb-4">
                <BCMSTextInput
                  label={i18n('modal.addProp.input.label.label')}
                  placeholder={i18n('modal.addProp.input.label.placeholder')}
                  v-model={modalData.value.prop.label}
                  focusOnLoad
                  invalidText={modalData.value.errors.name}
                />
              </div>
              {modalData.value.selected.type === BCMSPropType.ENUMERATION ? (
                <div class="mb-4">
                  <BCMSMultiAddInput
                    label={i18n('modal.addProp.input.enumeration.label')}
                    placeholder={i18n(
                      'modal.addProp.input.enumeration.placeholder'
                    )}
                    value={[]}
                    invalidText={modalData.value.errors.enum}
                    format={enumLogic.format}
                    validate={enumLogic.validate}
                    onInput={enumLogic.addItems}
                  />
                </div>
              ) : modalData.value.selected.type ===
                BCMSPropType.GROUP_POINTER ? (
                <div class="mb-4">
                  <BCMSGroupPointerSelect
                    selected={(modalData.value.prop.defaultData as any)._id}
                    invalidText={modalData.value.errors.groupPointer}
                    onChange={(data) => {
                      (modalData.value.prop.defaultData as any)._id =
                        data.value;
                    }}
                  />
                </div>
              ) : modalData.value.selected.type ===
                BCMSPropType.ENTRY_POINTER ? (
                <div class="mb-4">
                  <BCMSEntryPointerSelect
                    selected={
                      (modalData.value.prop.defaultData as any).templateId
                    }
                    invalidText={modalData.value.errors.entryPointer}
                    onChange={(data) => {
                      (modalData.value.prop.defaultData as any).templateId =
                        data.value;
                    }}
                  />
                </div>
              ) : (modalData.value.selected.type as BCMSPropType) !==
                BCMSPropType.GROUP_POINTER ? (
                <div class="mb-4">
                  <BCMSToggleInput
                    v-model={modalData.value.prop.required}
                    label={i18n('modal.addProp.input.required.label')}
                    states={
                      tm('modal.addProp.input.required.states') as unknown as [
                        string,
                        string
                      ]
                    }
                  />
                </div>
              ) : (modalData.value.selected.type as BCMSPropType) !==
                BCMSPropType.ENUMERATION ? (
                <div class="mb-4">
                  <BCMSToggleInput
                    v-model={modalData.value.prop.array}
                    label={i18n('modal.addProp.input.array.label')}
                    states={
                      tm('modal.addProp.input.array.states') as unknown as [
                        string,
                        string
                      ]
                    }
                  />
                </div>
              ) : (
                ''
              )}
            </>
          )}
        </div>
      </Modal>
    );
  },
});
export default component;
</script>
