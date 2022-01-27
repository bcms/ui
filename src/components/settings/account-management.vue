<script lang="tsx">
import { defineComponent } from 'vue';
// import BCMSButton from '../button.vue';
// import { BCMSMediaInput, BCMSPasswordInput, BCMSTextInput } from '../input';
import { DefaultComponentProps } from '../_default';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
  },
  setup() {
    // const store = window.bcms.vue.store;
    // const user = ref({
    //   name: {
    //     value: '',
    //     error: '',
    //   },
    //   email: {
    //     value: '',
    //     error: '',
    //   },
    //   avatar: {
    //     value: '',
    //     error: '',
    //   },
    //   password: {
    //     value: '',
    //     error: '',
    //   },
    // });

    // onMounted(async () => {
    //   let me = store.getters.user_me;

    //   if (!me) {
    //     me = await window.bcms.sdk.user.get();
    //   }

    //   user.value.name.value = me.username;
    //   user.value.email.value = me.email;
    //   user.value.avatar.value = me.customPool.personal.avatarUri;
    // });

    return () => (
      <div class="max-w-[420px]">
        <h2 class="text-[28px] leading-none font-normal -tracking-0.01 mb-7.5">
          Account management
        </h2>
        <a href="https://cloud.thebcms.com/dashboard/account" target="_blank">
          Edit account
        </a>
      </div>
    );
  },
});
export default component;
// <div class="grid grid-cols-1 gap-5 ">
//   <BCMSTextInput
//     label="Full name"
//     v-model={user.value.name.value}
//     placeholder="Enter your name"
//   />
//   <BCMSTextInput
//     label="Email"
//     v-model={user.value.email.value}
//     placeholder="Enter your email"
//     type="email"
//   />
//   <BCMSMediaInput
//     label="Avatar"
//     value={user.value.avatar.value}
//     showLink={false}
//     onClick={() => {
//       window.bcms.modal.media.picker.show({
//         async onDone(data) {
//           user.value.avatar.value = data.media._id;
//         },
//       });
//     }}
//     onClear={() => {
//       user.value.avatar.value = '';
//     }}
//   />
//   <BCMSPasswordInput
//     label="Password"
//     v-model={user.value.password.value}
//     placeholder="Enter new password"
//   />
//   <div class="flex items-center justify-between gap-2.5">
//     <BCMSButton
//       kind="ghost"
//       class="max-w-max text-red hover:text-red hover:shadow-none focus:shadow-none focus-visible:text-red"
//     >
//       Delete Account
//     </BCMSButton>
//     <BCMSButton class="max-w-max">Update</BCMSButton>
//   </div>
// </div>
</script>
