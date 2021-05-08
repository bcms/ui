<script lang="tsx">
import { defineComponent, PropType, ref } from 'vue';
import { BCMSMediaType } from '@becomes/cms-sdk/types';
import { DefaultComponentProps } from '../_default';
import { BCMSMediaControlFilters } from '../../types';
import BCMSIcon from '../icon.vue';
import BCMSButton from '../button.vue';
import { BCMSSelect, BCMSDateInput } from '../input';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    onUploadFile: Function as PropType<() => void | Promise<void>>,
    onCreateFolder: Function as PropType<() => void | Promise<void>>,
    onFilter: Function as PropType<
      (filters: BCMSMediaControlFilters) => void | Promise<void>
    >,
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
    const filters = ref<BCMSMediaControlFilters>(getFilters());
    // eslint-disable-next-line no-undef
    let searchDebounceTimer: NodeJS.Timeout;

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
      };
    }

    return () => (
      <header>
        <div class="view--search view--left">
          <BCMSIcon class="view--search-icon" src="/search" />
          <input
            class="view--search-input"
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
            onClick={() => {
              filters.value.isOpen = !filters.value.isOpen;
            }}
            class={`view--search-toggler ${
              filters.value.isOpen ? 'view--search-toggler_active' : ''
            }`}
          >
            <BCMSIcon src="/chevron/down" />
          </button>
          {filters.value.isOpen ? (
            <div class="media--filters">
              {filters.value.options.map((filterOption) => {
                return (
                  <div class="media--filter">
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
        </div>
        <div class="view--right">
          <BCMSButton
            class="mr-20"
            onClick={() => {
              ctx.emit('uploadFile');
            }}
          >
            Upload file
          </BCMSButton>
          <BCMSButton
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
