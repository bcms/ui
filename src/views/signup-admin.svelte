<script lang="ts">
  import { onMount } from 'svelte';
  import { blur } from 'svelte/transition';
  import { navigate } from 'svelte-routing';
  import { Button, PasswordInput, TextInput, popup } from '../components';
  import { AxiosService, LocalStorageService } from '../services';

  let admin: {
    [key: string]: {
      error: string;
      value: string;
    };
  } = {
    secret: {
      value: '',
      error: '',
    },
    email: {
      value: '',
      error: '',
    },
    firstName: {
      value: '',
      error: '',
    },
    lastName: {
      value: '',
      error: '',
    },
    password: {
      value: '',
      error: '',
    },
  };

  async function isInitialized() {
    const res = await AxiosService.send(
      {
        url: '/user/is-initialized',
        method: 'GET',
      },
      true
    );
    if (!res) {
      return;
    }
    if (res.success === false) {
      popup.error(res.err.response.data.message);
      return false;
    }
    return res.res.data.initialized;
  }

  async function submit() {
    let error = false;
    Object.keys(admin).forEach((key) => {
      if (admin[key].value.replace(/ /g, '') === '') {
        admin[key].error = 'Input cannot be empty.';
        error = true;
      } else {
        admin[key].error = '';
      }
    });
    if (error) {
      return;
    }
    const res = await AxiosService.send(
      {
        url: '/user/create-admin',
        method: 'POST',
        data: {
          securityCode: admin.secret.value,
          email: admin.email.value,
          password: admin.password.value,
          customPool: {
            personal: {
              firstName: admin.firstName.value,
              lastName: admin.lastName.value,
            },
          },
        },
      },
      true
    );
    if (!res) {
      return;
    }
    if (res.success === false) {
      popup.error(res.err.response.data.message);
      return;
    }
    LocalStorageService.set('rt', res.res.data.refreshToken);
    LocalStorageService.set('at', res.res.data.accessToken);
  }

  onMount(async () => {
    if (await isInitialized()) {
      navigate('/');
      return;
    }
    await AxiosService.send(
      {
        url: '/user/generate-admin-secret',
        method: 'POST',
      },
      true
    );
  });
</script>

<div class="login">
  <div in:blur={{ delay: 250 }} out:blur class="login--wrapper">
    <div class="login--heading">
      <div class="login--heading-welcome">Welcome to</div>
      <h1>Becomes <strong>CMS</strong></h1>
    </div>
    <div class="login--content">
      <h2>Initialize admin user</h2>
      <TextInput
        class="mt--20"
        label="Server secret"
        placeholder="Secret"
        invalidText={admin.secret.error}
        helperText="This code can be found in server console."
        on:input={(event) => {
          admin.secret.value = event.detail;
        }} />
      <TextInput
        class="mt--20"
        label="Email"
        placeholder="email"
        invalidText={admin.email.error}
        on:input={(event) => {
          admin.email.value = event.detail;
        }} />
      <TextInput
        class="mt--20"
        label="First name"
        placeholder="First name"
        invalidText={admin.firstName.error}
        on:input={(event) => {
          admin.firstName.value = event.detail;
        }} />
      <TextInput
        class="mt--20"
        label="Last name"
        placeholder="Last name"
        invalidText={admin.lastName.error}
        on:input={(event) => {
          admin.lastName.value = event.detail;
        }} />
      <PasswordInput
        class="mt--20"
        label="Password"
        placeholder="Password"
        invalidText={admin.password.error}
        on:input={(event) => {
          admin.password.value = event.detail;
        }}
        on:enter={() => {
          submit();
        }} />
      <Button
        class="mt--50"
        on:click={() => {
          submit();
        }}>
        Create
      </Button>
    </div>
  </div>
</div>
