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
        label: translations.value.page.home.newOptions.template,
        icon: '/administration/template',
        href: '/dashboard/t',
      },
      {
        label: translations.value.page.home.newOptions.widget,
        icon: '/administration/widget',
        href: '/dashboard/w',
      },
      {
        label: translations.value.page.home.newOptions.group,
        icon: '/administration/group',
        href: '/dashboard/g',
      },
      {
        label: translations.value.page.home.newOptions.fileUpload,
        icon: '/administration/media',
        href: '/dashboard/media',
      },
      {
        label: translations.value.page.home.newOptions.entry.label,
        icon: '/file',
        onClick() {
          showEntriesDropdown.value = !showEntriesDropdown.value;
        },
      },
    ]);

    const docsAndResources = ref([
      {
        label: translations.value.page.home.docsAndResources.documentation,
        icon: '/documentation',
        href: 'https://docs.thebcms.com/',
      },
      {
        label: translations.value.page.home.docsAndResources.tutorials,
        icon: '/tutorials',
        href: 'https://docs.thebcms.com/',
      },
      {
        label: translations.value.page.home.docsAndResources.codeStarters,
        icon: '/code-starters',
        href: 'https://docs.thebcms.com/',
      },
    ]);

    const supportAndCommunity = ref([
      {
        label: 'Slack',
        icon: '/slack',
        href: 'https://thebcms.com/slack',
      },
      {
        label: 'Reddit',
        icon: '/reddit',
        href: 'https://www.reddit.com/r/thebcms',
      },
      {
        label: 'Twitter',
        icon: '/twitter',
        href: 'https://twitter.com/thebcms',
      },
      {
        label: 'Linkedin',
        icon: '/linkedin',
        href: 'https://www.linkedin.com/company/thebcms/',
      },
      {
        label: translations.value.page.home.supportAndCommunity.contact,
        icon: '/phone',
        href: 'https://thebcms.com/contact',
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

    watch(showCreateNewDropdown, (newVal) => {
      if (newVal) {
        showEntriesDropdown.value = false;
      }
    });

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
                  {translations.value.page.home.greeting.title('Mark')}
                </div>
                <div class="leading-tight font-light tracking-[-0.01em] dark:text-light">
                  {translations.value.page.home.greeting.wish}
                </div>
              </div>
              <div class="relative">
                <BCMSButton
                  onClick={() => {
                    showCreateNewDropdown.value = !showCreateNewDropdown.value;
                  }}
                >
                  <span class="flex items-center">
                    <span class="mr-1">
                      {translations.value.page.home.newOptions.title}
                    </span>
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
                        {translations.value.page.home.newOptions.title}
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
                                {
                                  translations.value.page.home.newOptions.entry
                                    .dropdown.title
                                }
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
              {translations.value.page.home.search}
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
              {translations.value.page.home.stats.title}
            </h2>
            <div class="grid grid-cols-1 gap-5 desktop:grid-cols-[repeat(3,minmax(200px,1fr))] desktop:max-w-max">
              <div class="flex flex-col items-center justify-center text-center border border-dotted border-green px-3 py-14 rounded-[40px] bg-light dark:border-yellow dark:text-light dark:bg-darkGrey">
                <div class="text-[50px] leading-none tracking-[-0.02em] mb-4">
                  79
                </div>
                <div class="leading-tight tracking-[-0.01em]">
                  {translations.value.page.home.stats.entries}
                </div>
              </div>
              <div class="flex flex-col items-center justify-center text-center border border-dotted border-green px-3 py-14 rounded-[40px] bg-light dark:border-yellow dark:text-light dark:bg-darkGrey">
                <div class="text-[50px] leading-none tracking-[-0.02em] mb-4">
                  268
                </div>
                <div class="leading-tight tracking-[-0.01em]">
                  {translations.value.page.home.stats.uploads}
                </div>
              </div>
              <div class="flex flex-col items-center justify-center text-center border border-dotted border-green px-3 py-14 rounded-[40px] bg-light dark:border-yellow dark:text-light dark:bg-darkGrey">
                <div class="text-[50px] leading-none tracking-[-0.02em] mb-4">
                  24
                </div>
                <div class="leading-tight tracking-[-0.01em]">
                  {translations.value.page.home.stats.members}
                </div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 gap-10 mb-17.5 xl:grid-cols-2 xl:gap-14">
            <div>
              <h2 class="text-[28px] leading-tight tracking-[-0.01em] mb-10 dark:text-light">
                {translations.value.page.home.activity.title}
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
                    {translations.value.page.home.activity.noRecentActivity}
                  </div>
                </div>
              )}
            </div>
            <div>
              <div class="flex items-center justify-between mb-10">
                <h2 class="text-[28px] leading-tight tracking-[-0.01em] dark:text-light">
                  {translations.value.page.home.uploads.title}
                </h2>
                {uploads.length > 0 && (
                  <BCMSLink
                    href="/dashboard/media"
                    class="leading-tight tracking-[-0.01em] text-green hover:underline dark:text-yellow"
                  >
                    {translations.value.page.home.uploads.seeAll}
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
                    {translations.value.page.home.uploads.cta}
                  </BCMSButton>
                  <div class="leading-tight tracking-[-0.01em] mb-8 dark:text-light">
                    {translations.value.page.home.uploads.noRecentUploads}
                  </div>
                  <div class="flex flex-col items-center text-center border border-dotted border-green py-10 rounded-3.5 w-[400px] max-w-full dark:border-yellow">
                    <div class="leading-normal font-medium -tracking-0.01 text-grey mb-2.5 dark:text-light">
                      {translations.value.page.home.uploads.dropzone.drop}
                    </div>
                    <BCMSButton class="mb-5">
                      {translations.value.page.home.uploads.dropzone.select}
                    </BCMSButton>
                    <div class="leading-normal -tracking-0.01 text-grey dark:text-light">
                      {translations.value.page.home.uploads.dropzone.fileSize}
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
                  {translations.value.page.home.members.title}
                </h2>
                {members.length > 0 && (
                  <BCMSButton href="https://cloud.thebcms.com/dashboard" newTab>
                    {translations.value.page.home.members.invite}
                  </BCMSButton>
                )}
              </div>
              {members.length > 0 && (
                <BCMSLink
                  href="/dashboard/settings"
                  class="leading-tight tracking-[-0.01em] text-green hover:underline dark:text-yellow"
                >
                  {translations.value.page.home.members.seeAll}
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
                  {translations.value.page.home.members.noUsers}
                </div>
                <BCMSButton href="https://cloud.thebcms.com/dashboard" newTab>
                  {translations.value.page.home.members.invite}
                </BCMSButton>
              </div>
            )}
          </div>
          <div class="mb-17.5">
            <h2 class="text-[28px] leading-tight tracking-[-0.01em] mb-10 dark:text-light">
              {translations.value.page.home.docsAndResources.title}
            </h2>
            <div class="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5">
              {docsAndResources.value.map((item, index) => {
                return (
                  <BCMSLink
                    key={index}
                    href={item.href}
                    newTab
                    class="flex items-center px-5 py-[19px] shadow-input rounded-3xl transition-shadow duration-300 hover:shadow-inputHover dark:bg-darkGrey dark:border dark:border-grey/50 dark:text-light"
                  >
                    <BCMSIcon
                      src={item.icon}
                      class="w-7.5 h-7.5 stroke-current mr-4"
                    />
                    <span class="leading-tight tracking-[-0.01em]">
                      {item.label}
                    </span>
                  </BCMSLink>
                );
              })}
            </div>
          </div>
          <div class="mb-17.5">
            <h2 class="text-[28px] leading-tight tracking-[-0.01em] mb-10 dark:text-light">
              {translations.value.page.home.supportAndCommunity.title}
            </h2>
            <div class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-5">
              {supportAndCommunity.value.map((item, index) => {
                return (
                  <BCMSLink
                    key={index}
                    href={item.href}
                    newTab
                    class="flex items-center px-5 py-[19px] shadow-input rounded-3xl transition-shadow duration-300 hover:shadow-inputHover dark:bg-darkGrey dark:border dark:border-grey/50 dark:text-light"
                  >
                    <BCMSIcon
                      src={item.icon}
                      class={`w-7.5 h-7.5  mr-4 ${
                        item.label === 'Contact' ? 'stroke-current' : ''
                      }`}
                    />
                    <span class="leading-tight tracking-[-0.01em]">
                      {item.label}
                    </span>
                  </BCMSLink>
                );
              })}
            </div>
          </div>
        </div>
      );
    };
  },
});

export default component;
