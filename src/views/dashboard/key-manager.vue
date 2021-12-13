<script lang="tsx">
import { BCMSApiKey, BCMSApiKeyAddData } from '@becomes/cms-sdk/types';
import { computed, defineComponent, onMounted, ref, Teleport } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  BCMSButton,
  BCMSCheckboxArrayInput,
  BCMSManagerInfo,
  BCMSManagerNav,
} from '../../components';
import { useBcmsModalService } from '../../services';
import { useBcmsStore } from '../../store';

const lastState = {
  kid: '',
};

const component = defineComponent({
  setup() {
    const headMeta = window.bcms.meta;
    const mounted = ref(true);
    const store = useBcmsStore();
    const route = useRoute();
    const router = useRouter();
    const modal = useBcmsModalService();

    const templates = computed(() => store.getters.template_items);
    const functions = ref<
      Array<{
        name: string;
        public: boolean;
        selected: boolean;
      }>
    >([]);

    const params = computed<{
      kid?: string;
    }>(() => {
      return route.params;
    });
    const key = computed<{
      items: BCMSApiKey[];
      target?: BCMSApiKey;
    }>(() => {
      let target = store.getters.apiKey_findOne(
        (e) => e._id === params.value.kid
      );

      if (target) {
        headMeta.set({
          title: `${target.name} key`,
        });
      } else {
        target = store.getters.apiKey_items[0];
      }

      return {
        target,
        items: store.getters.apiKey_items,
      };
    });

    const logic = {
      async create(data: BCMSApiKeyAddData) {
        await window.bcms.util.throwable(async () => {
          return await window.bcms.sdk.apiKey.create(data);
        });
      },
    };

    async function redirect() {
      if (!lastState.kid && params.value.kid) {
        lastState.kid = params.value.kid as string;
      }
      const targetId = lastState.kid ? lastState.kid : key.value.items[0]._id;
      if (targetId) {
        await router.push({
          path: '/dashboard/key-manager/' + targetId,
          replace: true,
        });
      }
    }

    headMeta.set({
      title: 'Key Manager',
    });

    onMounted(async () => {
      if (!key.value.target) {
        await window.bcms.util.throwable(async () => {
          return await window.bcms.sdk.apiKey.getAll();
        });
        if (key.value.items.length > 0) {
          await redirect();
        }
      } else {
        await redirect();
      }

      if (templates.value.length === 0) {
        await window.bcms.util.throwable(async () => {
          return await window.bcms.sdk.template.getAll();
        });
      }
      if (functions.value.length === 0) {
        await window.bcms.util.throwable(
          async () => {
            return await window.bcms.sdk.function.getAll();
          },
          async (result) => {
            functions.value = result.map((e) => {
              return {
                name: e.name,
                // TODO: Fix type
                public: e.public as never,
                selected: key.value.target
                  ? !!key.value.target.access.functions.find(
                      (t) => t.name === e.name
                    )
                  : false,
              };
            });
          }
        );
      }
      mounted.value = true;
    });

    return () => (
      <div>
        {key.value.target && mounted.value ? (
          <Teleport to="#managerNav">
            <BCMSManagerNav
              label="Keys"
              actionText="Add new key"
              items={key.value.items.map((e) => {
                return {
                  name: e.name,
                  link: `/dashboard/key-manager/${e._id}`,
                  selected: key.value.target?._id === e._id,
                  onClick: () => {
                    lastState.kid = e._id;
                    router.push({
                      path: `/dashboard/key-manager/${e._id}`,
                      replace: true,
                    });
                  },
                };
              })}
              onAction={() => {
                modal.apiKey.addUpdate.show({
                  async onDone(data) {
                    await logic.create({
                      ...data,
                      blocked: false,
                      access: { templates: [], functions: [] },
                    });
                  },
                });
              }}
            />
          </Teleport>
        ) : (
          ''
        )}
        {key.value.items.length > 0 ? (
          key.value.target ? (
            <>
              <BCMSManagerInfo
                id={key.value.target._id}
                name={key.value.target.name}
                createdAt={key.value.target.createdAt}
                updatedAt={key.value.target.updatedAt}
                description={key.value.target.desc}
                key={key.value.target._id}
              />
              <div class="km--permissions">
                <h3 class="km--permissions-title">Template Permissions</h3>
                {templates.value.length > 0 ? (
                  templates.value.map((template) => {
                    const target = key.value.target as BCMSApiKey;
                    let templateIndex = target.access.templates.findIndex(
                      (e) => e._id === template._id
                    );

                    let data = {
                      get: false,
                      put: false,
                      post: false,
                      delete: false,
                    };

                    if (templateIndex > -1) {
                      data = target.access.templates[templateIndex];
                    } else {
                      templateIndex = target.access.templates.push({
                        ...data,
                        _id: template._id,
                      });
                    }

                    return (
                      <BCMSCheckboxArrayInput
                        title={template.label}
                        initialValue={[
                          {
                            desc: 'Can get resources',
                            selected: data.get,
                          },
                          {
                            desc: 'Can create resources',
                            selected: data.post,
                          },
                          {
                            desc: 'Can update resources',
                            selected: data.put,
                          },
                          {
                            desc: 'Can delete resources',
                            selected: data.delete,
                          },
                        ]}
                        onChange={(event) => {
                          target.access.templates[templateIndex] = {
                            _id: target.access.templates[templateIndex]._id,
                            get: event[0].selected,
                            post: event[1].selected,
                            put: event[2].selected,
                            delete: event[3].selected,
                          };
                        }}
                      />
                    );
                  })
                ) : (
                  <h4 class="km--permissions_empty">There are no templates</h4>
                )}
              </div>
              {functions.value.length > 0 && (
                <div class="km--permissions">
                  <h3 class="km--permissions-title">Function Permissions</h3>
                  {functions.value.map((fn) => {
                    const data = key.value.target?.access.functions.find(
                      (e) => e.name === fn.name
                    );

                    return (
                      <BCMSCheckboxArrayInput
                        title={fn.name}
                        initialValue={[
                          {
                            desc: 'Can call a function',
                            selected: !!data,
                          },
                        ]}
                      />
                    );
                  })}
                </div>
              )}
              <div class="km--actionButtons">
                <BCMSButton cyTag="delete-policy" kind="danger" class="mr-2.5">
                  Delete
                </BCMSButton>
                <BCMSButton
                  cyTag="update-policy"
                  onClick={async () => {
                    await window.bcms.util.throwable(
                      async () => {
                        const target = key.value.target as BCMSApiKey;

                        return await window.bcms.sdk.apiKey.update(target);
                      },
                      async () => {
                        window.bcms.notification.success(
                          'Keys successfully updated.'
                        );
                      }
                    );
                  }}
                >
                  Update
                </BCMSButton>
              </div>
            </>
          ) : (
            ''
          )
        ) : (
          <div class="text-center">
            <div class="text-grey text-2xl mb-20">
              There are no keys available.
            </div>
            <BCMSButton
              onClick={() => {
                modal.apiKey.addUpdate.show({
                  async onDone(data) {
                    await logic.create({
                      ...data,
                      blocked: false,
                      access: { templates: [], functions: [] },
                    });
                  },
                });
              }}
            >
              Add new key
            </BCMSButton>
          </div>
        )}
      </div>
    );
  },
});

export default component;
</script>
