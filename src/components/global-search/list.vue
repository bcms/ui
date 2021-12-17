<script lang="tsx">
import { ComputedRef, defineComponent, PropType, Ref } from '@vue/runtime-core';
import { BCMSGlobalSearchItem } from './global-search.vue';

const component = defineComponent({
  props: {
    results: {
      type: Object as PropType<
        ComputedRef<{
          [groupName: string]: BCMSGlobalSearchItem[];
        }>
      >,
      required: true,
    },
    resultsLength: {
      type: Object as PropType<ComputedRef<number>>,
      required: true,
    },
    list: {
      type: Object as PropType<Ref<HTMLUListElement | null>>,
      required: true,
    },
  },
  emits: {
    hide: () => {
      return true;
    },
  },
  setup(props, ctx) {
    return () => (
      <ul ref={props.list} class="bcmsScrollbar max-h-[470px] overflow-y-auto">
        {Object.keys(props.results.value).map((key, index) => {
          if (props.results.value[key].length !== 0) {
            return (
              <li
                key={index}
                class={
                  key === 'Users' && props.resultsLength.value > 1
                    ? 'mt-12'
                    : ''
                }
              >
                {key === 'Users' && (
                  <span class="text-xs leading-normal tracking-0.06 uppercase font-medium text-grey px-10 mb-2.5">
                    {key}
                  </span>
                )}
                <ul>
                  {props.results.value[key].map((e) => {
                    return (
                      <li class="globalSearch--result-item flex">
                        <router-link
                          to={e.url}
                          class="group w-full flex items-center justify-between px-10 py-[13px] transition-colors duration-300 hover:bg-light focus-visible:bg-light focus:outline-none"
                          onClick={() => ctx.emit('hide')}
                        >
                          <div class="flex items-center">
                            {key !== 'Users' && (
                              <span class="text-sm -tracking-0.01 leading-none text-light text-center rounded-md px-2.5 pt-2 pb-1 bg-grey w-20 mr-6">
                                {e.kind}
                              </span>
                            )}
                            <span class="leading-tight -tracking-0.01">
                              {e.label}
                            </span>
                          </div>
                          <span class="text-green -tracking-0.01 leading-normal opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                            Select
                          </span>
                        </router-link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          }
        })}
      </ul>
    );
  },
});
export default component;
</script>
