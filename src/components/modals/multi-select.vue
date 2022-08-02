<script lang="tsx">
import { search } from '@banez/search';
import { computed, defineComponent, ref } from 'vue';
import Modal from './_modal.vue';
import type {
  BCMSModalInputDefaults,
  BCMSMultiSelectItem,
  BCMSMultiSelectItemExtended,
  BCMSMultiSelectModalInputData,
  BCMSMultiSelectModalOutputData,
} from '../../types';
import { BCMSTextInput } from '../input';
import BCMSImage from '../image.vue';
import { useTranslation } from '../../translations';

interface Data extends BCMSModalInputDefaults<BCMSMultiSelectModalOutputData> {
  onlyOne: boolean;
  items: BCMSMultiSelectItemExtended[];
}

const component = defineComponent({
  setup() {
    const translations = computed(() => {
      return useTranslation();
    });
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
        title: translations.value.modal.multiSelect.title,
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

    function flush() {
      searchTerm.value = '';
    }

    function cancel() {
      flush();
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
      flush();
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
          <div>
            <BCMSTextInput
              placeholder="Search"
              onInput={(value) => {
                searchTerm.value = value.toLowerCase();
              }}
            />
            <div class="w-full grid grid-cols-[auto] gap-2.5 rounded-3.5 mt-5">
              {filteredItems.value.map((item) => (
                <button
                  class={`text-left pt-3 pr-6 pb-2.5 pl-4.5 border-b border-grey ${
                    item.selected
                      ? 'text-green dark:text-yellow dark:border-yellow'
                      : 'dark:text-light'
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
                    <div class="grid grid-cols-[auto,80px]">
                      <div>
                        <div>{item.title}</div>
                        {item.subtitle ? (
                          <div class="text-grey text-xs mt-2.5">
                            {item.subtitle + ''}
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                      <div class="w-20 h-20 overflow-hidden rounded-3.5">
                        <BCMSImage
                          media={item.image}
                          alt={item.title}
                          class="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>{item.title}</div>
                      {item.subtitle ? (
                        <div class="text-grey text-xs mt-2.5">
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
