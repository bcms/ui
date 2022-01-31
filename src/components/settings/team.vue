<script lang="tsx">
import { computed, defineComponent, onMounted } from 'vue';
import { SettingsTeamItem } from '.';
import { DefaultComponentProps } from '../_default';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
  },
  setup() {
    const store = window.bcms.vue.store;
    const users = computed(() => store.getters.user_items);
    // const invitations = ref([
    //   {
    //     name: 'Tomislav Nikolic',
    //     email: 'toma.niks@rs.com',
    //     role: 'admin',
    //   },
    //   {
    //     name: 'Momcilo Popov',
    //     email: 'momcilo@becomes.co',
    //     role: 'developer',
    //   },
    // ]);
    // const newInv = ref({
    //   name: {
    //     value: '',
    //     error: '',
    //   },
    //   email: {
    //     value: '',
    //     error: '',
    //   },
    // });

    // function handleInvite() {
    //   if (!newInv.value.name.value.replace(/ /g, '')) {
    //     newInv.value.name.error = 'Name is required';
    //     return;
    //   }
    //   newInv.value.name.error = '';
    //   if (!newInv.value.email.value.replace(/ /g, '')) {
    //     newInv.value.email.error = 'Email is required';
    //     return;
    //   }
    //   newInv.value.email.error = '';

    //   window.bcms.modal.settings.invite.show({
    //     onDone: async () => {
    //       newInv.value.name.value = '';
    //       newInv.value.email.value = '';
    //     },
    //   });
    // }

    onMounted(async () => {
      await window.bcms.util.throwable(async () => {
        await window.bcms.sdk.user.getAll();
      });
    });

    return () => (
      <div>
        <h2 class="text-[28px] leading-none font-normal -tracking-0.01 mb-10">
          Team
        </h2>
        <div class="relative border border-t-0 border-grey border-opacity-30 rounded-b-3.5 pt-5 pb-7.5 pr-7.5 pl-5.5 mb-10">
          <header class="absolute -top-2.5 -left-px flex items-center justify-between before:w-4 before:h-2.5 before:absolute before:top-0 before:left-0 before:border-t before:border-l before:border-grey before:border-opacity-30 before:rounded-tl-2.5 after:w-2.5 after:h-2.5 after:absolute after:top-0 after:right-0 after:border-t after:border-r after:border-grey after:border-opacity-30 after:rounded-tr-2.5 w-[calc(100%+2px)]">
            <div class="flex items-center border-b border-grey border-opacity-50 relative w-full justify-between border-none ">
              <div class="flex items-center relative w-full pl-5.5 pr-3.5 translate-x-0 translate-y-[-7px] text-dark after:relative after:top-1/2 after:flex-grow after:h-px after:bg-grey after:bg-opacity-30 after:translate-x-1 after:-translate-y-0.5">
                <div class="text-xs leading-normal tracking-0.06 uppercase flex-grow-0 mr-1 flex-shrink-0 text-inherit">
                  Users
                </div>
              </div>
            </div>
          </header>
          <div class="grid grid-cols-1 gap-5.5 mb-10">
            {users.value.map((user) => (
              <SettingsTeamItem item={user} />
            ))}
          </div>
          <div>
            <a
              href="https://cloud.thebcms.com/dashboard/o/cohesion/i/test-5"
              target="_blank"
              rel="noopener noreferrer"
              class="rounded-3.5 transition-all duration-300 inline-block font-medium text-base leading-normal -tracking-0.01 whitespace-normal no-underline border border-solid select-none bg-dark border-dark text-white py-1.5 px-5 hover:shadow-btnPrimary hover:text-white focus:shadow-btnPrimary focus:text-white active:shadow-btnPrimary active:text-white disabled:bg-grey disabled:opacity-50 disabled:border-grey disabled:border-opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none focus:outline-none"
            >
              Invite a new user
            </a>
          </div>
        </div>
      </div>
    );
  },
});

export default component;
</script>
