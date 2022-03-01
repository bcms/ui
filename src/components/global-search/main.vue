<script lang="tsx">
import { gsap } from 'gsap';
import { ExpoScaleEase } from 'gsap/EasePack';
import {
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from '@vue/runtime-core';
import { Transition } from '@vue/runtime-dom';
import BCMSGlobalSearchList from './list.vue';
import BCMSIcon from '../icon.vue';
import { BCMSGlobalSearchItem } from '../../types';
import { BCMSSearchResultType } from '@becomes/cms-sdk/types';
import { useI18n } from 'vue-i18n';

gsap.registerPlugin(ExpoScaleEase);

const component = defineComponent({
  setup() {
    const { t: i18n } = useI18n();
    const show = ref(false);
    const list = ref<HTMLUListElement | null>(null);
    const searchInput = ref<HTMLInputElement | null>(null);
    const searchValue = ref('');
    const searchResults = ref<BCMSGlobalSearchItem[]>([]);
    let timeout: any;

    function handleShowShortcut(event: KeyboardEvent) {
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        show.value = true;

        document.addEventListener('keydown', handleArrowsNavigation);

        nextTick(() => {
          if (searchInput.value) {
            searchInput.value.focus();
          }
        });
      }
    }

    function handleArrowsNavigation(event: KeyboardEvent) {
      const resultItems = Array.from(
        document.querySelectorAll('.globalSearch--result-item a')
      ) as HTMLAnchorElement[];

      if (list.value && show.value) {
        const dropDown = {
          root: list.value,
          active: list.value.querySelector(
            '.globalSearch--result-item a:focus'
          ) as HTMLAnchorElement,
          firstItem: resultItems[0] as HTMLAnchorElement,
          lastItem: resultItems[resultItems.length - 1] as HTMLAnchorElement,
        };

        const activeIndex = resultItems.indexOf(dropDown.active);

        switch (event.key) {
          case 'Escape': // 'ESC' - Hide
            event.preventDefault();
            hide();
            break;

          case 'ArrowUp': // 'ARROW UP' - Navigate up
            if (Object.keys(searchResults.value).length) {
              event.preventDefault();

              if (!dropDown.active || activeIndex === 0 || activeIndex === -1) {
                dropDown.lastItem.focus();
              } else {
                resultItems[activeIndex - 1].focus();
              }
            }
            break;

          case 'ArrowDown': // 'ARROW DOWN' - Navigate down
            if (Object.keys(searchResults.value).length > 0) {
              event.preventDefault();
              if (!dropDown.active || activeIndex === resultItems.length - 1) {
                dropDown.firstItem.focus();
              } else {
                resultItems[activeIndex + 1].focus();
              }
            }
            break;

          default:
            break;
        }
      }
    }

    function hide() {
      show.value = false;
      searchValue.value = '';
      searchResults.value = [];
      document.removeEventListener('keydown', handleArrowsNavigation);
    }
    async function search() {
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        await window.bcms.util.throwable(
          async () => {
            const searchItems = await window.bcms.sdk.search.global(
              searchValue.value
            );
            const toFetch: {
              [type: string]: {
                [id: string]: string[];
              };
            } = {};
            for (let i = 0; i < searchItems.length; i++) {
              const result = searchItems[i];
              if (!toFetch[result.type]) {
                toFetch[result.type] = {};
              }
              if (result.type == 'entry') {
                const templateId = result.templateId as string;
                if (!toFetch[result.type][templateId]) {
                  toFetch[result.type][templateId] = [];
                }
                toFetch[result.type][templateId].push(result.id);
              } else {
                toFetch[result.type][result.id] = [];
              }
            }
            const result: BCMSGlobalSearchItem[] = [];
            for (const _type in toFetch) {
              const type = _type as BCMSSearchResultType;
              switch (type) {
                case 'entry':
                  {
                    for (const templateId in toFetch[type]) {
                      const items = await window.bcms.sdk.entry.getAllLite({
                        templateId,
                      });
                      const template = await window.bcms.sdk.template.get(
                        templateId
                      );
                      for (let i = 0; i < items.length; i++) {
                        const item = items[i];
                        result.push({
                          label: (item.meta[0].props[0].data as string[])[0],
                          url: `/dashboard/t/${template.cid}/e/${item.cid}`,
                          kind: 'Entry',
                        });
                      }
                    }
                  }
                  break;
                case 'group':
                  {
                    const items = await window.bcms.sdk.group.getMany(
                      Object.keys(toFetch[type])
                    );
                    for (let i = 0; i < items.length; i++) {
                      const item = items[i];
                      result.push({
                        label: item.label,
                        url: `/dashboard/g/${item.cid}`,
                        kind: 'Group',
                      });
                    }
                  }
                  break;
                case 'widget':
                  {
                    const items = await window.bcms.sdk.widget.getMany(
                      Object.keys(toFetch[type])
                    );
                    for (let i = 0; i < items.length; i++) {
                      const item = items[i];
                      result.push({
                        label: item.label,
                        url: `/dashboard/w/${item.cid}`,
                        kind: 'Widget',
                      });
                    }
                  }
                  break;
                case 'template':
                  {
                    const items = await window.bcms.sdk.template.getMany(
                      Object.keys(toFetch[type])
                    );
                    for (let i = 0; i < items.length; i++) {
                      const item = items[i];
                      result.push({
                        label: item.label,
                        url: `/dashboard/t/${item.cid}`,
                        kind: 'Template',
                      });
                    }
                  }
                  break;
                case 'media':
                  {
                    const items = await window.bcms.sdk.media.getMany(
                      Object.keys(toFetch[type])
                    );
                    for (let i = 0; i < items.length; i++) {
                      const item = items[i];
                      const path = window.bcms.media.getPath({
                        allMedia: await window.bcms.sdk.media.getAll(),
                        target: item,
                      });
                      result.push({
                        label:
                          path.length === 1
                            ? path[0]
                            : `<span class="bcmsFilePath">${path
                                .slice(0, path.length - 1)
                                .join('/')}/</span>${path[path.length - 1]}`,
                        url: `/dashboard/media?search=${item._id}`,
                        kind: 'Media',
                      });
                    }
                  }
                  break;
                case 'user':
                  {
                    for (const userId in toFetch[type]) {
                      const item = await window.bcms.sdk.user.get(userId);
                      result.push({
                        label: item.username,
                        url: `/dashboard/u/${item._id}`,
                        kind: 'User',
                      });
                    }
                  }
                  break;
                // TODO: Add when tag page has been created.
                case 'tag':
                  {
                    const items = await window.bcms.sdk.tag.getMany(
                      Object.keys(toFetch[type])
                    );
                    for (let i = 0; i < items.length; i++) {
                      const item = items[i];
                      result.push({
                        label: item.value,
                        url: `/dashboard/tag/${item.cid}`,
                        kind: 'Tag',
                      });
                    }
                  }
                  break;
                // TODO: Add when color page has been created.
                case 'color':
                  {
                    const items = await window.bcms.sdk.color.getMany(
                      Object.keys(toFetch[type])
                    );
                    for (let i = 0; i < items.length; i++) {
                      const item = items[i];
                      result.push({
                        label: item.label,
                        url: `/dashboard/col/${item.cid}`,
                        kind: 'Color',
                      });
                    }
                  }
                  break;
                case 'apiKey':
                  {
                    for (const apiKeyId in toFetch[type]) {
                      const item = await window.bcms.sdk.apiKey.get(apiKeyId);
                      result.push({
                        label: item.name,
                        url: `/dashboard/key-manager/${item._id}`,
                        kind: 'API Key',
                      });
                    }
                  }
                  break;
              }
            }
            return result;
          },
          async (result) => {
            searchResults.value = result;
          }
        );
      }, 200);
    }

    watch(searchResults.value, (newValue) => {
      let newHeight = newValue.length * 52;

      const usersInSearchResults = searchResults.value.filter(
        (e) => e.kind === 'User'
      );

      if (usersInSearchResults && usersInSearchResults.length > 0) {
        newHeight += 48 + 12 + 10;
      }

      gsap.to(list.value, {
        height: newHeight,
        ease: 'ExpoScaleEase.config(0.9, 3, Power2.easeInOut)',
        duration: 0.2,
      });
    });

    onMounted(async () => {
      document.addEventListener('keydown', handleShowShortcut);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('keydown', handleShowShortcut);
    });

    return () => {
      return (
        <Transition name="fade">
          {show.value ? (
            <div class="fixed z-[1000000] top-0 left-0 w-full h-full flex justify-center pt-[10vh] items-start">
              <div class=" relative z-10 flex flex-col bg-white w-[700px] max-w-[90vw] max-h-[80vh] rounded-2.5 pt-7.5 overflow-hidden">
                <div
                  class={`flex items-center mx-10 mb-6 border-b border-dark transition-colors duration-300 hover:border-green focus-within:border-green`}
                >
                  <BCMSIcon src="/search" class="w-5 h-5 fill-current" />
                  <input
                    ref={searchInput}
                    v-model={searchValue.value}
                    onKeyup={search}
                    placeholder={i18n(
                      'modal.globalSearch.input.value.placeholder'
                    )}
                    class="px-2.5 py-3 flex-1 leading-tight -tracking-0.01 bg-transparent focus:outline-none"
                  />
                </div>
                <BCMSGlobalSearchList
                  results={searchResults.value}
                  list={list}
                  onHide={() => hide()}
                />
              </div>
              <div
                class="absolute top-0 left-0 w-full h-full bg-dark bg-opacity-30 cursor-pointer"
                tabindex="0"
                onClick={() => hide()}
              />
            </div>
          ) : (
            ''
          )}
        </Transition>
      );
    };
  },
});
export default component;
</script>
