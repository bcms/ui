<script lang="tsx">
import {
  computed,
  defineComponent,
  onBeforeUpdate,
  onMounted,
  ref,
  Transition,
} from 'vue';
import { BCMSMediaType } from '@becomes/cms-sdk/types';
import { DefaultComponentProps } from '../_default';
import { BCMSMediaControlFilters } from '../../types';
import BCMSIcon from '../icon.vue';
import BCMSButton from '../button.vue';
import { BCMSSelect, BCMSDateInput } from '../input';
import { useRoute } from 'vue-router';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    disableUploadFile: Boolean,
    disableCreateFolder: Boolean,
  },
  emits: {
    uploadFile: () => {
      return true;
    },
    createFolder: () => {
      return true;
    },
    filter: (_filters: BCMSMediaControlFilters) => {
      return true;
    },
  },
  setup(props, ctx) {
    const route = useRoute();
    const filters = ref<BCMSMediaControlFilters>(getFilters());
    const query = computed(() => {
      return {
        search: route.query.search as string,
      };
    });
    // eslint-disable-next-line no-undef
    let searchDebounceTimer: NodeJS.Timeout;
    let searchQueryBuffer = '';

    function getFilters(): BCMSMediaControlFilters {
      return {
        search: {
          name: '',
        },
        isOpen: false,
        options: [
          {
            label: 'Type',
            dropdown: {
              items: [
                { label: 'Image', value: BCMSMediaType.IMG },
                { label: 'Video', value: BCMSMediaType.VID },
                { label: 'Directory', value: BCMSMediaType.DIR },
              ],
              selected: {
                label: 'No filters',
                value: '',
              },
            },
          },
          {
            label: 'Date Modified',
            date: {
              year: -1,
              month: -1,
              day: -1,
            },
          },
        ],
        clear: () => {
          filters.value = getFilters();
          return filters.value;
        },
      };
    }

    onMounted(() => {
      if (query.value.search && route.path.startsWith('/dashboard/media')) {
        searchQueryBuffer = query.value.search;
        filters.value.search.name = query.value.search;
        ctx.emit('filter', filters.value);
      }
    });
    onBeforeUpdate(() => {
      console.log('HERE');
      if (searchQueryBuffer !== query.value.search) {
        searchQueryBuffer = query.value.search;
        filters.value.search.name = query.value.search;
        ctx.emit('filter', filters.value);
      }
    });

    return () => (
      <header
        key={query.value.search}
        class="flex flex-wrap justify-between mb-15"
      >
        <div class="relative flex border-b border-dark transition-colors duration-300 mb-5 w-full max-w-[500px] min-w-[250px] hover:border-green focus-within:border-green sm:mr-5">
          <BCMSIcon
            class="absolute top-1/2 left-0 -translate-y-1/2 w-[18px] mr-2.5 text-dark fill-current"
            src="/search"
          />
          <input
            class="w-full py-2.5 pl-[35px] text-base outline-none bg-transparent"
            type="text"
            placeholder="Search"
            v-model={filters.value.search.name}
            onKeyup={async () => {
              clearTimeout(searchDebounceTimer);
              searchDebounceTimer = setTimeout(() => {
                ctx.emit('filter', filters.value);
              }, 300);
            }}
          />
          <button
            v-cy={'open-filters'}
            onClick={() => {
              filters.value.isOpen = !filters.value.isOpen;
            }}
            class="group relative flex p-2 focus:outline-none"
          >
            <div
              class={`flex transition-transform duration-300 ${
                filters.value.isOpen ? 'rotate-180' : ''
              }`}
            >
              <BCMSIcon
                src="/chevron/down"
                class="relative m-auto top-0 w-[15px] translate-y-0 transition-all duration-300 pointer-events-none text-dark fill-current group-hover:text-green group-focus-visible:text-green"
              />
            </div>
          </button>
          <Transition name="fade">
            {filters.value.isOpen ? (
              <div
                class="bg-white shadow-cardLg rounded-2.5 absolute w-full top-[120%] z-100 p-5"
                v-clickOutside={() => (filters.value.isOpen = false)}
              >
                {filters.value.options.map((filterOption) => {
                  return (
                    <div class="mb-[15px]">
                      {filterOption.dropdown ? (
                        <BCMSSelect
                          cyTag="mediaFilter"
                          placeholder="No filters"
                          label={filterOption.label}
                          options={filterOption.dropdown.items}
                          selected={filterOption.dropdown.selected.value}
                          onChange={async (option) => {
                            if (filterOption.dropdown) {
                              filterOption.dropdown.selected = option;
                              ctx.emit('filter', filters.value);
                            }
                          }}
                        />
                      ) : filterOption.date ? (
                        <BCMSDateInput
                          label={filterOption.label}
                          value={
                            filterOption.date.year !== -1
                              ? new Date(
                                  `${filterOption.date.year}-${filterOption.date.month}-${filterOption.date.day}`
                                ).getTime()
                              : 0
                          }
                          onInput={async (value) => {
                            if (filterOption.date) {
                              if (value === 0) {
                                filterOption.date = {
                                  year: -1,
                                  month: -1,
                                  day: -1,
                                };
                              } else {
                                const date = new Date(value);
                                filterOption.date.year = date.getFullYear();
                                filterOption.date.month = date.getMonth() + 1;
                                filterOption.date.day = date.getDate();
                              }
                              ctx.emit('filter', filters.value);
                            }
                          }}
                        />
                      ) : (
                        ''
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              ''
            )}
          </Transition>
        </div>
        <div class="flex flex-col xs:block">
          <BCMSButton
            disabled={props.disableUploadFile}
            class="mr-5 mb-5 xs:mb-0"
            onClick={() => {
              ctx.emit('uploadFile');
            }}
          >
            Upload file
          </BCMSButton>
          <BCMSButton
            disabled={props.disableCreateFolder}
            kind="secondary"
            onClick={() => {
              ctx.emit('createFolder');
            }}
          >
            Create new folder
          </BCMSButton>
        </div>
      </header>
    );
  },
});
export default component;
</script>
