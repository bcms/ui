<script lang="tsx">
import * as uuid from 'uuid';
import { computed, defineComponent, onMounted, ref } from 'vue';
import { BCMSIcon } from '..';
import { LanguageService } from '../../services';
import { useBcmsStore } from '../../store';
import { BCMSSelect } from '../input';
import { DefaultComponentProps } from '../_default';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
  },
  setup() {
    const store = useBcmsStore();

    const isDropdownVisible = ref(false);
    const searchInput = ref('');
    const languagesDropdownData = ref({
      x: 0,
      y: 0,
      el: undefined as HTMLElement | undefined,
      id: uuid.v4(),
    });
    const languageCode = ref({
      label: '',
      value: '',
      error: '',
    });
    const langs = computed(() => {
      return store.getters.language_items;
    });

    async function removeLanguage(langId: string) {
      if (
        await window.bcms.confirm(
          'Delete Language',
          `Are you sure you want to delete this language?`
        )
      ) {
        await window.bcms.util.throwable(
          async () => {
            await window.bcms.sdk.language.deleteById(langId);
          },
          async () => {
            window.bcms.notification.success(`Language successfully removed.`);
          }
        );
      }
    }

    function checkForDropdownOverflow() {
      setTimeout(() => {
        const el = languagesDropdownData.value.el;

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
      }, 0);
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
            window.bcms.sdk.language.update({
              _id: value._id,
            });
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
        searchInput.value = '';
      }
    }

    onMounted(async () => {
      await window.bcms.util.throwable(async () => {
        await window.bcms.sdk.language.getAll();
      });
    });

    return () => (
      <div>
        <h2 class="text-[28px] leading-none font-normal -tracking-0.01 mb-5">
          Languages
        </h2>
        <p class="-tracking-0.01 leading-tight text-grey mb-[30px]">
          Add languages that will be available for entries
        </p>
        <ul class="languages--list">
          {langs.value.map((lang) => (
            <li v-cy={`item-${lang.code}`} class="languages--list-item">
              <img
                src={`/assets/flags/${lang.code}.jpg`}
                class="languages--flag"
                alt={lang.name}
              />
              <h4 class="languages--name">{lang.name}</h4>
              <button
                v-cy={`remove-${lang.code}`}
                onClick={() => {
                  removeLanguage(lang._id);
                }}
                class="languages--icon languages--icon_close"
              >
                <BCMSIcon src="/close" />
              </button>
            </li>
          ))}
          <li class="languages--list-item languages--list-item_add">
            <button
              v-cy="add"
              onClick={() => {
                isDropdownVisible.value = !isDropdownVisible.value;
                if (!isDropdownVisible.value) {
                  searchInput.value = '';
                } else {
                  languagesDropdownData.value.x = 0;
                  languagesDropdownData.value.y = 0;
                  checkForDropdownOverflow();
                  searchInput.value = '';
                }
              }}
            >
              <span class="languages--icon languages--icon_add">
                <BCMSIcon src="/plus" />
              </span>
              <span class="languages--name">Add</span>
              {isDropdownVisible.value && (
                <div
                  v-cy="lang-list"
                  v-clickOutside={() => {
                    isDropdownVisible.value = false;
                  }}
                  id={languagesDropdownData.value.id}
                  class="languages--dropdown"
                  style="transform: translate({-languagesDropdownData.x}px, {-languagesDropdownData.y}px);"
                >
                  <BCMSSelect
                    label="Language"
                    hasSearch={true}
                    options={langs.value
                      .filter((e) => {
                        return (
                          !langs.value.find((lng) => lng.code === e.code) &&
                          `${e.name} ${e.nativeName}`
                            .toLowerCase()
                            .includes(searchInput.value)
                        );
                      })
                      .map((e) => {
                        return {
                          label: `${e.name} | ${e.nativeName}`,
                          value: e.code,
                          imgUrl: `/assets/flags/${e.code}.jpg`,
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
            </button>
          </li>
        </ul>
      </div>
    );
  },
});

export default component;
</script>
