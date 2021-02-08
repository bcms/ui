<script lang="ts">
  import { onMount, onDestroy, beforeUpdate } from 'svelte';
  import { RoleName, Template, User, UserPolicyCRUD } from '@becomes/cms-sdk';
  import {
    ManagerLayout,
    ManagerInfo,
    EditUserModal,
    Button,
    AddUserModal,
    CRUDPolicy,
    Meta,
  } from '../../components';
  import {
    GeneralService,
    sdk,
    StoreService,
    NotificationService,
    ConfirmService,
  } from '../../services';
  import type { BCMSPluginNavItem } from '../../types';
  import { Router } from '@becomes/svelte-router';

  export let params: {
    id?: string;
  } = {};

  type SetUserTemplatePolicyData = UserPolicyCRUD & { _id: string };
  type SetUserPluginPolicyData = UserPolicyCRUD & { name: string };

  const pluginNavItems: BCMSPluginNavItem[] = GeneralService.pluginNavItems;
  const templateStoreUnsub = StoreService.subscribe(
    'template',
    async (value) => {
      if (value) {
        templates = value;
      }
    }
  );
  const userStoreUnsub = StoreService.subscribe('user', async (value) => {
    if (value) {
      users = value;
      if (user) {
        user = users.find((e) => e._id === user._id);
        if (user && !user.customPool.policy.plugins) {
          user.customPool.policy.plugins = [];
        }
      }
    }
  });
  let templates: Template[] = [];
  let users: User[] = [];
  let user: User;
  let idBuffer = '' + params.id;

  async function create(data: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }) {
    user = await GeneralService.errorWrapper(
      async () => {
        return await sdk.user.add({
          email: data.email,
          password: data.password,
          customPool: {
            personal: {
              firstName: data.firstName,
              lastName: data.lastName,
            },
          },
        });
      },
      async (value: User) => {
        return value;
      }
    );
    await GeneralService.errorWrapper(
      async () => {
        return await sdk.user.getAll();
      },
      async (value) => {
        StoreService.update('user', value);
        Router.navigate(`/dashboard/user/editor/${user._id}`, {
          replace: true,
        });
      }
    );
    NotificationService.success('User successfully added.');
  }
  async function update(data: {
    email: string;
    password: {
      current: string;
      new: string;
    };
    firstName: string;
    lastName: string;
  }) {
    await GeneralService.errorWrapper(
      async () => {
        return await sdk.user.update({
          _id: user._id,
          email: data.email,
          password:
            data.password.current && data.password.new !== ''
              ? {
                  current: data.password.current,
                  new: data.password.new,
                }
              : undefined,
          customPool: {
            personal: {
              firstName: data.firstName,
              lastName: data.lastName,
            },
          },
        });
      },
      async (value: User) => {
        user = value;
        NotificationService.success('User successfully updated.');
      }
    );
    GeneralService.errorWrapper(
      async () => {
        return await sdk.user.getAll();
      },
      async (value) => {
        StoreService.update('user', value);
      }
    );
  }
  async function updatePolicy() {
    await GeneralService.errorWrapper(
      async () => {
        return sdk.user.update({
          _id: user._id,
          customPool: {
            policy: user.customPool.policy,
          },
        });
      },
      async (value: User) => {
        user = value;
        NotificationService.success('Member policy successfully updated.');
      }
    );
    await GeneralService.errorWrapper(
      async () => {
        return await sdk.user.getAll();
      },
      async (value) => {
        StoreService.update('user', value);
      }
    );
  }
  async function makeUserAdmin() {
    if (
      await ConfirmService.confirm(
        'Make member an admin',
        `
          Are you sure you want to make <strong>${user.username}</strong> an admin?
        `
      )
    ) {
      await GeneralService.errorWrapper(
        async () => {
          return sdk.user.makeAnAdmin(user._id);
        },
        async (value: User) => {
          user = value;
          StoreService.update('user', (usrs: User[]) => {
            for (const i in usrs) {
              if (usrs[i]._id === value._id) {
                usrs[i] = value;
                break;
              }
            }
            return usrs;
          });
          NotificationService.success('Member is now an admin.');
        }
      );
    }
  }
  async function remove() {
    if (
      await ConfirmService.confirm(
        'Delete member',
        `
          Are you sure you want to delete member <strong>${user.username}</strong>?
        `
      )
    ) {
      await GeneralService.errorWrapper(
        async () => {
          await sdk.user.delete(user._id);
        },
        async () => {
          StoreService.update('user', (value: any[]) => {
            return value.filter((e) => e._id !== user._id);
          });
          const pathParts = window.location.pathname.split('/');
          Router.navigate(
            [...pathParts.splice(0, pathParts.length - 1), '-'].join('/')
          );
        }
      );
    }
  }
  function setUserTemplatePolicy(data: SetUserTemplatePolicyData) {
    for (const i in user.customPool.policy.templates) {
      const policy = user.customPool.policy.templates[i];
      if (policy._id === data._id) {
        user.customPool.policy.templates[i] = data;
        return;
      }
    }
    user.customPool.policy.templates = [
      ...user.customPool.policy.templates,
      data,
    ];
  }
  function setUserPluginPolicy(data: SetUserPluginPolicyData) {
    if (user) {
      for (const i in user.customPool.policy.plugins) {
        const policy = user.customPool.policy.plugins[i];
        if (policy.name === data.name) {
          user.customPool.policy.plugins[i] = data;
          return;
        }
      }
      user.customPool.policy.plugins = [
        ...user.customPool.policy.plugins,
        data,
      ];
    }
  }

  onMount(async () => {
    templates = await GeneralService.errorWrapper<Template[], Template[]>(
      async () => {
        return await sdk.template.getAll();
      },
      async (value) => {
        return value;
      }
    );
    users = await GeneralService.errorWrapper<User[], User[]>(
      async () => {
        return await sdk.user.getAll();
      },
      async (value) => {
        return value;
      }
    );
    if ((!params.id || params.id === '-') && users.length > 0) {
      user = users[0];
      Router.navigate(`/dashboard/user/editor/${users[0]._id}`, {
        replace: true,
      });
    } else {
      user = users.find((e) => e._id === params.id);
    }
    if (!user.customPool.policy.plugins) {
      user.customPool.policy.plugins = [];
    }
  });
  beforeUpdate(async () => {
    if (idBuffer !== params.id) {
      idBuffer = '' + params.id;
      if (params.id === '-') {
        user = users[0];
      } else {
        user = users.find((e) => e._id === params.id);
      }
      if (!user.customPool.policy.plugins) {
        user.customPool.policy.plugins = [];
      }
    }
  });
  onDestroy(() => {
    templateStoreUnsub();
    userStoreUnsub();
  });
</script>

<Meta title={user ? user.username : 'Users'} />
<ManagerLayout
  label="Members"
  actionText="Add new member"
  on:action={() => {
    StoreService.update('AddUserModal', true);
  }}
  items={users.map((e) => {
    return { name: e.username, link: `/dashboard/user/editor/${e._id}`, selected: user && user._id === e._id, role: e.roles[0].name };
  })}>
  <div class="um">
    {#if users.length > 0}
      {#if user}
        <ManagerInfo
          id={user._id}
          createdAt={user.createdAt}
          updatedAt={user.updatedAt}
          name={user.username}
          description=""
          on:edit={() => {
            StoreService.update('EditUserModal', true);
          }} />
        <div class="um--policy">
          {#if user.roles[0].name === RoleName.ADMIN}
            <div>
              <h3 class="um--permissions_all">
                This member is an admin and has all the permissions.
              </h3>
              <div class="um--actionButtons">
                <Button
                  kind="danger"
                  on:click={() => {
                    remove();
                  }}>
                  <span>Delete member</span>
                </Button>
              </div>
            </div>
          {:else}
            <div class="um--permissions">
              <div class="um--permission">
                <CRUDPolicy
                  title="<span>Media Manager</span> Permissions"
                  initialValue={user.customPool.policy.media}
                  on:change={(event) => {
                    user.customPool.policy.media = event.detail;
                  }} />
              </div>
              {#if pluginNavItems.length > 0}
                {#each pluginNavItems as item}
                  <div class="um--permission">
                    <CRUDPolicy
                      title={`Plugin <span>${item.label}</span> Permissions`}
                      initialValue={user.customPool.policy.plugins ? user.customPool.policy.plugins.find((e) => e.name === item.name) : undefined}
                      on:change={(event) => {
                        setUserPluginPolicy({
                          name: item.name,
                          ...event.detail,
                        });
                      }} />
                  </div>
                {/each}
              {/if}
              {#each templates as template}
                <div class="um--permission">
                  <CRUDPolicy
                    title={`Template <span>${template.label}</span> Permissions`}
                    initialValue={user.customPool.policy.templates.find((e) => e._id === template._id)}
                    on:change={(event) => {
                      setUserTemplatePolicy({
                        _id: template._id,
                        ...event.detail,
                      });
                    }} />
                </div>
              {/each}
              <div class="um--actionButtons">
                <Button
                  class="bcmsButton_update"
                  on:click={() => {
                    updatePolicy();
                  }}>
                  Update
                </Button>
                <Button
                  kind="secondary"
                  class="bcmsButton_makeAdmin"
                  on:click={() => {
                    makeUserAdmin();
                  }}>
                  Make an admin
                </Button>
                <Button
                  kind="danger"
                  on:click={() => {
                    remove();
                  }}>
                  <span>Delete member</span>
                </Button>
              </div>
            </div>
          {/if}
        </div>
      {/if}
    {/if}
  </div>
</ManagerLayout>
<EditUserModal
  title="Edit member"
  {user}
  on:done={(event) => {
    update(event.detail);
  }} />
<AddUserModal
  title="Add new member"
  on:done={(event) => {
    create(event.detail);
  }} />
