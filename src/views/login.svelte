<script lang="ts">
  import { onMount } from 'svelte';
  import { blur } from 'svelte/transition';
  import { navigate } from 'svelte-routing';
  import { Button, PasswordInput, TextInput, popup } from '../components';
  import { AxiosService, QueryService, sdk } from '../services';

  let user: {
    [key: string]: {
      error: string;
      value: string;
    };
  } = {
    email: {
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
    Object.keys(user).forEach((key) => {
      if (user[key].value.replace(/ /g, '') === '') {
        user[key].error = 'Input cannot be empty.';
        error = true;
      } else {
        user[key].error = '';
      }
    });
    if (error) {
      return;
    }
    // const res = await AxiosService.send(
    //   {
    //     url: '/auth/user',
    //     method: 'POST',
    //     headers: {
    //       Authorization:
    //         'Basic ' +
    //         GeneralService.b64.encode(
    //           user.email.value + ':' + user.password.value
    //         ),
    //     },
    //   },
    //   true
    // );
    // if (!res) {
    //   return;
    // }
    // if (res.success === false) {
    //   popup.error(res.err.response.data.message);
    //   return;
    // }
    // LocalStorageService.set('rt', res.res.data.refreshToken);
    // LocalStorageService.set('at', res.res.data.accessToken);
    await sdk.user.login(user.email.value, user.password.value);
    window.location.href = '/dashboard';
  }

  onMount(async () => {
    if (await sdk.isLoggedIn()) {
      window.location.href = '/dashboard';
      return;
    }
    if ((await isInitialized()) === false) {
      navigate('/signup-admin');
      return;
    }
    const query = QueryService.get();
    if (query.error) {
      popup.error(query.error);
    }
  });
</script>

<div class="login">
  <div in:blur={{ delay: 250 }} out:blur class="login--wrapper">
    <div class="login--heading">
      <div class="login--heading-welcome">Welcome to</div>
      <h1>Becomes <strong>CMS</strong></h1>
    </div>
    <div class="login--content">
      <h2>Log in</h2>
      <TextInput
        class="mt--20"
        label="Email"
        placeholder="email"
        invalidText={user.email.error}
        on:input={(event) => {
          user.email.value = event.detail;
        }} />
      <PasswordInput
        class="mt--20"
        label="Password"
        placeholder="Password"
        invalidText={user.password.error}
        on:input={(event) => {
          user.password.value = event.detail;
        }}
        on:enter={() => {
          submit();
        }} />
      <Button
        class="mt--50"
        on:click={() => {
          submit();
        }}>
        Submit
      </Button>
    </div>
  </div>
</div>
