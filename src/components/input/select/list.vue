<script lang="tsx">
import { defineComponent, PropType } from 'vue';
import * as uuid from 'uuid';
import { BCMSSelectOption } from '../../../types';

const component = defineComponent({
  props: {
    options: {
      type: Array as PropType<BCMSSelectOption[]>,
      required: true,
    },
    showSearch: {
      type: Boolean,
      required: false,
      default: false,
    },
    invalidText: {
      type: String,
      required: false,
      default: '',
    },
    selected: {
      type: String,
      required: false,
      default: '',
    },
  },
  emits: {
    change: (_option: BCMSSelectOption) => {
      return true;
    },
  },
  setup(props, ctx) {
    const scrollerId = uuid.v4();

    const logic = {
      isItemSelected(option: BCMSSelectOption) {
        return option.value === props.selected;
      },
      selectOption(option: BCMSSelectOption) {
        if (option.value === props.selected) {
          ctx.emit('change', { label: '', value: '' });
        } else {
          ctx.emit('change', option);
        }
      },
    };

    return () => {
      return (
        <ul
          id={scrollerId}
          tabindex="-1"
          role="listbox"
          aria-labelledby="bcmsSelect_label"
          class={`max-h-[200px] min-w-[150px] list-none w-full bg-white border border-grey border-opacity-20 z-100 rounded-2.5 transition-shadow duration-300 left-0 overflow-auto ${
            props.showSearch ? 'border-none pt-6' : 'absolute shadow-cardLg'
          } ${props.invalidText ? 'border-red' : ''} bcmsScrollbar`}
        >
          {props.options.map((option) => (
            <li
              role="option"
              tabindex="0"
              class={`py-2.5 before:block relative cursor-pointer text-dark transition-colors duration-200 flex items-center hover:bg-light focus:bg-light focus:outline-none ${
                logic.isItemSelected(option)
                  ? 'selected before:w-2.5 before:h-2.5 before:bg-yellow before:absolute before:rounded-full before:top-1/2 before:left-[-5px] before:-translate-y-1/2 hover:before:bg-red focus:before:bg-red'
                  : 'hover:before:w-2.5 hover:before:h-2.5 hover:before:bg-yellow hover:before:absolute hover:before:rounded-full hover:before:top-1/2 hover:before:left-[-5px] hover:before:-translate-y-1/2 focus:before:w-2.5 focus:before:h-2.5 focus:before:bg-yellow focus:before:absolute focus:before:rounded-full focus:before:top-1/2 focus:before:left-[-5px] focus:before:-translate-y-1/2'
              } ${props.showSearch ? 'pl-1 pr-4.5 before:hidden' : 'px-4.5'}`}
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
              {option.image ? (
                <img
                  class="w-6 h-6 rounded-full mr-[15px]"
                  src={option.image}
                  alt="Flag"
                />
              ) : (
                ''
              )}
              <span>{option.label ? option.label : option.value}</span>
            </li>
          ))}
        </ul>
      );
    };
  },
});
export default component;
</script>
