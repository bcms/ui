<script lang="tsx">
import type {
  BCMSApiKey,
  BCMSApiKeyAddData,
  BCMSTemplate,
} from '@becomes/cms-sdk/types';
import {
  computed,
  defineComponent,
  onBeforeUpdate,
  onMounted,
  onUnmounted,
  ref,
  Teleport,
} from 'vue';
import { useI18n } from 'vue-i18n';
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

type I18NPermissions = Array<{
  description: string;
}>;

const component = defineComponent({
  setup() {
    const { t: i18n, tm } = useI18n();
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
    const params = computed(() => {
      return route.params as {
        kid: string;
      };
    });
    const key = ref<{
      items: BCMSApiKey[];
      target?: BCMSApiKey;
    }>({
      items: [],
    });
    const templatePermissionValues = tm(
      'keyManager.templatePermission.values'
    ) as I18NPermissions;
    const functionPermissionValues = tm(
      'keyManager.functionPermissions.values'
    ) as I18NPermissions;
    const routerBeforeEachUnsub = router.beforeEach((_, __, next) => {
      if (changes.value) {
        window.bcms
          .confirm(
            i18n('keyManager.confirm.pageLeave.title'),
            i18n('keyManager.confirm.pageLeave.description')
          )
          .then((result) => {
            if (result) {
              changes.value = false;
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
            key.value = {
              items: await window.bcms.sdk.apiKey.getAll(),
              target: result,
            };
            router.push(`/dashboard/key-manager/${result._id}`);
          }
        );
      },
      async remove() {
        const currentKey = key.value.target;

        if (
          currentKey &&
          (await window.bcms.confirm(
            i18n('keyManager.confirm.remove.title'),
            i18n('keyManager.confirm.remove.description', {
              label: key.value.target?.name,
            })
          ))
        ) {
          await window.bcms.util.throwable(
            async () => {
              await window.bcms.sdk.apiKey.deleteById(currentKey._id);
            },
            async () => {
              changes.value = false;
              key.value.items = key.value.items.filter(
                (e) => e._id !== currentKey._id
              );

              window.bcms.notification.success(
                i18n('keyManager.notification.keyDeleteSuccess')
              );

              if (key.value.items.length === 0) {
                lastState.kid = '';
                key.value.target = undefined;
                router.push('/dashboard/key-manager');
              } else {
                router.push({
                  path: `/dashboard/key-manager/${key.value.items[0]?._id}`,
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
        const targetId = lastState.kid
          ? lastState.kid
          : key.value.items[0]?._id;
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
            title: i18n('modal.addUpdateApiKey.editTitle', {
              label: target.name,
            }),
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
      title: i18n('keyManager.meta.title'),
    });

    async function init() {
      await window.bcms.util.throwable(
        async () => {
          return await window.bcms.sdk.apiKey.getAll();
        },
        async (keys) => {
          let target = keys.find((e) => e._id === params.value.kid);

          if (target) {
            headMeta.set({
              title: i18n('keyManager.meta.dynamicTitle', {
                label: target.name,
              }),
            });
          } else {
            target = keys[0];
          }
          if (target) {
            key.value = {
              items: keys,
              target: JSON.parse(JSON.stringify(target)),
            };
          }
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
                      (f) => f.name === e.name
                    )
                  : false,
              };
            });
          }
        );
      }
    }

    onMounted(async () => {
      window.onbeforeunload = () => {
        if (changes.value) {
          return true;
        }
      };
      await init();
      mounted.value = true;
    });
    onUnmounted(() => {
      window.onbeforeunload = () => {
        return null;
      };
      if (routerBeforeEachUnsub) {
        routerBeforeEachUnsub();
      }
    });
    onBeforeUpdate(async () => {
      if (key.value.target && lastState.kid !== params.value.kid) {
        lastState.kid = params.value.kid as string;
        await init();
      }
    });

    return () => (
      <div class="apiKeyManager">
        {key.value.target && mounted.value ? (
          <Teleport to="#managerNav">
            <BCMSManagerNav
              label={i18n('keyManager.nav.label')}
              actionText={i18n('keyManager.nav.actionText')}
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
                label={i18n('keyManager.input.secret.label')}
                secret={key.value.target.secret}
                class="mb-5"
              />
              <BCMSCheckboxInput
                cyTag="block"
                description={i18n('keyManager.input.block.label')}
                value={key.value.target.blocked}
                helperText={i18n('keyManager.input.block.helperText')}
                onInput={(value) => {
                  if (key.value.target) {
                    changes.value = true;
                    key.value.target.blocked = value;
                  }
                }}
                class="mb-15"
              />
              <div class="mb-15">
                <h2 class="font-normal mb-5 text-xl">
                  {i18n('keyManager.templatePermission.title')}
                </h2>
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
                            desc: templatePermissionValues[0].description,
                            selected: data.get,
                          },
                          {
                            desc: templatePermissionValues[1].description,
                            selected: data.post,
                          },
                          {
                            desc: templatePermissionValues[2].description,
                            selected: data.put,
                          },
                          {
                            desc: templatePermissionValues[3].description,
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
                    {i18n('keyManager.templatePermission.emptyTitle')}
                  </div>
                )}
              </div>
              {functions.value.length > 0 && (
                <div class="mb-15">
                  <h2 class="font-normal mb-5 text-xl">
                    {i18n('keyManager.functionPermission.title')}
                  </h2>
                  {functions.value.map((fn) => {
                    const data = key.value.target?.access.functions.find(
                      (e) => e.name === fn.name
                    );
                    if (fn.public) {
                      return (
                        <div class="text-sm mb-10">
                          <div class="text-2xl leading-tight font-normal text-pink mb-2">
                            {fn.name}
                          </div>
                          <div class="leading-tight font-normal text-dark">
                            {i18n('keyManager.functionPermission.public')}
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
                            desc:
                              functionPermissionValues &&
                              functionPermissionValues[0]
                                ? functionPermissionValues[0].description
                                : 'Can call the function',
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
                  {i18n('keyManager.actions.delete')}
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
                          i18n('keyManager.notification.keyUpdateSuccess')
                        );
                        changes.value = false;
                      }
                    );
                  }}
                >
                  {i18n('keyManager.actions.update')}
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
                <span class="text-9.5 -tracking-0.03 leading-none">
                  {i18n('keyManager.emptyState.title')}
                </span>
                <div class="leading-tight -tracking-0.01">
                  {i18n('keyManager.emptyState.subtitle')}
                </div>
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
                {i18n('keyManager.emptyState.actionText')}
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
