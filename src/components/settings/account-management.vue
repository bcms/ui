<script lang="tsx">
import { defineComponent, ref } from 'vue';
import { BCMSButton } from '..';
import { BCMSMediaInput, BCMSPasswordInput, BCMSTextInput } from '../input';
import { DefaultComponentProps } from '../_default';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
  },
  setup() {
    const user = ref({
      name: 'Momcilo Popov',
      email: 'momcilo@becomes.co',
      avatar: '',
      password: '*****************',
    });

    return () => (
      <div class="max-w-[420px] mb-[50px]">
        <h2 class="text-[28px] leading-none font-normal -tracking-0.01 mb-[30px]">
          Account management
        </h2>
        <div class="grid grid-cols-1 gap-5 ">
          <BCMSTextInput
            label="Full name"
            v-model={user.value.name}
            placeholder="Enter your name"
          />
          <BCMSTextInput
            label="Email"
            v-model={user.value.email}
            placeholder="Enter your email"
            type="email"
          />
          <BCMSMediaInput
            label="Avatar"
            value={user.value.avatar}
            showLink={false}
            onClick={() => {
              window.bcms.modal.media.picker.show({
                async onDone(data) {
                  user.value.avatar = data.media._id;
                },
              });
            }}
            onClear={() => {
              user.value.avatar = '';
            }}
          />
          <BCMSPasswordInput
            label="Password"
            v-model={user.value.password}
            placeholder="Enter new password"
          />
          <BCMSButton kind="danger" class="max-w-max">
            Delete Account
          </BCMSButton>
        </div>
      </div>
    );
  },
});
export default component;
</script>
