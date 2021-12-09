<script lang="tsx">
import { defineComponent, PropType, ref, Transition } from 'vue';
import type { BCMSTemplate } from '@becomes/cms-sdk/types';
import BCMSIcon from '../icon.vue';
import { BCMSEntryFilters } from '../../types';
import BCMSButton from '../button.vue';
import { BCMSDateInput } from '../input';
import pluralize from 'pluralize';

function getFilters(): BCMSEntryFilters {
  return {
    search: {
      name: '',
    },
    isOpen: false,
    options: [
      {
        label: 'Date Created',
        fromDate: {
          year: -1,
          month: -1,
          day: -1,
        },
      },
      {
        label: 'Date Updated',
        toDate: {
          year: -1,
          month: -1,
          day: -1,
        },
      },
    ],
  };
}

const component = defineComponent({
  props: {
    template: {
      type: Object as PropType<BCMSTemplate>,
      required: true,
    },
    entryCount: {
      type: Number,
      default: 0,
    },
  },
  emits: {
    addEntry: () => {
      return true;
    },
    filter: (_filter: BCMSEntryFilters) => {
      return true;
    },
  },
  setup(props, ctx) {
    const filters = ref(getFilters());
    // eslint-disable-next-line no-undef
    let searchDebounceTimer: NodeJS.Timeout;

    const toggler = ref<HTMLButtonElement | null>(null);

    return () => (
      <header class="flex flex-col mb-[50px] desktop:mb-0 desktop:flex-row desktop:items-start desktop:justify-between">
        <div class="relative max-w-full">
          <h2 class="text-4xl leading-none font-normal -tracking-0.01 mb-[25px]">
            {props.template.label}
          </h2>
          <p class="text-grey text-base leading-tight -tracking-0.01 mb-[25px] desktop:mb-10 lg:mb-[55px]">
            {props.entryCount}{' '}
            {pluralize[props.entryCount !== 1 ? 'plural' : 'singular']('entry')}{' '}
            found
          </p>
          <div class="view--search w-[350px] max-w-full lg:w-[400px] 2xl:w-[450px]">
            <BCMSIcon src="/search" class="view--search-icon" />
            <input
              v-cy={'search'}
              class="view--search-input"
              type="text"
              placeholder="Search entries by Title or ID"
              v-model={filters.value.search.name}
              onKeyup={async () => {
                clearTimeout(searchDebounceTimer);
                searchDebounceTimer = setTimeout(() => {
                  ctx.emit('filter', filters.value);
                }, 300);
              }}
            />
            <Transition name="fade">
              {filters.value.isOpen ? (
                <div
                  class="bg-white shadow-cardLg rounded-2.5 absolute w-full top-[120%] z-100 p-5"
                  v-clickOutside={() => (filters.value.isOpen = false)}
                >
                  {filters.value.options.map((filterOption) => {
                    return (
                      <div class="mb-[15px]">
                        {filterOption.fromDate ? (
                          <BCMSDateInput
                            label={filterOption.label}
                            value={
                              filterOption.fromDate.year !== -1
                                ? new Date(
                                    `${filterOption.fromDate.year}-${filterOption.fromDate.month}-${filterOption.fromDate.day}`
                                  ).getTime()
                                : 0
                            }
                            onInput={async (value) => {
                              if (filterOption.fromDate) {
                                if (value === 0) {
                                  filterOption.fromDate = {
                                    year: -1,
                                    month: -1,
                                    day: -1,
                                  };
                                } else {
                                  const date = new Date(value);
                                  filterOption.fromDate.year =
                                    date.getFullYear();
                                  filterOption.fromDate.month =
                                    date.getMonth() + 1;
                                  filterOption.fromDate.day = date.getDate();
                                }
                                ctx.emit('filter', filters.value);
                              }
                            }}
                          />
                        ) : filterOption.toDate ? (
                          <BCMSDateInput
                            label={filterOption.label}
                            value={
                              filterOption.toDate.year !== -1
                                ? new Date(
                                    `${filterOption.toDate.year}-${filterOption.toDate.month}-${filterOption.toDate.day}`
                                  ).getTime()
                                : 0
                            }
                            onInput={async (value) => {
                              if (filterOption.toDate) {
                                if (value === 0) {
                                  filterOption.toDate = {
                                    year: -1,
                                    month: -1,
                                    day: -1,
                                  };
                                } else {
                                  const date = new Date(value);
                                  filterOption.toDate.year = date.getFullYear();
                                  filterOption.toDate.month =
                                    date.getMonth() + 1;
                                  filterOption.toDate.day = date.getDate();
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
            <button
              v-cy={'open-filters'}
              onClick={() => {
                filters.value.isOpen = !filters.value.isOpen;
              }}
              class={`view--search-toggler ${
                filters.value.isOpen ? 'view--search-toggler_active' : ''
              }`}
              ref={toggler}
            >
              <div
                class={`flex transition-transform duration-300 ${
                  filters.value.isOpen ? 'rotate-180' : ''
                }`}
              >
                <BCMSIcon src="/chevron/down" />
              </div>
            </button>
          </div>
        </div>
        <div>
          <BCMSButton
            cyTag="add-new"
            onClick={() => {
              ctx.emit('addEntry');
            }}
          >
            Add new&nbsp;
            {props.template.label.toLowerCase()}
          </BCMSButton>
        </div>
      </header>
    );
  },
});
export default component;
</script>
