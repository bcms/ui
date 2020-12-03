<script lang="ts">
  import { onMount, onDestroy, beforeUpdate } from 'svelte';
  import type { Template, User, UserPolicyCRUD } from '@becomes/cms-sdk';
  import {
    Layout,
    ManagerLayout,
    ManagerInfo,
    NoEntities,
    EditUserModal,
    Button,
    AddUserModal,
    CRUDPolicy,
    MakeAnAdminModal,
    ConfirmDeleteModal,
  } from '../../components';
  import { GeneralService, sdk, StoreService, NotificationService } from '../../services';
  import type { BCMSPluginNavItem } from '../../types';

  export let id: string = undefined;

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
        if (!user.customPool.policy.plugins) {
          user.customPool.policy.plugins = [];
        }
      }
    }
  });
  const pathUnsub = StoreService.subscribe('path', async (value) => {
    const link = value as string;
    if (link.startsWith('/dashboard/user/editor')) {
      const tempId = link.split('/')[link.split('/').length - 1];
      if (tempId === '-' && users.length > 0) {
        user = users[0];
      } else {
        id = tempId;
        user = users.find((e) => e._id === id);
      }
    }
  });
  let templates: Template[] = [];
  let users: User[] = [];
  let user: User;
  let idBuffer = '' + id;

  async function create(data: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }) {
    await GeneralService.errorWrapper(
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
        StoreService.update('user', (usrs: User[]) => {
          usrs.push(value);
          return usrs;
        });
        const pathParts = window.location.pathname.split('/');
        GeneralService.navigate(
          [...pathParts.splice(0, pathParts.length - 1), value._id].join('/')
        );
      }
    );
    NotificationService.success('User successfully added.');
  }
  async function update(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    await GeneralService.errorWrapper(
      async () => {
        return await sdk.user.update({
          _id: user._id,
          email: data.email,
          password:
            data.password !== ''
              ? {
                  current: '',
                  new: data.password,
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
        StoreService.update('user', (usrs: User[]) => {
          for (const i in usrs) {
            if (usrs[i]._id === value._id) {
              usrs[i] = value;
              break;
            }
          }
          return usrs;
        });
        NotificationService.success('User successfully updated.');
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
        StoreService.update('user', (usrs: User[]) => {
          for (const i in usrs) {
            if (usrs[i]._id === value._id) {
              usrs[i] = value;
              break;
            }
          }
          return usrs;
        });
        NotificationService.success('User policy successfully updated.');
      }
    );
  }
  async function makeUserAdmin() {
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
        NotificationService.success('User is now admin.');
      }
    );
  }
  async function remove() {
    await GeneralService.errorWrapper(
      async () => {
        await sdk.user.delete(user._id);
      },
      async () => {
        StoreService.update('user', (value: any[]) => {
          return value.filter((e) => e._id !== user._id);
        });
        const pathParts = window.location.pathname.split('/');
        GeneralService.navigate(
          [...pathParts.splice(0, pathParts.length - 1), '-'].join('/')
        );
      }
    );
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
    for (const i in user.customPool.policy.plugins) {
      const policy = user.customPool.policy.plugins[i];
      if (policy.name === data.name) {
        user.customPool.policy.plugins[i] = data;
        return;
      }
    }
    user.customPool.policy.plugins = [...user.customPool.policy.plugins, data];
  }

  onMount(async () => {
    StoreService.update('template', await sdk.template.getAll());
    StoreService.update('user', await sdk.user.getAll());
    if ((!id || id === '-') && users.length > 0) {
      user = users[0];
    } else {
      user = users.find((e) => e._id === id);
    }
    if (!user.customPool.policy.plugins) {
      user.customPool.policy.plugins = [];
    }
  });
  beforeUpdate(async () => {
    if (idBuffer !== id) {
      idBuffer = '' + id;
      if (id === '-') {
        user = users[0];
      } else {
        user = users.find((e) => e._id === id);
      }
      if (!user.customPool.policy.plugins) {
        user.customPool.policy.plugins = [];
      }
    }
  });
  onDestroy(() => {
    templateStoreUnsub();
    userStoreUnsub();
    pathUnsub();
  });
</script>

<Layout>
  <ManagerLayout
    label="Users"
    actionText="Add new User"
    on:action={() => {
      StoreService.update('AddUserModal', true);
    }}
    items={users.map((e) => {
      return { name: e.username, link: `/dashboard/user/editor/${e._id}`, selected: user && user._id === e._id };
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
          <Button
            kind="danger"
            on:click={() => {
              StoreService.update('ConfirmDeleteModal', true);
            }}>
            <span>Delete</span>
          </Button>
          <div class="um--policy">
            {#if user.roles[0].name === 'ADMIN'}
              <div>
                <h3 class="um--permissions_all">
                  This user is an Admin and has all privileges.
                </h3>
              </div>
            {:else}
              <div class="um--permissions">
                <div class="um--permission">
                  <h3 class="um--permission-name">
                    <span>Media Manager</span> Permissions
                  </h3>
                  <CRUDPolicy
                    initialValue={user.customPool.policy.media}
                    on:change={(event) => {
                      user.customPool.policy.media = event.detail;
                    }} />
                </div>
                <div class="um--permission">
                  <h3 class="um--permission-name">
                    <span>Custom Portal</span> Permissions
                  </h3>
                  <CRUDPolicy
                    initialValue={user.customPool.policy.customPortal}
                    on:change={(event) => {
                      user.customPool.policy.customPortal = event.detail;
                    }} />
                </div>
                {#if pluginNavItems.length > 0}
                  {#each pluginNavItems as item}
                    <div class="um--permission">
                      <h3 class="um--permission-name">
                        Plugin <span>{item.label}</span> Permissions
                      </h3>
                      <CRUDPolicy
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
                    <h3 class="um--permission-name">
                      Template <span>{template.label}</span> Permissions
                    </h3>
                    <CRUDPolicy
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
                      StoreService.update('MakeAnAdminModal', true);
                    }}>
                    Make an admin
                  </Button>
                </div>
              </div>
            {/if}
          </div>
        {/if}
      {:else}
        <NoEntities
          name="Widgets"
          on:action={() => {
            StoreService.update('NameDescModal', true);
          }} />
      {/if}
    </div>
  </ManagerLayout>
  <EditUserModal
    title="Edit user"
    {user}
    on:done={(event) => {
      update(event.detail);
    }} />
  <AddUserModal
    title="Add new user"
    on:done={(event) => {
      create(event.detail);
    }} />
  <MakeAnAdminModal on:done={makeUserAdmin} />
  <ConfirmDeleteModal on:done={remove} />
</Layout>
