<script lang="ts">
  import { onMount } from 'svelte';
  import {
    Button,
    PasswordInput,
    TextInput,
    Spinner,
    Link,
    CheckboxInput,
  } from '../components';
  import { GeneralService, QueryService, sdk, popup } from '../services';

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
  let loginInProcess: boolean = false;
  let keepLoggedIn: boolean = false;

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
    } else {
      loginInProcess = true;
    }
    await GeneralService.errorWrapper(
      async () => {
        try {
          await sdk.user.login(user.email.value, user.password.value);
        } catch (err) {
          popup.error(err.message);
          error = true;
        }
      },
      async () => {
        if (!error) {
          GeneralService.navigate('/dashboard');
        }
        loginInProcess = false;
      }
    );
  }

  onMount(async () => {
    document.body.setAttribute('style', 'top: 0; left: 0;');
    if (await sdk.isLoggedIn()) {
      GeneralService.navigate('/dashboard');
      return;
    }
    if ((await sdk.user.isInitialized()) === false) {
      GeneralService.navigate('/signup-admin');
      return;
    }
    const query = QueryService.get();
    if (query.error) {
      popup.error(query.error);
    }
  });
</script>

<div class="auth login">
  <div class="auth--content">
    <Link href="/" class="auth--bcmsLogo">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 25">
        <path
          fill="#FDFDFD"
          d="M0 23.798h12.064c5.784 0 8.759-2.975 8.759-6.776 0-2.38-1.09-3.801-2.248-4.594a7.154 7.154 0 00-2.214-1.025v-.165a6.208 6.208 0 001.818-.893c.892-.694 1.818-1.917 1.818-3.9 0-3.14-2.678-5.784-7.602-5.784H0v23.137zM6.115 9.585V5.62h4.957c1.686 0 2.48.826 2.48 1.983s-.794 1.983-2.48 1.983H6.115zm0 9.255v-4.627h5.288c2.148 0 3.14.991 3.14 2.313s-.992 2.314-3.14 2.314H6.115z" />
        <path
          fill="#FDFDFD"
          d="M22.16 12.23c0 6.94 5.289 12.229 12.89 12.229 5.025 0 8.099-2.38 9.884-4.793a13.812 13.812 0 002.346-4.793H41a5.343 5.343 0 01-1.123 1.984c-.893 1.024-2.314 1.983-4.826 1.983-3.801 0-6.445-2.644-6.445-6.61 0-3.967 2.644-6.611 6.445-6.611 2.247 0 3.669.86 4.561 1.752.529.495.926 1.09 1.223 1.718h6.28a13.221 13.221 0 00-2.248-4.528C43.117 2.314 40.042 0 35.051 0c-7.602 0-12.89 5.288-12.89 12.23z" />
        <path
          fill="#FDFDFD"
          d="M49.435 23.798h6.115V10.577l-.496-2.975h.33l4.463 10.907h6.775l4.462-10.907h.33l-.495 2.975v13.22h6.115V.662H68.44L63.648 12.56h-.827L58.03.66h-8.594v23.137z" />
        <path
          fill="#FDFDFD"
          d="M79.012 16.36c.43 1.521 1.09 2.876 2.016 4.066 1.587 2.017 4.33 4.033 9.056 4.033 6.578 0 9.916-3.636 9.916-7.602 0-5.223-5.388-6.445-9.354-7.404-2.446-.562-4.363-1.19-4.363-2.512 0-.826.793-1.653 3.14-1.653 1.686 0 2.611.496 3.14.992.298.297.53.628.661.992h6.28c-.297-1.356-.86-2.579-1.685-3.636C96.43 1.818 93.885 0 89.423 0c-6.081 0-9.585 3.437-9.585 7.272 0 4.197 3.405 5.784 6.875 6.742 3.437.893 6.842 1.421 6.842 3.173 0 1.025-.992 1.983-3.47 1.983-1.984 0-3.207-.694-3.9-1.388a3.716 3.716 0 01-.893-1.421h-6.28z" />
      </svg>
    </Link>
    <div class="auth--form">
      <h2 class="auth--title">Log in</h2>
      <div class="auth--row mb-15">
        <TextInput
          class="mt--20"
          label="Email"
          placeholder="Email"
          invalidText={user.email.error}
          on:input={(event) => {
            user.email.value = event.detail;
          }} />
      </div>
      <div class="auth--row mb-15">
        <PasswordInput
          class="mt--20 bcmsInput_password"
          label="Password"
          placeholder="Password"
          invalidText={user.password.error}
          on:input={(event) => {
            user.password.value = event.detail;
          }}
          on:enter={() => {
            submit();
          }} />
      </div>
      <div class="auth--row mb-15 mt-20 auth--row_checkbox">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="checkboxLabel mt--20">
          <CheckboxInput
            value={keepLoggedIn}
            class=""
            on:input={(event) => {
              keepLoggedIn = event.detail;
            }} />
          <span class="checkboxLabel--textContent ml--10">Keep me logged in</span>
        </label>
      </div>
      <div class="auth--row mb-15 mt-40 auth--row_submit">
        <Button
          class="mt--50"
          on:click={() => {
            submit();
          }}>
          Log in
        </Button>
      </div>
    </div>
  </div>
</div>
<Spinner show={loginInProcess} />
