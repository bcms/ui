<script lang="tsx">
import {
  BCMSApiKey,
  BCMSApiKeyAddData,
  BCMSTemplate,
} from '@becomes/cms-sdk/types';
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
  Teleport,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  BCMSButton,
  BCMSCheckboxArrayInput,
  BCMSCheckboxInput,
  BCMSEmptyStateIllustration,
  BCMSManagerInfo,
  BCMSManagerNav,
  BCMSManagerSecret,
} from '../../components';
import { useBcmsModalService } from '../../services';

const lastState = {
  kid: '',
};

const component = defineComponent({
  setup() {
    const headMeta = window.bcms.meta;
    const mounted = ref(false);
    const store = window.bcms.vue.store;
    const route = useRoute();
    const router = useRouter();
    const modal = useBcmsModalService();
    const changes = ref(false);
    const templates = computed(() => {
      const items: BCMSTemplate[] = JSON.parse(
        JSON.stringify(store.getters.template_items)
      );
      return items.sort((a, b) => (a.name < b.name ? -1 : 1));
    });
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
    const key = ref<{
      items: BCMSApiKey[];
      target?: BCMSApiKey;
    }>({
      items: [],
    });
    // const key = computed<{
    //   items: BCMSApiKey[];
    //   target?: BCMSApiKey;
    // }>(() => {
    //   let target = store.getters.apiKey_findOne(
    //     (e) => e._id === params.value.kid
    //   );

    //   if (target) {
    //     headMeta.set({
    //       title: `${target.name} key`,
    //     });
    //   } else {
    //     target = store.getters.apiKey_items[0];
    //   }

    //   return {
    //     target,
    //     items: store.getters.apiKey_items,
    //   };
    // });
    const routerBeforeEachUnsub = router.beforeEach((_, __, next) => {
      if (changes.value) {
        window.bcms
          .confirm(
            'Leaving the page',
            'Are you sure you want to leave this page?' +
              ' You have unsaved progress which will be lost.'
          )
          .then((result) => {
            if (result) {
              next();
            } else {
              next(route.path);
            }
          });
      } else {
        next();
      }
    });

    const logic = {
      async create(data: BCMSApiKeyAddData) {
        await window.bcms.util.throwable(
          async () => {
            return await window.bcms.sdk.apiKey.create(data);
          },
          async (result) => {
            router.push(`/dashboard/key-manager/${result._id}`);
          }
        );
      },
      async remove() {
        const currentKey = key.value.target;

        if (
          currentKey &&
          (await window.bcms.confirm(
            'Delete Key',
            `Are you sure you want to delete <strong>${key.value.target?.name}</strong>?`
          ))
        ) {
          await window.bcms.util.throwable(
            async () => {
              await window.bcms.sdk.apiKey.deleteById(currentKey._id);
            },
            async () => {
              key.value.items = key.value.items.filter(
                (e) => e._id !== currentKey._id
              );

              window.bcms.notification.success('Key successfully deleted.');

              if (key.value.items.length === 0) {
                router.push('/dashboard/key-manager');
              } else {
                router.push({
                  path: `/dashboard/key-manager/${key.value.items[0]._id}`,
                  replace: true,
                });
              }
            }
          );
        }
      },
      async redirect() {
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
      },
      edit() {
        const target = key.value.target;

        if (target) {
          window.bcms.modal.apiKey.addUpdate.show({
            title: `Edit ${target.name} Key`,
            name: target.name,
            desc: target.desc,
            async onDone(data) {
              await window.bcms.util.throwable(async () => {
                await window.bcms.sdk.apiKey.update({
                  _id: target._id,
                  name: data.name,
                  desc: data.desc,
                });
              });
            },
          });
        }
      },
    };

    headMeta.set({
      title: 'Key Manager',
    });

    onMounted(async () => {
      window.onbeforeunload = () => {
        if (changes.value) {
          return true;
        }
      };
      await window.bcms.util.throwable(
        async () => {
          return await window.bcms.sdk.apiKey.getAll();
        },
        async (keys) => {
          let target = keys.find((e) => e._id === params.value.kid);

          if (target) {
            headMeta.set({
              title: `${target.name} key`,
            });
          } else {
            target = keys[0];
          }
          key.value = {
            items: keys,
            target: JSON.parse(JSON.stringify(target)),
          };
        }
      );
      if (!key.value.target) {
        await window.bcms.util.throwable(async () => {
          return await window.bcms.sdk.apiKey.getAll();
        });
        if (key.value.items.length > 0) {
          await logic.redirect();
        }
      } else {
        await logic.redirect();
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
    onUnmounted(() => {
      window.onbeforeunload = () => {
        return false;
      };
      if (routerBeforeEachUnsub) {
        routerBeforeEachUnsub();
      }
    });

    return () => (
      <div class="apiKeyManager">
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
                onEdit={logic.edit}
              />
              <BCMSManagerSecret
                label="Key secret"
                secret={key.value.target.secret}
                class="mb-5"
              />
              <BCMSCheckboxInput
                cyTag="block"
                description="Blocked"
                value={key.value.target.blocked}
                helperText="If checked, key will not be able to access any resources."
                onInput={(value) => {
                  if (key.value.target) {
                    changes.value = true;
                    key.value.target.blocked = value;
                  }
                }}
                class="mb-15"
              />
              <div class="mb-15">
                <h2 class="font-normal mb-5 text-xl">Template Permissions</h2>
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
                        name: template.name,
                      });
                    }

                    return (
                      <BCMSCheckboxArrayInput
                        key={key.value.target?._id + template._id}
                        title={<span class="text-pink">{template.label}</span>}
                        initialValue={[
                          {
                            desc: 'Can get resources',
                            selected: data.get,
                          },
                          {
                            desc: 'Can add resources',
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
                          changes.value = true;
                          target.access.templates[templateIndex] = {
                            _id: target.access.templates[templateIndex]._id,
                            name: template.name,
                            get: event[0].selected,
                            post: event[1].selected,
                            put: event[2].selected,
                            delete: event[3].selected,
                          };
                        }}
                        class="mb-15"
                      />
                    );
                  })
                ) : (
                  <div class="text-grey text-2xl mt-5">
                    There are no templates
                  </div>
                )}
              </div>
              {functions.value.length > 0 && (
                <div class="mb-15">
                  <h2 class="font-normal mb-5 text-xl">Function Permissions</h2>
                  {functions.value.map((fn) => {
                    const data = key.value.target?.access.functions.find(
                      (e) => e.name === fn.name
                    );
                    if (fn.public) {
                      // TODO: Style this option
                      return (
                        <div>
                          <div class="____functionName">{fn.name}</div>
                          <div class="____functionPublic">
                            Public (Anyone can call)
                          </div>
                        </div>
                      );
                    }

                    return (
                      <BCMSCheckboxArrayInput
                        class="mb-15"
                        title={<span class="text-pink">{fn.name}</span>}
                        initialValue={[
                          {
                            desc: 'Can call a function',
                            selected: !!data,
                          },
                        ]}
                        onChange={(event) => {
                          changes.value = true;
                          const target = key.value.target as BCMSApiKey;
                          const fnAvailable = target.access.functions.find(
                            (e) => e.name === fn.name
                          );

                          if (event[0].selected && !fnAvailable) {
                            target.access.functions.push({ name: fn.name });
                          } else if (!event[0].selected && fnAvailable) {
                            target.access.functions =
                              target.access.functions.filter(
                                (e) => e.name !== fn.name
                              );
                          }
                        }}
                      />
                    );
                  })}
                </div>
              )}
              <div class="fixed bottom-20 right-5 flex flex-col gap-2.5 desktop:fixed desktop:bottom-[unset] desktop:top-7.5 desktop:flex-row">
                <BCMSButton
                  cyTag="delete-policy"
                  kind="danger"
                  onClick={logic.remove}
                >
                  Delete
                </BCMSButton>
                <BCMSButton
                  cyTag="update-policy"
                  disabled={!changes.value}
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
          <div class="mt-7 desktop:mt-0">
            <div class="flex items-start justify-between">
              <div class="flex flex-col space-y-5">
                <span class="text-9.5 -tracking-0.03 leading-none">Keys</span>
                <div class="leading-tight -tracking-0.01">No keys found.</div>
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
            <BCMSEmptyStateIllustration
              src="/keys.png"
              maxWidth="200px"
              maxHeight="325px"
              class="mt-40 md:absolute md:bottom-32 md:right-32"
            />
          </div>
        )}
      </div>
    );
  },
});

export default component;
</script>
