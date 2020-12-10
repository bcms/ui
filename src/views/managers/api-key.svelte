<script lang="ts">
  import { onMount, onDestroy, beforeUpdate } from 'svelte';
  import type {
    APIFunction,
    ApiKey,
    Template,
    UserPolicyCRUD,
  } from '@becomes/cms-sdk';
  import {
    ManagerLayout,
    ManagerInfo,
    NoEntities,
    Button,
    CRUDPolicy,
    CheckboxInput,
    NameDescModal,
    FNPolicy,
  } from '../../components';
  import {
    GeneralService,
    sdk,
    StoreService,
    NotificationService,
    ConfirmService,
  } from '../../services';
  import Secret from '../../components/secret.svelte';

  export let params: {
    id?: string;
  } = {};

  type ApiFuntionModified = {
    selected: boolean;
  } & APIFunction;

  const keyStoreUnsub = StoreService.subscribe(
    'apiKey',
    async (value: ApiKey[]) => {
      if (value) {
        keys = value;
        key = keys.find((e) => e._id === params.id);
      }
    }
  );
  const templateStoreUnsub = StoreService.subscribe(
    'template',
    async (value) => {
      if (value) {
        templates = value;
      }
    }
  );
  const buffer = {
    id: '',
  };
  let apiFunctions: ApiFuntionModified[] = [];
  let templates: Template[] = [];
  let keys: ApiKey[] = [];
  let key: ApiKey;
  let editKeyData = {
    name: '',
    desc: '',
    title: '',
  };

  async function create(name: string, desc: string) {
    await GeneralService.errorWrapper(
      async () => {
        return await sdk.apiKey.add({
          name,
          desc,
          blocked: false,
          access: {
            templates: [],
            functions: [],
          },
        });
      },
      async (value: ApiKey) => {
        StoreService.update('apiKey', (kys: ApiKey[]) => {
          kys.push(value);
          return kys;
        });
        const pathParts = window.location.pathname.split('/');
        GeneralService.navigate(
          [...pathParts.splice(0, pathParts.length - 1), value._id].join('/')
        );
        NotificationService.success('Key successfully created.');
      }
    );
  }
  async function update(name: string, desc: string) {
    await GeneralService.errorWrapper(
      async () => {
        return await sdk.apiKey.update({
          _id: key._id,
          name,
          desc,
        });
      },
      async (value: ApiKey) => {
        StoreService.update('apiKey', (kys: ApiKey[]) => {
          for (const i in kys) {
            if (kys[i]._id === value._id) {
              kys[i] = value;
              break;
            }
          }
          return kys;
        });
        NotificationService.success('Key successfully updated.');
      }
    );
  }
  async function updatePolicy() {
    await GeneralService.errorWrapper(
      async () => {
        return await sdk.apiKey.update({
          _id: key._id,
          access: key.access,
        });
      },
      async (value: ApiKey) => {
        StoreService.update('apiKey', (kys: ApiKey[]) => {
          for (const i in kys) {
            if (kys[i]._id === value._id) {
              kys[i] = value;
              break;
            }
          }
          return kys;
        });
        NotificationService.success('Key policy successfully updated.');
      }
    );
  }
  async function blockUnblockAccess(blocked: boolean) {
    await GeneralService.errorWrapper(
      async () => {
        return await sdk.apiKey.update({
          _id: key._id,
          blocked,
        });
      },
      async (value: ApiKey) => {
        StoreService.update('apiKey', (kys: ApiKey[]) => {
          for (const i in kys) {
            if (kys[i]._id === value._id) {
              kys[i] = value;
              break;
            }
          }
          return kys;
        });
        NotificationService.success('Key successfully updated.');
      }
    );
  }
  async function remove() {
    if (
      await ConfirmService.confirm(
        'Delete Key',
        `Are you sure you want to delete <strong>${key.name}</strong>?`
      )
    ) {
      await GeneralService.errorWrapper(
        async () => {
          await sdk.apiKey.deleteById(key._id);
        },
        async () => {
          keys = keys.filter((e) => e._id !== key._id);
          key = keys[0];
        }
      );
    }
  }
  function setKeyTemplatePolicy(data: UserPolicyCRUD & { _id: string }) {
    for (const i in key.access.templates) {
      const policy = key.access.templates[i];
      if (policy._id === data._id) {
        key.access.templates[i] = data;
        return;
      }
    }
    key.access.templates = [...key.access.templates, data];
  }
  function setKeyFunctionPolicy(data: {
    fn: ApiFuntionModified;
    value: boolean;
  }) {
    if (data.value) {
      key.access.functions = [...key.access.functions, { name: data.fn._id }];
    } else {
      key.access.functions = key.access.functions.filter(
        (e) => e.name !== data.fn._id
      );
    }
  }

  beforeUpdate(async () => {
    if (buffer.id !== params.id) {
      buffer.id = params.id;
      if (params.id === '-') {
        key = keys[0];
      } else {
        key = keys.find((e) => e._id === params.id);
      }
      apiFunctions.forEach((fn) => {
        if (!fn.public) {
          if (key.access.functions.find((e) => e.name === fn._id)) {
            fn.selected = true;
          } else {
            fn.selected = false;
          }
        }
      });
    }
  });

  onMount(async () => {
    apiFunctions = (await sdk.apiFunction.getAll()).map((e) => {
      return {
        _id: e._id,
        public: e.public,
        selected: e.public ? true : false,
      };
    });
    StoreService.update('apiKey', await sdk.apiKey.getAll());
    StoreService.update('template', await sdk.template.getAll());
    if ((!params.id || params.id === '-') && keys.length > 0) {
      key = keys[0];
      GeneralService.navigate(`/dashboard/key/editor/${keys[0]._id}`, {
        replace: true,
      });
    }
  });
  onDestroy(() => {
    templateStoreUnsub();
    keyStoreUnsub();
  });
</script>

<!-- <Layout title={key ? key.name : 'Api keys'}> -->
<ManagerLayout
  label="Keys"
  actionText="Add new key"
  on:action={() => {
    StoreService.update('NameDescModal', true);
  }}
  items={keys.map((e) => {
    return { name: e.name, link: `/dashboard/key/editor/${e._id}`, selected: key && key._id === e._id };
  })}>
  <div class="km">
    {#if keys.length === 0}
      <NoEntities
        name="Key"
        on:action={() => {
          editKeyData.title = 'Add new key';
          StoreService.update('NameDescModal', true);
        }} />
    {:else if key}
      <ManagerInfo
        id={key._id}
        createdAt={key.createdAt}
        updatedAt={key.updatedAt}
        name={key.name}
        description={key.desc}
        on:edit={() => {
          editKeyData.name = '' + key.name;
          editKeyData.desc = '' + key.desc;
          StoreService.update('NameDescModal', true);
        }} />
      <Secret label="Key secret" secret={key.secret} />
      <div class="km--blocked">
        <CheckboxInput
          class="mb-10"
          description="Blocked"
          value={key.blocked}
          helperText="If checked, key will not be able to access any resources."
          on:input={(event) => {
            blockUnblockAccess(event.detail);
          }} />
      </div>
      <div class="km--permissions">
        <h3 class="km--permissions-title">Template Permissions</h3>
        {#if templates.length > 0}
          {#each templates as template}
            <div class="km--permission">
              <h3 class="km--permission-name"><span>{template.label}</span></h3>
              <CRUDPolicy
                initialValue={key.access.templates.find((e) => e._id === template._id)}
                on:change={(event) => {
                  setKeyTemplatePolicy({ _id: template._id, ...event.detail });
                }} />
            </div>
          {/each}
        {:else}
          <h4 class="km--permissions_empty">There are no templates</h4>
        {/if}
        <h3 class="km--permissions-title">Function Permissions</h3>
        {#if apiFunctions.length > 0}
          {#each apiFunctions as fn}
            <FNPolicy
              title={fn._id}
              checked={!!key.access.functions.find((e) => e.name === fn._id)}
              initialValue={fn}
              on:change={(event) => {
                setKeyFunctionPolicy({ fn, value: event.detail });
              }} />
          {/each}
        {:else}
          <h4 class="km--permissions_empty">There are no functions</h4>
        {/if}
        <div class="km--actionButtons">
          <Button
            class="bcmsButton_update"
            on:click={() => {
              updatePolicy();
            }}>
            Update
          </Button>
          <Button
            kind="danger"
            on:click={() => {
              remove();
            }}>
            <span>Delete</span>
          </Button>
        </div>
      </div>
    {/if}
  </div>
</ManagerLayout>
<NameDescModal
  name={editKeyData.name}
  title={editKeyData.name || 'Add new Key'}
  desc={editKeyData.desc}
  on:cancel={() => {
    editKeyData.name = '';
    editKeyData.desc = '';
  }}
  on:done={(event) => {
    if (editKeyData.name !== '') {
      editKeyData.name = '';
      editKeyData.desc = '';
      update(event.detail.name, event.detail.desc);
    } else {
      create(event.detail.name, event.detail.desc);
    }
  }} />
<!-- </Layout> -->
