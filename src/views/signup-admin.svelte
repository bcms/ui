<script lang="ts">
  import { onMount } from 'svelte';
  import { blur } from 'svelte/transition';
  import { Button, PasswordInput, TextInput } from '../components';
  import { LocalStorageService } from '../services';

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
      if (error) {
        return;
      }
    });
  }

  onMount(async () => {});
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
        helperText="This code can be found in server console." />
      <TextInput
        class="mt--20"
        label="Email"
        placeholder="email"
        invalidText={admin.email.error} />
      <TextInput
        class="mt--20"
        label="First name"
        placeholder="First name"
        invalidText={admin.firstName.error} />
      <TextInput
        class="mt--20"
        label="Last name"
        placeholder="Last name"
        invalidText={admin.lastName.error} />
      <PasswordInput
        class="mt--20"
        label="Password"
        placeholder="Password"
        invalidText={admin.password.error} />
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
