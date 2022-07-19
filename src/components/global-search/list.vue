<script lang="tsx">
import { computed, defineComponent, PropType, Ref } from '@vue/runtime-core';
import { useTranslation } from '../../translations';
import type { BCMSGlobalSearchItem } from '../../types';
import Link from '../link.vue';

const component = defineComponent({
  props: {
    results: {
      type: Array as PropType<BCMSGlobalSearchItem[]>,
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
    const translations = computed(() => {
      return useTranslation();
    });

    return () => (
      <ul ref={props.list} class="bcmsScrollbar max-h-[470px] overflow-y-auto">
        {props.results.length > 0 ? (
          <>
            {props.results
              .filter((e) => e.kind !== 'User')
              .map((item) => {
                return (
                  <li class="globalSearch--result-item flex">
                    <Link
                      href={item.url}
                      class="group w-full flex items-center justify-between px-10 py-[13px] transition-colors duration-300 hover:bg-light focus-visible:bg-light focus:outline-none"
                      onClick={() => ctx.emit('hide')}
                    >
                      <div class="flex items-center">
                        <span class="text-sm -tracking-0.01 leading-none text-light text-center rounded-md px-2.5 pt-2 pb-1 bg-grey w-20 mr-6 transition-colors duration-300 group-hover:bg-green group-focus-visible:bg-green">
                          {item.kind}
                        </span>
                        <span
                          class="leading-tight -tracking-0.01"
                          v-html={item.label}
                        />
                      </div>
                      <span class="text-green -tracking-0.01 leading-normal opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                        {translations.value.modal.globalSearch.select}
                      </span>
                    </Link>
                  </li>
                );
              })}
            {props.results
              .filter((e) => e.kind === 'User')
              .map((item) => {
                return (
                  <li class="mt-12">
                    <span class="text-xs leading-normal tracking-0.06 uppercase font-medium text-grey px-10 mb-2.5">
                      {translations.value.modal.globalSearch.members}
                    </span>
                    <ul>
                      <li class="globalSearch--result-item flex">
                        <Link
                          href={item.url}
                          class="group w-full flex items-center justify-between px-10 py-[13px] transition-colors duration-300 hover:bg-light focus-visible:bg-light focus:outline-none"
                          onClick={() => ctx.emit('hide')}
                        >
                          <div class="flex items-center">
                            {item.imageUrl && (
                              <img
                                src={item.imageUrl}
                                alt={item.label}
                                class="w-5 h-5 mr-1.5 object-contain rounded-full"
                              />
                            )}
                            <span class="leading-tight -tracking-0.01">
                              {item.label}
                            </span>
                          </div>
                          <span class="text-green -tracking-0.01 leading-normal opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                            {translations.value.modal.globalSearch.select}
                          </span>
                        </Link>
                      </li>
                    </ul>
                  </li>
                );
              })}
          </>
        ) : (
          ''
        )}
      </ul>
    );
  },
});
export default component;
</script>
