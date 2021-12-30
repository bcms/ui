<script lang="tsx">
import { defineComponent, PropType, ref } from 'vue';
import { DefaultComponentProps } from '../_default';
import BCMSButton from '../button.vue';
import BCMSIcon from '../icon.vue';
import BCMSManagerNavItem from './nav-item.vue';
import { BCMSManagerNavItemType } from '../../types';
import { useRouter } from 'vue-router';
import { BCMSSelect } from '../input';
import pluralize from 'pluralize';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    label: {
      type: String,
      default: '',
    },
    items: {
      type: Array as PropType<BCMSManagerNavItemType[]>,
      default: () => [],
    },
    actionText: String,
  },
  emits: {
    click: (_event: Event, _item: BCMSManagerNavItemType) => {
      return true;
    },
    action: () => {
      return true;
    },
  },
  setup(props, ctx) {
    const extended = ref(true);
    const router = useRouter();

    return () => (
      <div class="relative w-screen h-auto z-[999999] desktop:fixed desktop:h-screen desktop:top-0 desktop:left-[250px] desktop:w-[180px] desktop:border-r desktop:border-grey desktop:border-opacity-50 lg:left-[300px] lg:w-[240px]">
        <div class="bcmsScrollbar flex justify-between items-end flex-wrap py-7.5 px-5 gap-5 max-w-full overflow-visible desktop:pt-[185px]">
          <div class="flex-1 relative max-w-full desktop:pb-[75px] desktop:px-5">
            {ctx.slots.default ? (
              ctx.slots.default()
            ) : (
              <>
                <button
                  class="text-xs leading-normal tracking-0.06 mb-[25px] uppercase w-[calc(100%+15px)] text-left relative items-center translate-x-[-15px] hidden desktop:flex"
                  onClick={() => {
                    extended.value = !extended.value;
                  }}
                >
                  <span
                    class={`flex mr-3 ${extended.value ? 'rotate-90' : ''}`}
                  >
                    <BCMSIcon
                      src="/caret/right"
                      class="w-1 h-auto text-dark fill-current"
                    />
                  </span>
                  <span class="pointer-events-none">{props.label}</span>
                </button>
                <BCMSSelect
                  class="min-w-[200px] mr-5 max-w-max desktop:hidden"
                  placeholder={`Select ${pluralize.singular(props.label)}`}
                  label={`Select ${pluralize.singular(props.label)}`}
                  options={props.items.map((e) => {
                    return { label: e.name, value: e.link };
                  })}
                  selected={
                    props.items.find((e) => e.selected)
                      ? props.items.find((e) => e.selected)?.link
                      : ''
                  }
                  onChange={(event) => {
                    router.push(event.value);
                  }}
                />
                <ul
                  class={`hidden list-none items-center gap-4 max-w-max pr-10 overflow-visible min-w-[300px] ${
                    extended.value ? 'desktop:block' : 'desktop:hidden'
                  } desktop:min-w-max desktop:pr-0 desktop:max-w-full`}
                >
                  {props.items.map((item) => {
                    return (
                      <BCMSManagerNavItem
                        item={item}
                        onOpen={() => {
                          router.push(item.link);
                        }}
                      />
                    );
                  })}
                </ul>
              </>
            )}
          </div>
          {props.actionText ? (
            <div class="managerLayout--sideNav-footer flex flex-shrink-0 desktop:py-5 desktop:pl-2 desktop:fixed desktop:max-w-[170px] desktop:bottom-0 desktop:left-[250px] lg:left-[300px] lg:px-10">
              <BCMSButton
                class="w-auto mt-0 min-w-max desktop:mt-2.5"
                size="m"
                onClick={() => {
                  ctx.emit('action');
                }}
              >
                {props.actionText}
              </BCMSButton>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    );
  },
});

export default component;
</script>
