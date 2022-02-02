<script lang="tsx">
import { BCMSJwtRoleName, BCMSLanguage } from '@becomes/cms-sdk/types';
import * as uuid from 'uuid';
import { computed, defineComponent, nextTick, onMounted, ref } from 'vue';
import { BCMSIcon } from '..';
import { LanguageService } from '../../services';
import { BCMSSelect } from '../input';
import { DefaultComponentProps } from '../_default';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
  },
  setup() {
    const store = window.bcms.vue.store;
    const userMe = computed(() => store.getters.user_me);
    const isAdmin = computed(() => {
      return userMe.value?.roles[0].name === BCMSJwtRoleName.ADMIN;
    });

    const isDropdownVisible = ref(false);
    const languagesDropdownData = ref({
      x: 0,
      y: 0,
      id: uuid.v4(),
    });
    const languagesDropdownDataEl = ref<HTMLElement | null>(null);
    const languageCode = ref({
      label: '',
      value: '',
      error: '',
    });
    const langs = computed(() => {
      return store.getters.language_items;
    });

    async function removeLanguage(lang: BCMSLanguage) {
      if (
        await window.bcms.confirm(
          'Delete Language',
          `Are you sure you want to delete <img class="w-6 h-6 mx-1 inline-block" src="/assets/flags/${lang.code}.jpg" /> language?`
        )
      ) {
        await window.bcms.util.throwable(
          async () => {
            await window.bcms.sdk.language.deleteById(lang._id);
          },
          async () => {
            window.bcms.notification.success(`Language successfully removed.`);
          }
        );
      }
    }

    function checkForDropdownOverflow() {
      nextTick(() => {
        const el = languagesDropdownDataEl.value;

        if (el) {
          const rect = el.getBoundingClientRect();

          const xDiff = rect.right - window.innerWidth;
          const yDiff = rect.bottom - window.innerHeight;

          if (xDiff > 5) {
            languagesDropdownData.value.x = xDiff + 10;
          }
          if (yDiff > 5) {
            languagesDropdownData.value.y = yDiff + 10;
          }
        }
      });
    }

    async function addLanguage() {
      if (languageCode.value.value === '') {
        languageCode.value.error = 'Please select a language to add.';
        return;
      }
      languageCode.value.error = '';
      const isoLanguage = LanguageService.get(languageCode.value.value);
      if (isoLanguage) {
        await window.bcms.util.throwable(
          async () => {
            return await window.bcms.sdk.language.create(isoLanguage);
          },
          async (value) => {
            languageCode.value = {
              label: '',
              value: '',
              error: '',
            };
            window.bcms.notification.success(
              `"${value.name}" language successfully added.`
            );
          }
        );
        isDropdownVisible.value = false;
      }
    }

    onMounted(async () => {
      await window.bcms.util.throwable(async () => {
        await window.bcms.sdk.language.getAll();
      });
    });

    return () => (
      <div class="relative z-10">
        <h2 class="text-[28px] leading-none font-normal -tracking-0.01 mb-5">
          Languages
        </h2>
        <p class="-tracking-0.01 leading-tight text-grey mb-7.5">
          Add languages that will be available for entries
        </p>
        <ul class="list-none grid gap-x-5 gap-y-7.5 grid-cols-[repeat(auto-fill,minmax(120px,1fr))]">
          {langs.value.map((lang) => (
            <li
              v-cy={`item-${lang.code}`}
              class="p-5 bg-white rounded-3.5 shadow-input relative transition-shadow duration-300 text-center flex flex-col justify-center items-center hover:shadow-inputHover"
            >
              <img
                src={`/assets/flags/${lang.code}.jpg`}
                class="w-6 h-6 mb-2.5"
                alt={lang.name}
              />
              <h4 class="text-xs leading-normal uppercase tracking-0.06 text-dark font-normal">
                {lang.name}
              </h4>
              {langs.value.length !== 1 && !lang.def && isAdmin.value && (
                <button
                  v-cy={`remove-${lang.code}`}
                  onClick={() => {
                    removeLanguage(lang);
                  }}
                  class="group absolute top-[5px] right-[5px] flex"
                >
                  <BCMSIcon
                    src="/close"
                    class="w-6 h-auto text-grey fill-current transition-colors duration-300 group-hover:text-red group-focus-visible:text-red"
                  />
                </button>
              )}
            </li>
          ))}
          {isAdmin.value && (
            <li class="relative bg-white rounded-3xl shadow-input transition-shadow duration-300 text-center flex flex-col justify-end items-center hover:shadow-inputHover">
              <button
                v-cy="add"
                onClick={() => {
                  isDropdownVisible.value = !isDropdownVisible.value;
                  if (isDropdownVisible.value) {
                    languagesDropdownData.value.x = 0;
                    languagesDropdownData.value.y = 0;
                    checkForDropdownOverflow();
                  }
                }}
                class="group p-5 flex flex-col items-center w-full"
              >
                <span class="rounded-full mb-2.5 pointer-events-none">
                  <BCMSIcon
                    src="/plus"
                    class="w-6 h-auto text-grey fill-current transition-colors duration-300 group-hover:text-green group-focus-visible:text-green"
                  />
                </span>
                <span class="text-xs leading-normal uppercase tracking-0.06 text-dark font-normal pointer-events-none">
                  Add
                </span>
              </button>
              {isDropdownVisible.value && (
                <div
                  v-cy="lang-list"
                  v-clickOutside={() => {
                    isDropdownVisible.value = false;
                  }}
                  ref={languagesDropdownDataEl}
                  id={languagesDropdownData.value.id}
                  class="absolute -bottom-2.5 left-0 w-[320px] text-left shadow-cardLg rounded-2.5 bg-white p-5"
                  style={`transform: translate(${-languagesDropdownData.value
                    .x}px, calc(100% + ${-languagesDropdownData.value.y}px));`}
                >
                  <BCMSSelect
                    label="Language"
                    showSearch={true}
                    options={LanguageService.getAll()
                      .filter((e) => {
                        return !langs.value.find((lng) => lng.code === e.code);
                      })
                      .map((e) => {
                        return {
                          label: `${e.name} | ${e.nativeName}`,
                          value: e.code,
                          image: `/assets/flags/${e.code}.jpg`,
                        };
                      })}
                    onChange={(event) => {
                      languageCode.value.label = event.label;
                      languageCode.value.value = event.value;
                      addLanguage();
                    }}
                  />
                </div>
              )}
            </li>
          )}
        </ul>
      </div>
    );
  },
});

export default component;
</script>
