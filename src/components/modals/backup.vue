<script lang="tsx">
import { computed, defineComponent, ref } from 'vue';
import Modal from './_modal.vue';
import type {
  BCMSBackupModalInputData,
  BCMSBackupModalOutputData,
  BCMSModalInputDefaults,
} from '../../types';
import { BCMSButton, BCMSIcon } from '..';
import type { BCMSBackupListItem } from '@becomes/cms-sdk/types';

type Data = BCMSModalInputDefaults<BCMSBackupModalOutputData>;

const component = defineComponent({
  setup() {
    const throwable = window.bcms.util.throwable;
    const sdk = window.bcms.sdk;
    const show = ref(false);
    const store = window.bcms.vue.store;
    const modalData = ref<Data>(getData());
    const backups = computed(() => store.getters.backupItem_items);

    window.bcms.modal.backup = {
      hide() {
        show.value = false;
      },
      show(data) {
        throwable(async () => {
          await sdk.backup.list();
        });
        modalData.value = getData(data);
        show.value = true;
      },
    };

    function getData(inputData?: BCMSBackupModalInputData): Data {
      const d: Data = {
        title: 'Backups',
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
      window.bcms.modal.backup.hide();
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
      window.bcms.modal.backup.hide();
    }

    function getSize(size: number): string {
      if (size === -1) {
        return 'In process';
      }
      let output = size / 1024;
      if (output < 1000) {
        return `${output.toFixed(2)}KB`;
      } else {
        output = output / 1000;
        if (output < 1000) {
          return `${output.toFixed(2)}MB`;
        } else {
          return `${(output / 1000).toFixed(2)}GB`;
        }
      }
    }

    async function downloadBackup(backup: BCMSBackupListItem) {
      await throwable(
        async () => {
          return await sdk.backup.getDownloadHash({ fileName: backup._id });
        },
        async (result) => {
          const el = document.createElement('a');
          el.setAttribute('href', `/api/backup/${result}`);
          el.setAttribute('download', backup._id);
          el.style.display = 'none';
          document.body.appendChild(el);
          el.click();
          document.body.removeChild(el);
        }
      );
    }

    async function deleteBackup(backup: BCMSBackupListItem) {
      console.log(backup);
      await throwable(async () => {
        await sdk.backup.delete({ fileNames: [backup._id] });
      });
    }

    return () => {
      return (
        <Modal
          title={modalData.value.title}
          show={show.value}
          doNotShowFooter={true}
          onDone={done}
          onCancel={cancel}
        >
          <div>
            <BCMSButton
              onClick={() => {
                throwable(async () => {
                  await sdk.backup.create({
                    media: true,
                  });
                });
              }}
            >
              Create new backup
            </BCMSButton>
            {backups.value.length > 0 ? (
              <ul>
                {backups.value.map((backup) => {
                  return (
                    <li
                      style={{
                        display: 'flex',
                        gap: '20px',
                        borderBottom: '1px solid red',
                        padding: '5px 0',
                      }}
                    >
                      <div>{backup._id}</div>
                      <div>{getSize(backup.size)}</div>
                      {backup.size > -1 ? (
                        <>
                          <button
                            onClick={() => {
                              downloadBackup(backup);
                            }}
                          >
                            <BCMSIcon
                              style="fill: red; width: 24px"
                              src="/file"
                            />
                          </button>
                          <button
                            onClick={() => {
                              deleteBackup(backup);
                            }}
                          >
                            <BCMSIcon
                              style="fill: red; width: 24px"
                              src="/trash"
                            />
                          </button>
                        </>
                      ) : (
                        ''
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div class="bcmsBackupModal--noItems">
                There are no backups available
              </div>
            )}
          </div>
        </Modal>
      );
    };
  },
});
export default component;
</script>
