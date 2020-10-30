<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { Template, User, UserPolicyCRUD } from '@becomes/cms-sdk';
  import {
    Layout,
    ManagerLayout,
    EntityInfo,
    NoEntities,
    EditUserModal,
    Button,
    AddUserModal,
    CRUDPolicy,
  } from '../../components';
  import { GeneralService, sdk, StoreService, popup } from '../../services';

  export let id: string = undefined;

  type SetUserTemplatePolicyData = UserPolicyCRUD & {
    _id: string;
  };

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
    popup.success('User successfully added.');
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
        popup.success('User successfully updated.');
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
        popup.success('User policy successfully updated.');
      }
    );
  }
  async function makeUserAdmin() {
    if (confirm('Are you sure you want to make this user an admin?')) {
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
          popup.success('User is now admin.');
        }
      );
    }
  }
  async function remove() {
    if (confirm('Are you sure you want to delete the user?')) {
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

  onMount(async () => {
    StoreService.update('template', await sdk.template.getAll());
    StoreService.update('user', await sdk.user.getAll());
    if ((!id || id === '-') && users.length > 0) {
      user = users[0];
    } else {
      user = users.find((e) => e._id === id);
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
    items={users.map((e, i) => {
      return { name: e.username, link: `/dashboard/user/editor/${e._id}`, selected: user && user._id === e._id };
    })}>
    <div class="um">
      {#if users.length > 0}
        {#if user}
          <EntityInfo
            id={user._id}
            createdAt={user.createdAt}
            updatedAt={user.updatedAt}
            name={user.username}
            on:edit={() => {
              StoreService.update('EditUserModal', true);
            }}
            on:delete={() => {
              remove();
            }} />
          <div class="um--policy">
            {#if user.roles[0].name === 'ADMIN'}
              <div class="um--policy-admin">
                <h3>This user is an Admin and has all privileges.</h3>
              </div>
            {:else}
              <div class="um--policy-user">
                <div class="mt--50 ml-auto">
                  <Button
                    kind="ghost"
                    icon="fas fa-crown"
                    on:click={() => {
                      makeUserAdmin();
                    }}>
                    Make an admin
                  </Button>
                </div>
                <h3 class="mt--50">Administration policy</h3>
                <div class="grid">
                  <CRUDPolicy
                    class="mt--20"
                    title="Custom portal"
                    initialValue={user.customPool.policy.customPortal}
                    on:change={(event) => {
                      user.customPool.policy.customPortal = event.detail;
                    }} />
                  <CRUDPolicy
                    class="mt--20"
                    title="Media"
                    initialValue={user.customPool.policy.media}
                    on:change={(event) => {
                      user.customPool.policy.media = event.detail;
                    }} />
                </div>
                <h3 class="mt--50">Template policy</h3>
                <div class="grid">
                  {#each templates as template}
                    <CRUDPolicy
                      class="mt--20"
                      title={template.label}
                      initialValue={user.customPool.policy.templates.find((e) => e._id === template._id)}
                      on:change={(event) => {
                        setUserTemplatePolicy({
                          _id: template._id,
                          ...event.detail,
                        });
                      }} />
                  {/each}
                </div>
                <div class="update">
                  <Button
                    icon="fas fa-user-edit"
                    on:click={() => {
                      updatePolicy();
                    }}>
                    Update
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
</Layout>
