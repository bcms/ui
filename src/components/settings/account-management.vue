<script lang="tsx">
import { computed, defineComponent } from 'vue';
import { DefaultComponentProps } from '../_default';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
  },
  setup() {
    const store = window.bcms.vue.store;
    const user = computed(() => store.getters.user_me);

    return () => (
      <div class="max-w-[420px]">
        <h2 class="text-[28px] leading-none font-normal -tracking-0.01 mb-7.5">
          Account management
        </h2>
        {user.value && (
          <div class="flex items-center mb-7.5">
            <div class="mr-5 select-none">
              {user.value.customPool.personal.avatarUri ? (
                <img
                  src={user.value.customPool.personal.avatarUri}
                  alt={user.value.username}
                  class="w-20 h-20 object-cover rounded-full"
                />
              ) : (
                <div class="w-20 h-20 rounded-full bg-grey bg-opacity-70 outline-green mr-2.5 flex justify-center items-center">
                  <span class="text-white font-semibold relative top-0.5 text-3xl">
                    {user.value.username
                      .split(' ')
                      .map((word) => word[0])
                      .slice(0, 2)
                      .join('')}
                  </span>
                </div>
              )}
            </div>
            <div class="text-dark text-opacity-80">
              <div class="text-xl font-medium">{user.value.username}</div>
              <div>{user.value.email}</div>
            </div>
          </div>
        )}
        <a
          href="https://cloud.thebcms.com/dashboard/account"
          target="_blank"
          rel="noopener noreferrer"
          class="rounded-3.5 transition-all duration-300 inline-block font-medium text-base leading-normal -tracking-0.01 whitespace-normal no-underline border border-solid select-none bg-dark border-dark text-white py-1.5 px-5 hover:shadow-btnPrimary hover:text-white focus:shadow-btnPrimary focus:text-white active:shadow-btnPrimary active:text-white disabled:bg-grey disabled:opacity-50 disabled:border-grey disabled:border-opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none focus:outline-none"
        >
          Edit account
        </a>
      </div>
    );
  },
});
export default component;
</script>
