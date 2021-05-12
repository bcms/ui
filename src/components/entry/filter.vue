<script lang="tsx">
import { defineComponent, PropType, ref } from 'vue';
import type { BCMSTemplate } from '@becomes/cms-sdk/types';
import BCMSIcon from '../icon.vue';
import { BCMSEntryFilters } from '../../types';
import BCMSButton from '../button.vue';

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
    onAddEntry: Function as PropType<() => void | Promise<void>>,
    onFilter: Function as PropType<
      (filters: BCMSEntryFilters) => void | Promise<void>
    >,
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

    return () => (
      <header>
        <div class="view--left">
          <h2 class="view--title mb-25">{props.template.label}</h2>
          <p class="view--description">{props.entryCount} entries found</p>
          <div class="view--search">
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
            <button
              v-cy={'open-filters'}
              onClick={() => {
                filters.value.isOpen = !filters.value.isOpen;
              }}
              class={`view--search-toggler ${
                filters.value.isOpen ? 'view--search-toggler_active' : ''
              }`}
            >
              <BCMSIcon src="/chevron/down" />
            </button>
          </div>
        </div>
        <div class="view--right">
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
