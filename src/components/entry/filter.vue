<script lang="tsx">
import { computed, defineComponent, PropType, ref, Transition } from 'vue';
import type { BCMSLanguage, BCMSTemplate } from '@becomes/cms-sdk/types';
import BCMSIcon from '../icon.vue';
import type { BCMSEntryFilters, BCMSEntryFiltersOption } from '../../types';
import BCMSButton from '../button.vue';
import { BCMSDateInput, BCMSSelect } from '../input';
import pluralize from 'pluralize';
import { useI18n } from 'vue-i18n';

const component = defineComponent({
  props: {
    template: {
      type: Object as PropType<BCMSTemplate>,
      required: true,
    },
    languages: { type: Array as PropType<BCMSLanguage[]>, required: true },
    visibleLanguage: {
      type: Object as PropType<{ data: BCMSLanguage; index: number }>,
      required: true,
    },
    disableAddEntry: Boolean,
    entryCount: {
      type: Number,
      default: 0,
    },
  },
  emits: {
    selectLanguage: (_: string) => {
      return true;
    },
    addEntry: () => {
      return true;
    },
    filter: (_filter: BCMSEntryFilters) => {
      return true;
    },
  },
  setup(props, ctx) {
    const { t: i18n } = useI18n();

    function getFilters(): BCMSEntryFilters {
      return {
        search: {
          name: '',
        },
        isOpen: false,
        options: [
          {
            label: i18n('entries.filters.input.dateCreated.label'),
            fromDate: {
              year: -1,
              month: -1,
              day: -1,
            },
          },
          {
            label: i18n('entries.filters.input.dateUpdated.label'),
            toDate: {
              year: -1,
              month: -1,
              day: -1,
            },
          },
        ],
      };
    }

    const filters = ref(getFilters());

    const isFiltering = computed(() => {
      return !!(
        filters.value.search.name ||
        filters.value.options.some((option: BCMSEntryFiltersOption) => {
          return option.fromDate?.year !== -1 && option.toDate?.year !== -1;
        })
      );
    });

    // eslint-disable-next-line no-undef
    let searchDebounceTimer: NodeJS.Timeout;
    const isEmpty = computed(() => {
      return props.entryCount === 0;
    });

    const toggler = ref<HTMLButtonElement | null>(null);

    return () => (
      <header
        class={`flex mb-[50px] desktop:mb-0 ${
          isEmpty.value
            ? 'items-start justify-between'
            : 'flex-col desktop:flex-row desktop:items-start desktop:justify-between'
        }`}
      >
        <div class="relative max-w-full">
          <h2 class="text-9.5 -tracking-0.03 leading-none font-normal mb-5">
            {props.template.label}
          </h2>
          <p
            class={`text-base leading-tight -tracking-0.01 mb-[25px] ${
              isEmpty.value ? '' : 'text-grey'
            } desktop:mb-10 lg:mb-[55px]`}
          >
            {isEmpty.value
              ? i18n('entries.filters.emptyState.subtitle')
              : i18n('entries.filters.entriesCount', {
                  count: props.entryCount,
                  pluralEntry: pluralize('entry', props.entryCount),
                })}
          </p>
          {(!isEmpty.value || isFiltering.value) && (
            <div class="relative flex border-b border-dark transition-colors duration-300 mb-5 mr-5 w-[500px] max-w-full hover:border-green focus-within:border-green">
              <BCMSIcon
                src="/search"
                class="absolute top-1/2 left-0 -translate-y-1/2 w-[18px] mr-2.5 text-dark fill-current"
              />
              <input
                v-cy={'search'}
                class="w-full py-2.5 pl-[35px] text-base outline-none bg-transparent"
                type="text"
                placeholder={i18n('entries.filters.input.search.placeholder')}
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
                                    filterOption.toDate.year =
                                      date.getFullYear();
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
                class="group relative flex p-2 focus:outline-none"
                ref={toggler}
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
            </div>
          )}
        </div>
        <div class="flex flex-col gap-5 xs:flex-row xs:items-center">
          {props.languages.length > 1 && !isEmpty.value && (
            <BCMSSelect
              cyTag="select-lang"
              selected={props.visibleLanguage.data._id}
              options={props.languages.map((e) => {
                return { label: `${e.name}`, value: e._id };
              })}
              onChange={(option) => {
                ctx.emit('selectLanguage', option.value);
              }}
              class="xs:max-w-[200px]"
            />
          )}
          <BCMSButton
            cyTag="add-new"
            disabled={props.disableAddEntry}
            onClick={() => {
              ctx.emit('addEntry');
            }}
            class="flex-shrink-0"
          >
            {i18n('entries.filters.emptyState.actionText', {
              label: props.template.label.toLowerCase(),
            })}
          </BCMSButton>
        </div>
      </header>
    );
  },
});
export default component;
</script>
