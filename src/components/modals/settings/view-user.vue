<script lang="tsx">
import { computed, defineComponent, ref } from 'vue';
import Modal from '../_modal.vue';
import {
  BCMSViewUserModalInputData,
  BCMSViewUserModalOutputData,
  BCMSModalInputDefaults,
} from '../../../types';
import {
  BCMSPlugin,
  BCMSTemplate,
  BCMSUser,
  BCMSUserPolicyPlugin,
} from '@becomes/cms-sdk/types';
import { BCMSCheckboxArrayInput, BCMSToggleInput } from '../../input';
import { BCMSPluginPolicy, BCMSPolicySimpleBlock } from '../../policy';

interface Data extends BCMSModalInputDefaults<BCMSViewUserModalOutputData> {
  user: BCMSUser;
}
type ViewMode = 'simple' | 'advanced';

const component = defineComponent({
  setup() {
    const show = ref(false);
    const throwable = window.bcms.util.throwable;
    const store = window.bcms.vue.store;
    const modalData = ref<Data>(getData());
    const viewMode = ref<ViewMode>('advanced');
    const pluginList = ref<BCMSPlugin[]>([]);
    const templates = computed(() => store.getters.template_items);

    window.bcms.modal.settings.view = {
      hide() {
        show.value = false;
      },
      show(data) {
        modalData.value = getData(data);
        init();
        show.value = true;
      },
    };

    function getData(inputData?: BCMSViewUserModalInputData): Data {
      const d: Data = {
        title: 'View user',
        user: undefined as never,
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
        } else {
          d.title = inputData.user.username;
        }
        if (inputData.onDone) {
          d.onDone = inputData.onDone;
        }
        if (inputData.onCancel) {
          d.onCancel = inputData.onCancel;
        }
        d.user = inputData.user;
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
      window.bcms.modal.settings.view.hide();
    }
    function done() {
      if (modalData.value.onDone) {
        const result = modalData.value.onDone({
          policy: modalData.value.user
            ? modalData.value.user.customPool.policy
            : {
                media: {
                  get: false,
                  post: false,
                  put: false,
                  delete: false,
                },
                templates: [],
                plugins: [],
              },
        });
        if (result instanceof Promise) {
          result.catch((error) => {
            console.error(error);
          });
        }
      }
      window.bcms.modal.settings.view.hide();
    }
    async function init() {
      await throwable(
        async () => {
          await window.bcms.sdk.template.getAll();
          return await window.bcms.sdk.plugin.getAll();
        },
        async (result) => {
          pluginList.value = result;
        }
      );
    }
    function mediaSimpleHandler() {
      if (
        modalData.value.user.customPool.policy.media.get &&
        modalData.value.user.customPool.policy.media.post &&
        modalData.value.user.customPool.policy.media.put &&
        modalData.value.user.customPool.policy.media.delete
      ) {
        modalData.value.user.customPool.policy.media = {
          get: false,
          post: false,
          put: false,
          delete: false,
        };
      } else {
        modalData.value.user.customPool.policy.media = {
          get: true,
          post: true,
          put: true,
          delete: true,
        };
      }
    }
    function pluginSimpleHandler(pluginName: string) {
      const userPolicy = modalData.value.user.customPool.policy.plugins
        ? modalData.value.user.customPool.policy.plugins.find(
            (e) => e.name === pluginName
          )
        : undefined;
      if (userPolicy && userPolicy.allowed && userPolicy.fullAccess) {
        modalData.value.user.customPool.policy.plugins = modalData.value.user
          .customPool.policy.plugins
          ? modalData.value.user.customPool.policy.plugins.filter(
              (e) => e.name !== pluginName
            )
          : [];
      } else {
        if (modalData.value.user.customPool.policy.plugins) {
          if (userPolicy) {
            for (
              let i = 0;
              i < modalData.value.user.customPool.policy.plugins.length;
              i++
            ) {
              const pp = modalData.value.user.customPool.policy.plugins[i];
              if (pp.name === pluginName) {
                modalData.value.user.customPool.policy.plugins[i] = {
                  name: pluginName,
                  allowed: true,
                  fullAccess: true,
                  options: [],
                };
                break;
              }
            }
          } else {
            modalData.value.user.customPool.policy.plugins.push({
              name: pluginName,
              allowed: true,
              fullAccess: true,
              options: [],
            });
          }
        } else {
          modalData.value.user.customPool.policy.plugins = [
            {
              name: pluginName,
              allowed: true,
              fullAccess: true,
              options: [],
            },
          ];
        }
      }
    }
    function templateSimpleHandler(template: BCMSTemplate) {
      const tempPolicy = modalData.value.user.customPool.policy.templates.find(
        (e) => e._id === template._id
      );
      if (
        tempPolicy &&
        tempPolicy.get &&
        tempPolicy.post &&
        tempPolicy.put &&
        tempPolicy.delete
      ) {
        modalData.value.user.customPool.policy.templates =
          modalData.value.user.customPool.policy.templates.filter(
            (e) => e._id !== template._id
          );
      } else {
        if (tempPolicy) {
          for (
            let i = 0;
            i < modalData.value.user.customPool.policy.templates.length;
            i++
          ) {
            const tp = modalData.value.user.customPool.policy.templates[i];
            if (tp._id === template._id) {
              modalData.value.user.customPool.policy.templates[i] = {
                _id: template._id,
                get: true,
                post: true,
                put: true,
                delete: true,
              };
              break;
            } else {
              modalData.value.user.customPool.policy.templates.push({
                _id: template._id,
                get: true,
                post: true,
                put: true,
                delete: true,
              });
            }
          }
        } else {
          modalData.value.user.customPool.policy.templates.push({
            _id: template._id,
            get: true,
            post: true,
            put: true,
            delete: true,
          });
        }
      }
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
          <div class="userPolicy">
            <div class="userPolicy--head">
              <BCMSToggleInput
                label="Toggle mode"
                states={['Advanced mode', 'Simple mode']}
                value={viewMode.value === 'simple' ? false : true}
                onInput={(value) => {
                  viewMode.value = value ? 'advanced' : 'simple';
                }}
              />
            </div>
            <div class="userPolicy--body">
              {modalData.value.user ? (
                <div class={`userPolicy--mode_${viewMode.value}`}>
                  {viewMode.value === 'simple' ? (
                    <div class="userPolicy--simple">
                      <BCMSPolicySimpleBlock
                        type="Media"
                        text="Can view and edit media"
                        selected={
                          modalData.value.user.customPool.policy.media.get &&
                          modalData.value.user.customPool.policy.media.post &&
                          modalData.value.user.customPool.policy.media.put &&
                          modalData.value.user.customPool.policy.media.delete
                        }
                        onClick={mediaSimpleHandler}
                      />
                      {pluginList.value.map((plugin) => {
                        const userPolicy = modalData.value.user.customPool
                          .policy.plugins
                          ? modalData.value.user.customPool.policy.plugins.find(
                              (e) => e.name === plugin.name
                            )
                          : undefined;
                        return (
                          <BCMSPolicySimpleBlock
                            type="Plugin"
                            text={`Allow full access to ${window.bcms.util.string.toPretty(
                              plugin.name
                            )}`}
                            selected={
                              userPolicy &&
                              userPolicy.allowed &&
                              userPolicy.fullAccess
                            }
                            onClick={() => {
                              pluginSimpleHandler(plugin.name);
                            }}
                          />
                        );
                      })}
                      {templates.value.map((template) => {
                        const tempPolicy =
                          modalData.value.user.customPool.policy.templates.find(
                            (e) => e._id === template._id
                          );
                        return (
                          <BCMSPolicySimpleBlock
                            type={template.label}
                            text="Can view and edit entries"
                            selected={
                              tempPolicy &&
                              tempPolicy.get &&
                              tempPolicy.post &&
                              tempPolicy.put &&
                              tempPolicy.delete
                            }
                            onClick={() => {
                              templateSimpleHandler(template);
                            }}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div class="userPolicy--advanced">
                      <div class="mb-15">
                        <h2 class="font-normal mb-5 text-xl">
                          Media Permissions
                        </h2>
                        <BCMSCheckboxArrayInput
                          class="mb-15"
                          title={<span class="text-pink">Media</span>}
                          initialValue={[
                            {
                              desc: 'Can get resources',
                              selected:
                                modalData.value.user.customPool.policy.media
                                  .get,
                            },
                            {
                              desc: 'Can add data',
                              selected:
                                modalData.value.user.customPool.policy.media
                                  .post,
                            },
                            {
                              desc: 'Can update data',
                              selected:
                                modalData.value.user.customPool.policy.media
                                  .put,
                            },
                            {
                              desc: 'Can delete data',
                              selected:
                                modalData.value.user.customPool.policy.media
                                  .delete,
                            },
                          ]}
                          onChange={(event) => {
                            modalData.value.user.customPool.policy.media.get =
                              event[0].selected;
                            modalData.value.user.customPool.policy.media.post =
                              event[1].selected;
                            modalData.value.user.customPool.policy.media.put =
                              event[2].selected;
                            modalData.value.user.customPool.policy.media.delete =
                              event[3].selected;
                          }}
                        />
                      </div>
                      <div class="mb-15">
                        <h2 class="font-normal mb-5 text-xl">
                          Template Permissions
                        </h2>
                        {templates.value.length > 0 ? (
                          templates.value.map((temp) => {
                            let tempPolicyIndex =
                              modalData.value.user.customPool.policy.templates.findIndex(
                                (e) => e._id === temp._id
                              );
                            if (tempPolicyIndex === -1) {
                              tempPolicyIndex =
                                modalData.value.user.customPool.policy.templates.push(
                                  {
                                    _id: temp._id,
                                    get: false,
                                    post: false,
                                    put: false,
                                    delete: false,
                                  }
                                ) - 1;
                            }
                            return (
                              <BCMSCheckboxArrayInput
                                class="mb-15"
                                title={
                                  <span class="text-pink">{temp.label}</span>
                                }
                                initialValue={[
                                  {
                                    desc: 'Can get resources',
                                    selected:
                                      modalData.value.user.customPool.policy
                                        .templates[tempPolicyIndex].get,
                                  },
                                  {
                                    desc: 'Can add data',
                                    selected:
                                      modalData.value.user.customPool.policy
                                        .templates[tempPolicyIndex].post,
                                  },
                                  {
                                    desc: 'Can update data',
                                    selected:
                                      modalData.value.user.customPool.policy
                                        .templates[tempPolicyIndex].put,
                                  },
                                  {
                                    desc: 'Can delete data',
                                    selected:
                                      modalData.value.user.customPool.policy
                                        .templates[tempPolicyIndex].delete,
                                  },
                                ]}
                                onChange={(event) => {
                                  modalData.value.user.customPool.policy.templates[
                                    tempPolicyIndex
                                  ].get = event[0].selected;
                                  modalData.value.user.customPool.policy.templates[
                                    tempPolicyIndex
                                  ].post = event[1].selected;
                                  modalData.value.user.customPool.policy.templates[
                                    tempPolicyIndex
                                  ].put = event[2].selected;
                                  modalData.value.user.customPool.policy.templates[
                                    tempPolicyIndex
                                  ].delete = event[3].selected;
                                }}
                              />
                            );
                          })
                        ) : (
                          <div class="text-grey text-2xl mt-5">
                            There are no templates
                          </div>
                        )}
                      </div>
                      {pluginList.value.length > 0 ? (
                        <div class="mb-15">
                          <h2 class="font-normal mb-5 text-xl">
                            Plugin Permissions
                          </h2>
                          {pluginList.value.map((plugin) => {
                            console.log(plugin);
                            if (
                              !modalData.value.user.customPool.policy.plugins
                            ) {
                              modalData.value.user.customPool.policy.plugins =
                                [];
                            }
                            let pluginPolicyIndex =
                              modalData.value.user.customPool.policy.plugins.findIndex(
                                (e) => e.name === plugin.name
                              );
                            if (pluginPolicyIndex === -1) {
                              console.log('HERE');
                              pluginPolicyIndex =
                                modalData.value.user.customPool.policy.plugins.push(
                                  {
                                    name: plugin.name,
                                    allowed: false,
                                    fullAccess: false,
                                    options: [],
                                  }
                                ) - 1;
                            }
                            return (
                              <BCMSPluginPolicy
                                policySchema={plugin.policies}
                                policy={
                                  modalData.value.user.customPool.policy
                                    .plugins[pluginPolicyIndex]
                                }
                                onChangeAccess={(value) => {
                                  (
                                    modalData.value.user.customPool.policy
                                      .plugins as BCMSUserPolicyPlugin[]
                                  )[pluginPolicyIndex].allowed = value;
                                }}
                                onChangeFullAccess={(value) => {
                                  const policies = modalData.value.user
                                    .customPool.policy
                                    .plugins as BCMSUserPolicyPlugin[];
                                  policies[pluginPolicyIndex].allowed = value;
                                  policies[pluginPolicyIndex].fullAccess =
                                    value;
                                }}
                                onChangeOption={(options) => {
                                  (
                                    modalData.value.user.customPool.policy
                                      .plugins as BCMSUserPolicyPlugin[]
                                  )[pluginPolicyIndex].options = options;
                                }}
                              />
                            );
                          })}
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p>Loading ...</p>
              )}
            </div>
          </div>
        </Modal>
      );
    };
  },
});
export default component;
</script>
