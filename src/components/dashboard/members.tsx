import { computed, defineComponent } from 'vue';
import { useTranslation } from '../../translations';
import { BCMSButton, BCMSLink, BCMSOverflowMenu } from '..';

const component = defineComponent({
  setup() {
    const translations = computed(() => {
      return useTranslation();
    });
    const store = window.bcms.vue.store;
    const userMe = computed(() => store.getters.user_me);

    const members = computed(() =>
      store.getters.user_items.filter((e) => e._id !== userMe.value?._id),
    );

    return () => {
      return (
        <div class="max-w-[890px] mb-17.5">
          <div class="flex flex-col gap-5 justify-between mb-10 desktop:flex-row desktop:items-center desktop:gap-6">
            <div class="flex items-center">
              <h2 class="text-[28px] leading-tight tracking-[-0.01em] mr-6 dark:text-light">
                {translations.value.page.home.members.title}
              </h2>
              {members.value.length > 0 && (
                <BCMSButton href="https://cloud.thebcms.com/dashboard" newTab>
                  {translations.value.page.home.members.invite}
                </BCMSButton>
              )}
            </div>
            {members.value.length > 0 && (
              <BCMSLink
                href="/dashboard/settings"
                class="leading-tight tracking-[-0.01em] text-green hover:underline dark:text-yellow"
              >
                {translations.value.page.home.members.seeAll}
              </BCMSLink>
            )}
          </div>
          {members.value.length > 0 ? (
            <div class="grid grid-cols-1 gap-6 desktop:grid-cols-2">
              {members.value.map((member, index) => {
                return (
                  <div
                    key={index}
                    class="relative flex items-center justify-between border border-grey/50 rounded-lg px-[14px] py-4 dark:bg-darkGrey"
                  >
                    <div class="flex items-center">
                      {member.customPool.personal.avatarUri ? (
                        <img
                          src={member.customPool.personal.avatarUri}
                          alt={member.username}
                          class="w-10 h-10 rounded-full object-cover border-[3px] border-pink mr-2.5"
                        />
                      ) : (
                        <div class="w-10 h-10 rounded-full bg-grey bg-opacity-70 border-2 border-green mr-2.5 flex justify-center items-center select-none dark:border-yellow">
                          <span class="text-white font-semibold relative top-0.5">
                            {member.username
                              .split(' ')
                              .map((word) => word[0])
                              .slice(0, 2)
                              .join('')}
                          </span>
                        </div>
                      )}
                      <span class="leading-tight tracking-[-0.01em] dark:text-light">
                        {member.username}
                      </span>
                    </div>
                    <BCMSOverflowMenu position="right" />
                  </div>
                );
              })}
            </div>
          ) : (
            <div class="-mt-6">
              <div class="leading-tight tracking-[-0.01em] mb-8 dark:text-light">
                {translations.value.page.home.members.noUsers}
              </div>
              <BCMSButton href="https://cloud.thebcms.com/dashboard" newTab>
                {translations.value.page.home.members.invite}
              </BCMSButton>
            </div>
          )}
        </div>
      );
    };
  },
});

export default component;
