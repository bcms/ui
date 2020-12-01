<script lang="ts">
  import { createEventDispatcher, beforeUpdate } from 'svelte';
  import { StoreService } from '../../services';
  import Modal from './modal.svelte';
  import { TextInput, PasswordInput } from '../input';
  import type { User } from '@becomes/cms-sdk';
  import Button from '../button.svelte';

  export let title: string;
  export let user: User;

  type Data = {
    email: {
      value: string;
      error: string;
    };
    firstName: {
      value: string;
      error: string;
    };
    lastName: {
      value: string;
      error: string;
    };
    password: {
      value: string;
      error: string;
    };
  };

  const dispatch = createEventDispatcher();
  const modalName = 'EditUserModal';
  const buffer = {
    id: '',
  };
  let data: Data = getData(user);

  function getData(u?: User): Data {
    if (u) {
      return {
        email: {
          value: '' + user ? user.email : '',
          error: '',
        },
        firstName: {
          value: '' + user ? user.customPool.personal.firstName : '',
          error: '',
        },
        lastName: {
          value: '' + user ? user.customPool.personal.lastName : '',
          error: '',
        },
        password: {
          value: '',
          error: '',
        },
      };
    }
    return {
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
  }
  function close() {
    StoreService.update(modalName, false);
    setTimeout(() => {
      buffer.id = '';
    }, 300);
  }
  function cancel() {
    dispatch('cancel');
    close();
  }
  function done() {
    const errorMessages = {
      email: 'Email input cannot be empty.',
      firstName: 'First name input cannot be empty.',
      lastName: 'Last name input cannot be empty.',
    };
    for (const key in errorMessages) {
      if (data[key].value.replace(/ /g, '') === '') {
        data[key].error = errorMessages[key];
        return;
      }
      data[key].error = '';
    }
    dispatch('done', {
      email: data.email.value,
      firstName: data.firstName.value,
      lastName: data.lastName.value,
      password: data.password.value,
    });
    close();
  }

  beforeUpdate(() => {
    if (user) {
      if (buffer.id !== user._id) {
        buffer.id = '' + user._id;
        data = getData(user);
      }
    }
  });
</script>

<Modal name={modalName} on:cancel={cancel}>
  <div slot="header">
    <h2 class="bcmsModal--title">{title}</h2>
  </div>
  <div class="bcmsModal--row">
    <TextInput
      label="Email"
      placeholder="Email"
      invalidText={data.email.error}
      value={data.email.value}
      on:input={(event) => {
        data.email.value = event.detail;
      }} />
  </div>
  <div class="bcmsModal--row">
    <TextInput
      label="First name"
      placeholder="First name"
      invalidText={data.firstName.error}
      value={data.firstName.value}
      on:input={(event) => {
        data.firstName.value = event.detail;
      }} />
  </div>
  <div class="bcmsModal--row">
    <TextInput
      label="Last name"
      placeholder="Last name"
      invalidText={data.lastName.error}
      value={data.lastName.value}
      on:input={(event) => {
        data.lastName.value = event.detail;
      }} />
  </div>
  <div class="bcmsModal--row">
    <PasswordInput
      label="New password"
      placeholder="New password"
      invalidText={data.password.error}
      value={data.password.value}
      on:input={(event) => {
        data.password.value = event.detail;
      }} />
    <p class="helperText mt--5">Leave empty if you do not want to modify it.</p>
  </div>
  <div class="bcmsModal--row bcmsModal--row_submit">
    <Button on:click={done}><span>Update</span></Button>
    <Button kind="ghost" on:click={close}>Cancel</Button>
  </div>
</Modal>
