<script lang="ts">
  import { onMount } from 'svelte';
  import { blur } from 'svelte/transition';
  import { navigate } from 'svelte-routing';
  import { Button, PasswordInput, TextInput, popup } from '../components';
  import { GeneralService, sdk } from '../services';

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
    await sdk.user.createAdmin({
      code: admin.secret.value,
      email: admin.email.value,
      firstName: admin.firstName.value,
      lastName: admin.lastName.value,
      password: admin.password.value,
    });
    window.location.href = '/dashboard';
  }

  onMount(async () => {
    if (await sdk.user.isInitialized()) {
      GeneralService.navigate('/');
      return;
    }
    await sdk.user.generateAdminSecret();
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
