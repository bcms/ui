import {
  Transition,
  computed,
  defineComponent,
  nextTick,
  ref,
  watch,
} from 'vue';
import { useTranslation } from '../../translations';
import { BCMSButton, BCMSIcon, BCMSLink, BCMSOverflowMenu } from '@/components';

const component = defineComponent({
  setup() {
    const translations = computed(() => {
      return useTranslation();
    });
    const headMeta = window.bcms.meta;
    headMeta.set({
      title: translations.value.page.home.meta.title,
    });

    const showCreateNewDropdown = ref(false);
    const showEntriesDropdown = ref(false);
    const entriesDropdownDOM = ref<HTMLElement>();
    const createNewOptions = ref([
      {
        label: 'Template',
        icon: '/administration/template',
        href: '/dashboard/t',
      },
      {
        label: 'Widget',
        icon: '/administration/widget',
        href: '/dashboard/w',
      },
      {
        label: 'Group',
        icon: '/administration/group',
        href: '/dashboard/g',
      },
      {
        label: 'File upload',
        icon: '/administration/media',
        href: '/dashboard/media',
      },
      {
        label: 'Entry',
        icon: '/file',
        onClick() {
          showEntriesDropdown.value = !showEntriesDropdown.value;
        },
      },
    ]);

    const activity = ref(false);
    const uploads = new Array(0).fill('');
    const members = new Array(0).fill('');

    const checkIfDropdownIsOverflowing = () => {
      nextTick(() => {
        if (entriesDropdownDOM.value) {
          const rect = entriesDropdownDOM.value.getBoundingClientRect();
          if (
            rect.bottom >
            (window.innerHeight || document.documentElement.clientHeight)
          ) {
            // Bottom is out of viewport
            entriesDropdownDOM.value.style.bottom = `${
              rect.bottom - window.innerHeight + 80
            }px`;
          }

          if (
            rect.right >
            (window.innerWidth || document.documentElement.clientWidth)
          ) {
            // Right side is out of viewport
            entriesDropdownDOM.value.style.right = `${
              rect.right - window.innerWidth
            }px`;
          }
        }
      });
    };

    watch(showEntriesDropdown, (newVal) => {
      if (newVal) {
        checkIfDropdownIsOverflowing();
      }
    });

    return () => {
      return (
        <div class="pt-7.5 desktop:pt-0">
          <div class="mb-10">
            <div class="flex items-center justify-between max-w-[445px]">
              <div>
                <div class="text-[38px] leading-tight font-light tracking-[-0.02em] mb-1 dark:text-light">
                  Hello Mark,
                </div>
                <div class="leading-tight font-light tracking-[-0.01em] dark:text-light">
                  Have a nice day at work
                </div>
              </div>
              <div class="relative">
                <BCMSButton
                  onClick={() => {
                    showCreateNewDropdown.value = !showCreateNewDropdown.value;
                  }}
                >
                  <span class="flex items-center">
                    <span class="mr-1">Create new</span>
                    <BCMSIcon src="/plus" class="fill-current w-4 h-4" />
                  </span>
                </BCMSButton>
                <Transition name="fade">
                  {showCreateNewDropdown.value && (
                    <div
                      v-clickOutside={() => {
                        showCreateNewDropdown.value = false;
                      }}
                      class="absolute -bottom-2 right-0 w-[320px] max-w-[100vw] translate-y-full pt-5 pb-2.5 rounded-2.5 shadow-cardLg bg-white dark:bg-[#504F54]"
                    >
                      <div class="text-xs leading-normal tracking-0.06 font-light uppercase px-5 mb-2.5 dark:text-[#D1D2D3]">
                        Create new
                      </div>
                      <div class="relative grid grid-cols-1">
                        {createNewOptions.value.map((e, index) => {
                          return e.href ? (
                            <BCMSLink
                              key={index}
                              href={e.href}
                              class="flex items-center px-5 py-3.5 transition-colors duration-300 hover:text-green hover:bg-light dark:text-[#D1D2D3] dark:hover:text-yellow dark:hover:bg-[#38373C]"
                            >
                              <BCMSIcon
                                src={e.icon}
                                class="w-6 h-6 fill-current mr-3.5"
                              />
                              <span class="leading-tight -tracking-0.01">
                                {e.label}
                              </span>
                            </BCMSLink>
                          ) : (
                            <button
                              class="flex items-center justify-between px-5 py-3.5 transition-colors duration-300 hover:text-green hover:bg-light dark:text-[#D1D2D3] dark:hover:text-yellow dark:hover:bg-[#38373C]"
                              onClick={e.onClick}
                            >
                              <div class="flex items-center">
                                <BCMSIcon
                                  src={e.icon}
                                  class="w-6 h-6 fill-current mr-3.5"
                                />
                                <span class="leading-tight -tracking-0.01">
                                  {e.label}
                                </span>
                              </div>
                              <BCMSIcon
                                src="/chevron/right"
                                class="w-4 h-4 fill-current"
                              />
                            </button>
                          );
                        })}
                        <Transition name="fade">
                          {showEntriesDropdown.value && (
                            <div
                              v-clickOutside={() => {
                                showEntriesDropdown.value = false;
                              }}
                              ref={entriesDropdownDOM}
                              class="absolute w-[320px] max-w-[100vw] translate-x-full translate-y-full pt-5 pb-2.5 rounded-2.5 shadow-cardLg bg-white dark:bg-[#504F54]"
                              style="right: -8px; bottom: 80px"
                            >
                              <div class="text-xs leading-normal tracking-0.06 font-light uppercase px-5 mb-2.5 dark:text-[#D1D2D3]">
                                Select template
                              </div>
                              <div class="grid grid-cols-1">
                                <BCMSLink
                                  href="/"
                                  class="flex items-center px-5 py-3.5 transition-colors duration-300 hover:text-green hover:bg-light dark:text-[#D1D2D3] dark:hover:text-yellow dark:hover:bg-[#38373C]"
                                >
                                  <span class="leading-tight -tracking-0.01">
                                    Blog
                                  </span>
                                </BCMSLink>
                                <BCMSLink
                                  href="/"
                                  class="flex items-center px-5 py-3.5 transition-colors duration-300 hover:text-green hover:bg-light dark:text-[#D1D2D3] dark:hover:text-yellow dark:hover:bg-[#38373C]"
                                >
                                  <span class="leading-tight -tracking-0.01">
                                    Case study
                                  </span>
                                </BCMSLink>
                              </div>
                            </div>
                          )}
                        </Transition>
                      </div>
                    </div>
                  )}
                </Transition>
              </div>
            </div>
          </div>
          <button
            class="flex items-center border border-grey/50 px-3.5 py-[11px] rounded-2.5 bg-white/50 w-[445px] max-w-full mb-20 dark:bg-darkGrey dark:text-light"
            onClick={() => window.bcms.globalSearch.show()}
          >
            <BCMSIcon src="/search" class="w-5 h-5 fill-current mr-2.5" />
            <span class=" leading-tight tracking-[-0.01em] text-left flex-1 mt-0.5">
              Search
            </span>
            <div class="flex items-center space-x-1 px-[7px] py-1.5 rounded-[5px] bg-[#F0F0F0] dark:text-dark dark:bg-grey">
              <BCMSIcon src="/command" class="w-3.5 h-3.5 fill-current" />
              <BCMSIcon src="/plus" class="w-3.5 h-3.5 fill-current" />
              <span class="text-sm leading-none tracking-[-0.01em] mt-0.5">
                K
              </span>
            </div>
          </button>
          <div class="mb-17.5">
            <h2 class="text-[28px] leading-tight tracking-[-0.01em] mb-10 dark:text-light">
              Your stats
            </h2>
            <div class="grid grid-cols-1 gap-5 desktop:grid-cols-[repeat(3,minmax(200px,1fr))] desktop:max-w-max">
              <div class="flex flex-col items-center justify-center text-center border border-dotted border-green px-3 py-14 rounded-[40px] bg-light dark:border-yellow dark:text-light dark:bg-darkGrey">
                <div class="text-[50px] leading-none tracking-[-0.02em] mb-4">
                  79
                </div>
                <div class="leading-tight tracking-[-0.01em]">
                  Entries created
                </div>
              </div>
              <div class="flex flex-col items-center justify-center text-center border border-dotted border-green px-3 py-14 rounded-[40px] bg-light dark:border-yellow dark:text-light dark:bg-darkGrey">
                <div class="text-[50px] leading-none tracking-[-0.02em] mb-4">
                  268
                </div>
                <div class="leading-tight tracking-[-0.01em]">
                  Megabytes uploaded
                </div>
              </div>
              <div class="flex flex-col items-center justify-center text-center border border-dotted border-green px-3 py-14 rounded-[40px] bg-light dark:border-yellow dark:text-light dark:bg-darkGrey">
                <div class="text-[50px] leading-none tracking-[-0.02em] mb-4">
                  24
                </div>
                <div class="leading-tight tracking-[-0.01em]">Members</div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 gap-10 mb-17.5 xl:grid-cols-2 xl:gap-14">
            <div>
              <h2 class="text-[28px] leading-tight tracking-[-0.01em] mb-10 dark:text-light">
                7-days activity
              </h2>
              {activity.value ? (
                <div class="grid grid-cols-1 gap-3.5">
                  <div class="flex items-center leading-tight tracking-[-0.01em] pb-3.5 border-b border-grey dark:text-light dark:border-grey/50">
                    <span class="truncate mr-3.5">
                      <u>Olivia</u>{' '}
                      <span class="text-yellow font-medium">edited</span> the{' '}
                      <BCMSLink href="/" class="underline">
                        About Us entry
                      </BCMSLink>
                    </span>
                    <span class="font-light text-grey flex-shrink-0">
                      5min ago
                    </span>
                  </div>
                  <div class="flex items-center leading-tight tracking-[-0.01em] pb-3.5 border-b border-grey dark:text-light dark:border-grey/50">
                    <span class="truncate mr-3.5">
                      <u>Benjamin</u>{' '}
                      <span class="text-green font-medium">created</span> a new
                      widget named{' '}
                      <BCMSLink href="/" class="underline">
                        Recent Posts
                      </BCMSLink>
                    </span>
                    <span class="font-light text-grey flex-shrink-0">
                      18min ago
                    </span>
                  </div>
                  <div class="flex items-center leading-tight tracking-[-0.01em] pb-3.5 border-b border-grey dark:text-light dark:border-grey/50">
                    <span class="truncate mr-3.5">
                      <u>Emma</u>{' '}
                      <span class="text-red font-medium">deleted</span>{' '}
                      <u>homepage.jpg</u>
                    </span>
                    <span class="font-light text-grey flex-shrink-0">
                      1h ago
                    </span>
                  </div>
                </div>
              ) : (
                <div>
                  <div class="leading-tight tracking-[-0.01em] mb-8 dark:text-light">
                    You don’t have any activity for past 7 days
                  </div>
                </div>
              )}
            </div>
            <div>
              <div class="flex items-center justify-between mb-10">
                <h2 class="text-[28px] leading-tight tracking-[-0.01em] dark:text-light">
                  Recently uploaded
                </h2>
                {uploads.length > 0 && (
                  <BCMSLink
                    href="/dashboard/media"
                    class="leading-tight tracking-[-0.01em] text-green hover:underline dark:text-yellow"
                  >
                    See all files
                  </BCMSLink>
                )}
              </div>
              {uploads.length > 0 ? (
                <div class="grid grid-cols-5 gap-2.5">
                  {Array(15)
                    .fill('')
                    .map((_, index) => {
                      return (
                        <img
                          key={index}
                          src="/assets/empty-state-illustrations/404.png"
                          alt="Uploaded image"
                          class="p-0.5 aspect-square"
                        />
                      );
                    })}
                </div>
              ) : (
                <div>
                  <BCMSButton href="/dashboard/media" class="mb-6">
                    Upload files
                  </BCMSButton>
                  <div class="leading-tight tracking-[-0.01em] mb-8 dark:text-light">
                    You don’t have any recent uploads
                  </div>
                  <div class="flex flex-col items-center text-center border border-dotted border-green py-10 rounded-3.5 w-[400px] max-w-full dark:border-yellow">
                    <div class="leading-normal font-medium -tracking-0.01 text-grey mb-2.5 dark:text-light">
                      Drop files here to upload or
                    </div>
                    <BCMSButton class="mb-5">
                      Select files from computer
                    </BCMSButton>
                    <div class="leading-normal -tracking-0.01 text-grey dark:text-light">
                      Maximum file size 100mb
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div class="mb-17.5">
            <div class="flex flex-col gap-5 justify-between mb-10 desktop:flex-row desktop:items-center desktop:gap-6">
              <div class="flex items-center">
                <h2 class="text-[28px] leading-tight tracking-[-0.01em] mr-6 dark:text-light">
                  Manage members
                </h2>
                {members.length > 0 && (
                  <BCMSButton href="https://cloud.thebcms.com/dashboard" newTab>
                    Invite a member
                  </BCMSButton>
                )}
              </div>
              {members.length > 0 && (
                <BCMSLink
                  href="/dashboard/settings"
                  class="leading-tight tracking-[-0.01em] text-green hover:underline dark:text-yellow"
                >
                  See all members
                </BCMSLink>
              )}
            </div>
            {members.length > 0 ? (
              <div class="grid grid-cols-1 gap-6 desktop:grid-cols-2">
                {Array(5)
                  .fill('')
                  .map((_, index) => {
                    return (
                      <div
                        key={index}
                        class="flex items-center justify-between border border-grey/50 rounded-lg px-[14px] py-4 dark:bg-darkGrey"
                      >
                        <div class="flex items-center">
                          <img
                            src="/assets/gradients/gradient-1.jpg"
                            alt="Avatar"
                            class="w-10 h-10 rounded-full object-cover border-[3px] border-pink mr-2.5"
                          />
                          <span class="leading-tight tracking-[-0.01em] dark:text-light">
                            Momcilo Popov
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
                  You don't have any active users now
                </div>
                <BCMSButton href="https://cloud.thebcms.com/dashboard" newTab>
                  Invite people
                </BCMSButton>
              </div>
            )}
          </div>
          <div class="mb-17.5">
            <h2 class="text-[28px] leading-tight tracking-[-0.01em] mb-10 dark:text-light">
              Docs and resources
            </h2>
            <div class="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5">
              <BCMSLink
                href="https://docs.thebcms.com/"
                newTab
                class="flex items-center px-5 py-[19px] shadow-input rounded-3xl transition-shadow duration-300 hover:shadow-inputHover dark:bg-darkGrey dark:border dark:border-grey/50 dark:text-light"
              >
                <BCMSIcon
                  src="/documentation"
                  class="w-7.5 h-7.5 stroke-current mr-4"
                />
                <span class="leading-tight tracking-[-0.01em]">
                  Documentation
                </span>
              </BCMSLink>
              <BCMSLink
                href="https://docs.thebcms.com/"
                newTab
                class="flex items-center px-5 py-[19px] shadow-input rounded-3xl transition-shadow duration-300 hover:shadow-inputHover dark:bg-darkGrey dark:border dark:border-grey/50 dark:text-light"
              >
                <BCMSIcon
                  src="/tutorials"
                  class="w-7.5 h-7.5 stroke-current mr-4"
                />
                <span class="leading-tight tracking-[-0.01em]">Tutorials</span>
              </BCMSLink>
              <BCMSLink
                href="https://docs.thebcms.com/"
                newTab
                class="flex items-center px-5 py-[19px] shadow-input rounded-3xl transition-shadow duration-300 hover:shadow-inputHover dark:bg-darkGrey dark:border dark:border-grey/50 dark:text-light"
              >
                <BCMSIcon
                  src="/code-starters"
                  class="w-7.5 h-7.5 stroke-current mr-4"
                />
                <span class="leading-tight tracking-[-0.01em]">
                  Code starters
                </span>
              </BCMSLink>
            </div>
          </div>
          <div class="mb-17.5">
            <h2 class="text-[28px] leading-tight tracking-[-0.01em] mb-10 dark:text-light">
              Support and community
            </h2>
            <div class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-5">
              <BCMSLink
                href="https://thebcms.com/slack"
                newTab
                class="flex items-center px-5 py-[19px] shadow-input rounded-3xl transition-shadow duration-300 hover:shadow-inputHover dark:bg-darkGrey dark:border dark:border-grey/50 dark:text-light"
              >
                <BCMSIcon src="/slack" class="w-7.5 h-7.5 mr-4" />
                <span class="leading-tight tracking-[-0.01em]">Slack</span>
              </BCMSLink>
              <BCMSLink
                href="https://www.reddit.com/r/thebcms"
                newTab
                class="flex items-center px-5 py-[19px] shadow-input rounded-3xl transition-shadow duration-300 hover:shadow-inputHover dark:bg-darkGrey dark:border dark:border-grey/50 dark:text-light"
              >
                <BCMSIcon src="/reddit" class="w-7.5 h-7.5 mr-4" />
                <span class="leading-tight tracking-[-0.01em]">Reddit</span>
              </BCMSLink>
              <BCMSLink
                href="https://twitter.com/thebcms"
                newTab
                class="flex items-center px-5 py-[19px] shadow-input rounded-3xl transition-shadow duration-300 hover:shadow-inputHover dark:bg-darkGrey dark:border dark:border-grey/50 dark:text-light"
              >
                <BCMSIcon src="/twitter" class="w-7.5 h-7.5 mr-4" />
                <span class="leading-tight tracking-[-0.01em]">Twitter</span>
              </BCMSLink>
              <BCMSLink
                href="https://www.linkedin.com/company/thebcms/"
                newTab
                class="flex items-center px-5 py-[19px] shadow-input rounded-3xl transition-shadow duration-300 hover:shadow-inputHover dark:bg-darkGrey dark:border dark:border-grey/50 dark:text-light"
              >
                <BCMSIcon src="/linkedin" class="w-7.5 h-7.5 mr-4" />
                <span class="leading-tight tracking-[-0.01em]">Linkedin</span>
              </BCMSLink>
              <BCMSLink
                href="https://thebcms.com/contact"
                newTab
                class="flex items-center px-5 py-[19px] shadow-input rounded-3xl transition-shadow duration-300 hover:shadow-inputHover dark:bg-darkGrey dark:border dark:border-grey/50 dark:text-light"
              >
                <BCMSIcon
                  src="/phone"
                  class="w-7.5 h-7.5 stroke-current mr-4"
                />
                <span class="leading-tight tracking-[-0.01em]">Contact</span>
              </BCMSLink>
            </div>
          </div>
        </div>
      );
    };
  },
});

export default component;
