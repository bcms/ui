<script lang="tsx">
import { computed, defineComponent, PropType, ref } from 'vue';
import * as uuid from 'uuid';
import { BCMSSelectOption } from '../../../types';
import BCMSIcon from '../../icon.vue';
import InputWrapper from '../_input.vue';
import { DefaultComponentProps } from '../../_default';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    label: String,
    placeholder: String,
    invalidText: String,
    helperText: String,
    disabled: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: String,
      default: '',
    },
    options: {
      type: Array as PropType<BCMSSelectOption[]>,
      default: () => [],
    },
    hasSearch: {
      type: Boolean,
      default: false,
    },
    onChange: Function as PropType<
      (option: BCMSSelectOption) => void | Promise<void>
    >,
  },
  emits: {
    change: (option: BCMSSelectOption) => {
      return option;
    },
  },
  setup(props, ctx) {
    const scrollerId = uuid.v4();
    const bcmsDropdownList = ref<HTMLUListElement | null>(null);
    const search = ref('');
    const filteredOptions = computed<BCMSSelectOption[]>(() => {
      return props.options.filter((option) =>
        search.value
          ? option.value.toLowerCase().includes(search.value) ||
            option.label.toLowerCase().includes(search.value)
          : true
      );
    });
    const isDropdownActive = ref(false);
    const logic = {
      handleSearchInput(event: Event) {
        const element = event.target as HTMLInputElement;
        if (!element) {
          return;
        }
        search.value = element.value.toLowerCase();
        // const searchString = element.value.toLowerCase();
        // filteredOptions.value = props.options.filter(
        //   (option) =>
        //     option.value.toLowerCase().includes(searchString) ||
        //     option.label.toLowerCase().includes(searchString)
        // );
      },
      toggleDropdown() {
        isDropdownActive.value = !isDropdownActive.value;
        if (isDropdownActive.value) {
          window.addEventListener('keydown', eventListeners);
        } else {
          window.removeEventListener('keydown', eventListeners);
        }
      },
      getPlaceholderText(_selected: string) {
        if (!_selected) {
          return props.placeholder;
        }
        const selectedOption = props.options.find((e) => e.value === _selected);
        if (!selectedOption) {
          return props.placeholder;
        }
        return selectedOption.label
          ? selectedOption.label
          : selectedOption.value;
      },
      isItemSelected(item: BCMSSelectOption) {
        return item.value === props.selected;
      },
      selectOption(option: BCMSSelectOption) {
        if (option.value === props.selected) {
          ctx.emit('change', { label: '', value: '' });
        } else {
          ctx.emit('change', option);
        }
        logic.toggleDropdown();
      },
    };
    function eventListeners(event: KeyboardEvent) {
      const dropDown = {
        root: bcmsDropdownList.value,
        active:
          (bcmsDropdownList.value?.querySelector(
            'li:focus'
          ) as HTMLLIElement) ||
          (bcmsDropdownList.value?.querySelector(
            '._bcmsInput--select-list-item_selected'
          ) as HTMLLIElement),
        firstItem: bcmsDropdownList.value?.querySelector(
          'li:first-child'
        ) as HTMLLIElement,
        lastItem: bcmsDropdownList.value?.querySelector(
          'li:last-child'
        ) as HTMLLIElement,
      };

      switch (event.key) {
        case 'Escape': // 'ESC' - Close dropdown
          event.preventDefault();
          logic.toggleDropdown();
          break;

        case 'ArrowUp': // 'ARROW UP' - Move up
          event.preventDefault();
          if (!dropDown.active || !dropDown.active?.previousSibling) {
            dropDown.lastItem.focus();
          } else {
            const prevSibl = dropDown.active.previousSibling as HTMLLIElement;
            prevSibl.focus();
          }
          break;

        case 'ArrowDown': // 'ARROW DOWN - Move down
          event.preventDefault();
          if (!dropDown.active || !dropDown.active?.nextSibling) {
            dropDown.firstItem.focus();
          } else {
            const nextSibling = dropDown.active.nextSibling as HTMLLIElement;
            nextSibling.focus();
          }
          break;

        default:
          break;
      }
    }

    return () => {
      return (
        <InputWrapper
          class={`${props.class} _bcmsInput_selectWidth`}
          label={props.label}
          invalidText={props.invalidText}
          helperText={props.helperText}
        >
          {props.hasSearch ? (
            <div
              id={props.id}
              v-cy={props.cyTag}
              class="_bcmsInput--select-search"
            >
              <BCMSIcon src="/search" />
              <input
                class="_bcmsInput--select-search-input"
                type="text"
                placeholder="Search"
                onKeyup={logic.handleSearchInput}
              />
            </div>
          ) : (
            <button
              id={'' + props.id}
              v-cy={props.cyTag}
              aria-haspopup="listbox"
              aria-labelledby="bcmsSelect_label bcmsSelect_button"
              type="button"
              class={`_bcmsInput--select-toggler ${
                (isDropdownActive.value || props.hasSearch) && !props.disabled
                  ? '_bcmsInput--select-toggler_active'
                  : ''
              }`}
              onClick={() => {
                logic.toggleDropdown();
              }}
              disabled={props.disabled}
            >
              <span
                class={!props.selected ? '_bcmsInput--select-placeholder' : ''}
              >
                {logic.getPlaceholderText(props.selected)}
              </span>
              <BCMSIcon src="/chevron/down" />
            </button>
          )}
          {(isDropdownActive.value || props.hasSearch) && !props.disabled ? (
            <ul
              id={scrollerId}
              tabindex="-1"
              role="listbox"
              aria-labelledby="bcmsSelect_label"
              class={`_bcmsInput--select-list ${
                props.hasSearch ? '_bcmsInput--select-search-list' : ''
              } customScrollbar`}
              ref={bcmsDropdownList}
            >
              {filteredOptions.value.map((option) => (
                <li
                  role="option"
                  tabindex="0"
                  class={`_bcmsInput--select-list-item ${
                    logic.isItemSelected(option)
                      ? '_bcmsInput--select-list-item_selected'
                      : ''
                  } ${
                    option.special
                      ? `_bcmsInput--select-list-item_${option.special}`
                      : ''
                  }`}
                  data-value={option.value}
                  onKeydown={(event) => {
                    if (event.key === 'Enter') {
                      logic.selectOption(option);
                    }
                  }}
                  onClick={() => {
                    logic.selectOption(option);
                  }}
                >
                  {option.label ? option.label : option.value}
                </li>
              ))}
            </ul>
          ) : (
            ''
          )}
        </InputWrapper>
      );
    };
  },
});
export default component;
</script>
