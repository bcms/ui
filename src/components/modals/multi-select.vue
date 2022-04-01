<script lang="tsx">
import { search } from '@banez/search';
import { computed, defineComponent, ref } from 'vue';
import Modal from './_modal.vue';
import {
  BCMSModalInputDefaults,
  BCMSMultiSelectItem,
  BCMSMultiSelectItemExtended,
  BCMSMultiSelectModalInputData,
  BCMSMultiSelectModalOutputData,
} from '../../types';
import { useI18n } from 'vue-i18n';
import { BCMSTextInput } from '../input';
import BCMSImage from '../image.vue';

interface Data extends BCMSModalInputDefaults<BCMSMultiSelectModalOutputData> {
  onlyOne: boolean;
  items: BCMSMultiSelectItemExtended[];
}

const component = defineComponent({
  setup() {
    const { t: i18n } = useI18n();
    const show = ref(false);
    const modalData = ref<Data>(getData());
    const searchTerm = ref('');
    const store = window.bcms.vue.store;
    const items = computed<BCMSMultiSelectItemExtended[]>(() =>
      modalData.value.items.map((item) => {
        if (item.imageId) {
          item.image = store.getters.media_findOne(
            (e) => e._id === item.imageId
          );
        }
        return item;
      })
    );
    const filteredItems = computed<BCMSMultiSelectItemExtended[]>(() => {
      let output: BCMSMultiSelectItemExtended[] = JSON.parse(
        JSON.stringify(items.value)
      );
      if (searchTerm.value) {
        const result = search({
          searchTerm: searchTerm.value,
          set: modalData.value.items.map((item) => {
            return {
              id: item.id,
              data: [
                item.title.toLowerCase(),
                item.subtitle?.toLowerCase() || '_________',
                item.image ? item.image.name : '_________',
              ],
            };
          }),
        });
        output = result.items.map((e) => {
          return items.value.find((t) => t.id === e.id) as BCMSMultiSelectItem;
        });
      }
      output.sort((a, b) => {
        if (b.title > a.title) {
          return -1;
        }
        if (b.title < a.title) {
          return 1;
        }
        return 0;
      });
      return output;
    });

    window.bcms.modal.multiSelect = {
      hide() {
        show.value = false;
      },
      show(data) {
        modalData.value = getData(data);
        show.value = true;
      },
    };

    function getData(inputData?: BCMSMultiSelectModalInputData): Data {
      const d: Data = {
        title: i18n('modal.multiSelect.title'),
        items: [],
        onlyOne: false,
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
        if (inputData.onlyOne) {
          d.onlyOne = inputData.onlyOne;
        }
        d.items = inputData.items;
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
      window.bcms.modal.multiSelect.hide();
    }
    function done() {
      if (modalData.value.onDone) {
        const result = modalData.value.onDone({
          items: modalData.value.items.filter((e) => e.selected),
        });
        if (result instanceof Promise) {
          result.catch((error) => {
            console.error(error);
          });
        }
      }
      window.bcms.modal.multiSelect.hide();
    }

    return () => {
      return (
        <Modal
          title={modalData.value.title}
          show={show.value}
          actionName="Done"
          onDone={done}
          onCancel={cancel}
        >
          <div class="bcmsModalMultiSelect">
            <BCMSTextInput
              placeholder="Search"
              onInput={(value) => {
                searchTerm.value = value.toLowerCase();
              }}
            />
            <div class="bcmsModalMultiSelect--items">
              {filteredItems.value.map((item) => (
                <button
                  class={`bcmsModalMultiSelect--item ${
                    item.selected ? 'bcmsModalMultiSelect--item_selected' : ''
                  }`}
                  onClick={() => {
                    for (let i = 0; i < modalData.value.items.length; i++) {
                      const target = modalData.value.items[i];
                      if (target.id === item.id) {
                        target.selected = !target.selected;
                        if (modalData.value.onlyOne) {
                          modalData.value.items = modalData.value.items.map(
                            (e) => {
                              if (e.id !== target.id) {
                                e.selected = false;
                              }
                              return e;
                            }
                          );
                        }
                        break;
                      }
                    }
                  }}
                >
                  {item.image ? (
                    <div class="bcmsModalMultiSelect--item-grid">
                      <div class="bcmsModalMultiSelect--item-left">
                        <div class="bcmsModalMultiSelect--item-title">
                          {item.title}
                        </div>
                        {item.subtitle ? (
                          <div class="bcmsModalMultiSelect--item-sub">
                            {item.subtitle}
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                      <div class="bcmsModalMultiSelect--item-right">
                        <BCMSImage media={item.image} alt={item.title} />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div class="bcmsModalMultiSelect--item-title">
                        {item.title}
                      </div>
                      {item.subtitle ? (
                        <div class="bcmsModalMultiSelect--item-sub">
                          {item.subtitle}
                        </div>
                      ) : (
                        ''
                      )}
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        </Modal>
      );
    };
  },
});
export default component;
</script>
