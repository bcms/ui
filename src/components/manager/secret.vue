<script lang="tsx">
import { defineComponent, ref } from 'vue';
import { DefaultComponentProps } from '../_default';
import { BCMSManagerNavItemType } from '../../types';
import { BCMSIcon } from '..';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    label: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    secret: {
      type: String,
      default: '',
    },
  },
  emits: {
    open: (_event: Event, _item: BCMSManagerNavItemType) => {
      return true;
    },
  },
  setup(props) {
    const show = ref(false);

    return () => (
      <div class={`max-w-[600px] mt-5 ${props.class}`}>
        {props.label && (
          <label for={props.id} class="flex flex-col">
            <span class="font-normal not-italic text-xs leading-normal tracking-0.06 uppercase select-none mb-1.25 block">
              {props.label}
            </span>
          </label>
        )}
        <div class="relative flex items-center justify-between w-full bg-white border border-grey rounded-3.5 transition-all duration-300 shadow-none font-normal not-italic text-base leading-tight -tracking-0.01 text-dark h-11 py-0 px-4.5 outline-none placeholder-grey placeholder-opacity-100 pt-3 pb-[9px] pl-4.5 resize-none top-0 left-0 overflow-hidden">
          <div id={props.id} class="bcmsScrollbar overflow-x-auto my-auto mr-4">
            {show.value ? props.secret : '************'}
          </div>
          <button
            class="flex"
            disabled={props.disabled}
            onClick={() => {
              show.value = !show.value;
            }}
          >
            {show.value ? (
              <BCMSIcon
                src="/eye/hide"
                class="w-5 h-auto m-0 text-grey stroke-current transition-colors duration-300 group-hover:text-dark group-focus-visible:text-dark"
              />
            ) : (
              <BCMSIcon
                src="/eye/show"
                class="w-5 h-auto m-0 text-grey fill-current transition-colors duration-300 group-hover:text-dark group-focus-visible:text-dark"
              />
            )}
          </button>
        </div>
      </div>
    );
  },
});
export default component;
</script>
