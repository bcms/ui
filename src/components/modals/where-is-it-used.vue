<script lang="tsx">
import { defineComponent, ref } from 'vue';
import Modal from './_modal.vue';
import {
  BCMSWhereIsItUsedModalInputData,
  BCMSWhereIsItUsedModalOutputData,
  BCMSModalInputDefaults,
  BCMSWhereIsItUsedItem,
} from '../../types';
import BCMSLink from '../link.vue';
import BCMSIcon from '../icon.vue';
import { useRouter } from 'vue-router';

interface Data
  extends BCMSModalInputDefaults<BCMSWhereIsItUsedModalOutputData> {
  items: BCMSWhereIsItUsedItem[];
}

const component = defineComponent({
  setup() {
    const router = useRouter();
    const show = ref(false);
    const modalData = ref<Data>(getData());

    window.bcms.modal.whereIsItUsed = {
      hide() {
        show.value = false;
      },
      show(data) {
        modalData.value = getData(data);
        show.value = true;
      },
    };

    function getData(inputData?: BCMSWhereIsItUsedModalInputData): Data {
      const d: Data = {
        title: 'WhereIsItUsed',
        items: [],
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
      window.bcms.modal.whereIsItUsed.hide();
    }
    function done() {
      if (modalData.value.onDone) {
        const result = modalData.value.onDone();
        if (result instanceof Promise) {
          result.catch((error) => {
            console.error(error);
          });
        }
      }
      window.bcms.modal.whereIsItUsed.hide();
    }

    return () => {
      return (
        <Modal
          title={modalData.value.title}
          show={show.value}
          onDone={done}
          onCancel={cancel}
        >
          {modalData.value.items.length > 0 ? (
            <ul class="bcmsModal_whereIsItUsed--list">
              <li class="bcmsModal_whereIsItUsed--list-item bcmsModal_whereIsItUsed--list-cols">
                <div
                  class="bcmsModal_whereIsItUsed--list-item-type bcmsModal_whereIsItUsed--list-item-col"
                  data-column-name="Type"
                >
                  Type
                </div>
                <div
                  class="bcmsModal_whereIsItUsed--list-item-label bcmsModal_whereIsItUsed--list-item-col"
                  data-column-name="Label"
                >
                  Label
                </div>
                <div
                  class="bcmsModal_whereIsItUsed--list-item-location bcmsModal_whereIsItUsed--list-item-col"
                  data-column-name="Location"
                >
                  Location
                </div>
              </li>
              {modalData.value.items.map((item) => {
                return (
                  <li class="bcmsModal_whereIsItUsed--list-item bcmsModal_whereIsItUsed--list-cols">
                    <div
                      class="bcmsModal_whereIsItUsed--list-item-type bcmsModal_whereIsItUsed--list-item-col"
                      data-column-name="Type"
                    >
                      {window.bcms.util.string.toPretty(item.type)}
                    </div>
                    <div
                      class="bcmsModal_whereIsItUsed--list-item-label bcmsModal_whereIsItUsed--list-item-col"
                      data-column-name="Label"
                      title={item.label}
                    >
                      {item.template && item.template.label ? (
                        <span>{item.template.label} / </span>
                      ) : (
                        ''
                      )}
                      {item.label}
                    </div>
                    <div
                      class="bcmsModal_whereIsItUsed--list-item-location bcmsModal_whereIsItUsed--list-item-col"
                      data-column-name="Location"
                    >
                      {item.type === 'entry' ? (
                        <BCMSLink
                          clickOverride={true}
                          onClick={(event) => {
                            event.preventDefault();
                            cancel();
                            router.push(
                              '/' +
                                (event.currentTarget as HTMLLinkElement).href
                                  .split('/')
                                  .slice(3)
                                  .join('/')
                            );
                          }}
                          href={`/dashboard/t/{item.template.id}/e/{item.id}`}
                        >
                          <span>Open</span>
                          <BCMSIcon src="/link" />
                        </BCMSLink>
                      ) : item.type === 'widget' ? (
                        <BCMSLink
                          clickOverride={true}
                          onClick={(event) => {
                            event.preventDefault();
                            cancel();
                            router.push(
                              '/' +
                                (event.currentTarget as HTMLLinkElement).href
                                  .split('/')
                                  .slice(3)
                                  .join('/')
                            );
                          }}
                          href={`/dashboard/w/${item.id}`}
                        >
                          <span>Open</span>
                          <BCMSIcon src="/link" />
                        </BCMSLink>
                      ) : item.type === 'group' ? (
                        <BCMSLink
                          clickOverride={true}
                          onClick={(event) => {
                            event.preventDefault();
                            cancel();
                            router.push(
                              '/' +
                                (event.currentTarget as HTMLLinkElement).href
                                  .split('/')
                                  .slice(3)
                                  .join('/')
                            );
                          }}
                          href={`/dashboard/g/${item.id}`}
                        >
                          <span>Open</span>
                          <BCMSIcon src="/link" />
                        </BCMSLink>
                      ) : item.type === 'template' ? (
                        <BCMSLink
                          clickOverride={true}
                          onClick={(event) => {
                            event.preventDefault();
                            cancel();
                            router.push(
                              '/' +
                                (event.currentTarget as HTMLLinkElement).href
                                  .split('/')
                                  .slice(3)
                                  .join('/')
                            );
                          }}
                          href={`/dashboard/t/${item.id}`}
                        >
                          <span>Open</span>
                          <BCMSIcon src="/link" />
                        </BCMSLink>
                      ) : (
                        ''
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            ''
          )}
        </Modal>
      );
    };
  },
});
export default component;
</script>
