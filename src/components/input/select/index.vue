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
  },
  emits: {
    change: (_option: BCMSSelectOption) => {
      return true;
    },
  },
  setup(props, ctx) {
    const scrollerId = uuid.v4();
    const bcmsDropdownList = ref<HTMLUListElement | null>(null);
    const search = ref('');
    const toggler = ref<HTMLButtonElement | null>(null);
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
        isDropdownActive.value = true;
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
            'li._selected'
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
          if (!dropDown.active || !dropDown.active.previousElementSibling) {
            dropDown.lastItem.focus();
          } else {
            const prevSibl = dropDown.active.previousSibling as HTMLLIElement;
            prevSibl.focus();
          }
          break;

        case 'ArrowDown': // 'ARROW DOWN' - Move down
          event.preventDefault();
          if (!dropDown.active || !dropDown.active?.nextElementSibling) {
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
          class={`${props.class} w-full max-w-full relative`}
          label={props.label}
          invalidText={props.invalidText}
          helperText={props.helperText}
        >
          {props.hasSearch ? (
            <div
              id={props.id}
              v-cy={props.cyTag}
              class="relative inline-block border-b border-grey border-opacity-50 transition-all duration-300 mt-2.5 max-w-full mb-6 focus-within:border-pink"
            >
              <BCMSIcon
                src="/search"
                class="absolute top-1/2 left-0 -translate-y-1/2 w-4 mr-2.5 text-grey text-opacity-50 fill-current"
              />
              <input
                class="focus:outline-none w-[500px] max-w-full pt-3 pb-2 pl-7.5 text-sm placeholder-grey"
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
              class={`_bcmsInput--select-toggler w-full h-11 justify-between rounded-3.5 py-1.5 pl-5 text-base leading-normal -tracking-0.01 whitespace-normal no-underline border shadow-none select-none flex items-center transition-all duration-300 hover:shadow-input focus:shadow-input active:shadow-input disabled:cursor-not-allowed disabled:opacity-50 disabled:border-grey disabled:border-opacity-50 disabled:hover:shadow-none ${
                props.hasSearch ? 'pr-2.5' : 'pr-5'
              } ${
                props.invalidText
                  ? 'border border-red hover:border-red focus-within:border-red pr-11'
                  : 'border-grey hover:border-grey hover:border-opacity-50 focus:border-grey active:border-grey focus:border-opacity-50 active:border-opacity-50'
              }`}
              onClick={() => {
                logic.toggleDropdown();
              }}
              disabled={props.disabled}
              ref={toggler}
            >
              <span
                class={`pr-3.5 whitespace-nowrap overflow-hidden pointer-events-none relative overflow-ellipsis z-10 ${
                  !props.selected ? 'text-grey' : ''
                }`}
              >
                {logic.getPlaceholderText(props.selected)}
              </span>
              <div
                class={`transition-transform duration-300 ${
                  isDropdownActive.value && !props.disabled
                    ? 'transform -rotate-180'
                    : ''
                }`}
              >
                <BCMSIcon
                  src="/chevron/down"
                  class={`text-grey fill-current w-3 block right-0 relative top-0 flex-shrink-0 pointer-events-none transition-transform duration-300`}
                />
              </div>
            </button>
          )}
          {(isDropdownActive.value || props.hasSearch) && !props.disabled ? (
            <ul
              id={scrollerId}
              tabindex="-1"
              role="listbox"
              aria-labelledby="bcmsSelect_label"
              class={`_bcmsInput--select-list shadow-cardLg max-h-[200px] min-w-[150px] list-none absolute w-full bg-white border border-grey border-opacity-20 z-100 rounded-2.5 transition-shadow duration-300 left-0 overflow-auto top-full mt-2 ${
                props.hasSearch ? 'border-none' : ''
              } ${props.invalidText ? 'border-red' : ''} bcmsScrollbar`}
              ref={bcmsDropdownList}
              v-clickOutside={() => (isDropdownActive.value = false)}
            >
              {filteredOptions.value.map((option) => (
                <li
                  role="option"
                  tabindex="0"
                  class={`_bcmsInput--select-list-item py-2.5 px-4.5 relative cursor-pointer text-dark transition-colors duration-200 flex items-center hover:bg-light focus:bg-light focus:outline-none ${
                    logic.isItemSelected(option)
                      ? 'selected before:contents before:w-2.5 before:h-2.5 before:bg-yellow before:absolute before:rounded-full before:top-1/2 before:left-[-5px] before:-translate-y-1/2 hover:before:bg-red focus:before:bg-red'
                      : 'hover:before:contents hover:before:w-2.5 hover:before:h-2.5 hover:before:bg-yellow hover:before:absolute hover:before:rounded-full hover:before:top-1/2 hover:before:left-[-5px] hover:before:-translate-y-1/2 focus:before:contents focus:before:w-2.5 focus:before:h-2.5 focus:before:bg-yellow focus:before:absolute focus:before:rounded-full focus:before:top-1/2 focus:before:left-[-5px] focus:before:-translate-y-1/2'
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
