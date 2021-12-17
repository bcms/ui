<script lang="tsx">
import { BCMSMediaType } from '@becomes/cms-sdk/types';
import { gsap } from 'gsap';
import { ExpoScaleEase } from 'gsap/EasePack';
gsap.registerPlugin(ExpoScaleEase);
import {
  computed,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from '@vue/runtime-core';
import { Transition } from '@vue/runtime-dom';
import { BCMSGlobalSearchList } from '.';
import { BCMSIcon } from '..';
import { useBcmsStore } from '../../store';

export interface BCMSGlobalSearchItem {
  label: string;
  url: string;
  kind:
    | 'Template'
    | 'Group'
    | 'Widget'
    | 'Media'
    | 'API Key'
    | 'Entry'
    | 'User'
    | 'Entry';
}
const component = defineComponent({
  setup() {
    const show = ref(false);
    const store = useBcmsStore();
    const list = ref<HTMLUListElement | null>(null);
    const searchInput = ref<HTMLInputElement | null>(null);
    const searchValue = ref('');

    const entries = computed<BCMSGlobalSearchItem[]>(() =>
      store.getters.entryLite_items.map((e) => {
        return {
          label: (e.meta[0].props[0].data as string[])[0],
          url: `/dashboard/t/${
            store.getters.template_findOne((i) => i._id === e.templateId)?.cid
          }/e/${e.cid}`,
          kind: 'Entry',
        };
      })
    );
    const templates = computed<BCMSGlobalSearchItem[]>(() =>
      store.getters.template_items.map((e) => {
        return {
          label: e.label,
          url: `/dashboard/t/${e.cid}`,
          kind: 'Template',
        };
      })
    );
    const groups = computed<BCMSGlobalSearchItem[]>(() =>
      store.getters.group_items.map((e) => {
        return {
          label: e.label,
          url: `/dashboard/g/${e.cid}`,
          kind: 'Group',
        };
      })
    );
    const widgets = computed<BCMSGlobalSearchItem[]>(() =>
      store.getters.widget_items.map((e) => {
        return {
          label: e.label,
          url: `/dashboard/w/${e.cid}`,
          kind: 'Widget',
        };
      })
    );
    const media = computed<BCMSGlobalSearchItem[]>(() =>
      store.getters.media_items
        .filter((e) => e.type !== BCMSMediaType.DIR)
        .map((e) => {
          return {
            label: e.name,
            url: `/dashboard/media?search=${e._id}`,
            kind: 'Media',
          };
        })
    );
    const keys = computed<BCMSGlobalSearchItem[]>(() => {
      return store.getters.apiKey_items.map((e) => {
        return {
          label: e.name,
          url: `/dashboard/key-manager/${e._id}`,
          kind: 'API Key',
        };
      });
    });
    const users = computed<BCMSGlobalSearchItem[]>(() =>
      store.getters.user_items.map((e) => {
        return {
          label: e.username,
          url: `/dashboard/settings`,
          kind: 'User',
        };
      })
    );

    const searchResults = computed<{
      [groupName: string]: BCMSGlobalSearchItem[];
    }>(() => {
      const results: {
        [groupName: string]: BCMSGlobalSearchItem[];
      } = {};

      if (searchValue.value) {
        const searchValueLower = searchValue.value.toLowerCase();

        results['Entries'] = entries.value.filter((e) =>
          e.label.toLowerCase().includes(searchValueLower)
        );
        results['Templates'] = templates.value.filter((e) =>
          e.label.toLowerCase().includes(searchValueLower)
        );
        results['Groups'] = groups.value.filter((e) =>
          e.label.toLowerCase().includes(searchValueLower)
        );
        results['Widgets'] = widgets.value.filter((e) =>
          e.label.toLowerCase().includes(searchValueLower)
        );
        results['Media'] = media.value.filter((e) =>
          e.label.toLowerCase().includes(searchValueLower)
        );
        results['API Keys'] = keys.value.filter((e) =>
          e.label.toLowerCase().includes(searchValueLower)
        );
        results['Users'] = users.value.filter((e) =>
          e.label.toLowerCase().includes(searchValueLower)
        );
      }

      return results;
    });

    const searchResultsLength = computed(() => {
      let length = 0;

      Object.keys(searchResults.value).forEach((groupName) => {
        length += searchResults.value[groupName].length;
      });

      return length;
    });

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

      if (list.value && show.value && resultItems.length) {
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
    }

    watch(searchResultsLength, (newValue) => {
      let newHeight = newValue * 52;

      const usersInSearchResults = searchResults.value['Users'];

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

      if (templates.value.length === 0) {
        await window.bcms.util.throwable(async () => {
          return await window.bcms.sdk.template.getAll();
        });
      }
      if (groups.value.length === 0) {
        await window.bcms.util.throwable(async () => {
          return await window.bcms.sdk.group.getAll();
        });
      }
      if (widgets.value.length === 0) {
        await window.bcms.util.throwable(async () => {
          return await window.bcms.sdk.widget.getAll();
        });
      }
      if (media.value.length === 0) {
        await window.bcms.util.throwable(async () => {
          return await window.bcms.sdk.media.getAll();
        });
      }
      if (keys.value.length === 0) {
        await window.bcms.util.throwable(async () => {
          return await window.bcms.sdk.apiKey.getAll();
        });
      }
      // TODO: Missing user.getAll() method
    });

    onBeforeUnmount(() => {
      document.removeEventListener('keydown', handleShowShortcut);
      document.removeEventListener('keydown', handleArrowsNavigation);
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
                    placeholder="Search for anything"
                    class="px-2.5 py-3 flex-1 leading-tight -tracking-0.01 bg-transparent focus:outline-none"
                  />
                </div>
                <BCMSGlobalSearchList
                  results={searchResults}
                  resultsLength={searchResultsLength}
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
