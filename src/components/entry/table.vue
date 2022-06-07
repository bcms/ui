<script lang="tsx">
import type {
  BCMSEntryLite,
  BCMSLanguage,
  BCMSTemplate,
  BCMSUserPolicyTemplate,
} from '@becomes/cms-sdk/types';
import {
  defineComponent,
  onBeforeUpdate,
  onMounted,
  onUnmounted,
  PropType,
  ref,
} from '@vue/runtime-core';
import BCMSTimestampDisplay from '../timestamp-display.vue';
import BCMSLink from '../link.vue';
import BCMSIcon from '../icon.vue';
import { BCMSOverflowMenu, BCMSOverflowMenuItem } from '../overflow';
import { BCMSEmptyStateIllustration } from '..';
import { useI18n } from 'vue-i18n';

const CHUNK_SIZE = 10;

const component = defineComponent({
  props: {
    template: { type: Object as PropType<BCMSTemplate>, required: true },
    entries: { type: Array as PropType<BCMSEntryLite[]>, required: true },
    visibleLanguage: {
      type: Object as PropType<{ data: BCMSLanguage; index: number }>,
      required: true,
    },
    policy: {
      type: Object as PropType<BCMSUserPolicyTemplate>,
      required: true,
    },
  },
  emits: {
    remove: (_: BCMSEntryLite) => {
      return true;
    },
    duplicate: (_: BCMSEntryLite) => {
      return true;
    },
  },
  setup(props, ctx) {
    const { t: i18n } = useI18n();
    let visibleChunks = 1;
    const showToIndex = ref(CHUNK_SIZE);
    let tidBuffer = '';

    function getEntryTitle(entryLite: BCMSEntryLite): string {
      if (entryLite.meta[props.visibleLanguage.index]) {
        const title = (
          entryLite.meta[props.visibleLanguage.index].props[0].data as string[]
        )[0];
        if (title) {
          return title;
        }
      }
      return i18n('entries.table.emptyTitle');
    }

    function loadMore() {
      visibleChunks++;
      showToIndex.value = visibleChunks * CHUNK_SIZE;
    }
    function onScroll(event: Event) {
      const el = event.target as HTMLBodyElement;
      if (
        showToIndex.value < props.entries.length &&
        el.scrollTop + window.innerHeight === el.scrollHeight
      ) {
        loadMore();
      }
    }

    document.body.addEventListener('scroll', onScroll);

    onMounted(() => {
      tidBuffer = props.template._id;
    });
    onBeforeUpdate(() => {
      if (tidBuffer !== props.template._id) {
        tidBuffer = props.template._id;
        visibleChunks = 1;
        showToIndex.value = CHUNK_SIZE;
        document.body.scrollTo({ top: 0 });
      }
    });
    onUnmounted(() => {
      document.body.removeEventListener('scroll', onScroll);
    });

    return () => (
      <>
        {props.entries.length > 0 ? (
          <>
            <ul v-cy={'entries-list'} class="list-none">
              <li class="grid grid-cols-1 py-5 border-b border-dark border-opacity-20 gap-5 text-base leading-tight -tracking-0.01 items-center justify-between first:hidden md:grid-cols-[minmax(100px,0.1fr),minmax(100px,0.1fr),0.8fr,145px] md:first:grid md:border-grey md:border-opacity-50 md:relative md:first:font-semibold">
                <div>
                  <span>{i18n('entries.table.createdAt')}</span>
                </div>
                <div>
                  <span>{i18n('entries.table.updatedAt')}</span>
                </div>
                <div class="truncate">
                  <span>{i18n('entries.table.title')}</span>
                </div>
              </li>
              {props.entries.map((entryLite, entryLiteIndex) => {
                if (entryLiteIndex > showToIndex.value) {
                  return '';
                }
                return (
                  <li
                    v-cy={`item-${entryLiteIndex}`}
                    class="relative grid grid-cols-1 py-5 border-b border-dark border-opacity-20 gap-5 text-base leading-tight -tracking-0.01 items-center justify-between first:hidden md:grid-cols-[minmax(100px,0.1fr),minmax(100px,0.1fr),0.8fr,145px] md:first:grid md:border-grey md:border-opacity-50 md:relative md:first:font-semibold"
                    style={`z-index: ${props.entries.length - entryLiteIndex}`}
                  >
                    <div
                      class="before:content-[attr(data-column-name)] before:w-15 before:inline-block before:font-semibold before:text-grey before:text-xs before:leading-tight before:mr-5 md:before:hidden"
                      data-column-name="Created At"
                    >
                      <BCMSTimestampDisplay timestamp={entryLite.createdAt} />
                    </div>
                    <div
                      class="before:content-[attr(data-column-name)] before:w-15 before:inline-block before:font-semibold before:text-grey before:text-xs before:leading-tight before:mr-5 md:before:hidden"
                      data-column-name="Updated At"
                    >
                      <BCMSTimestampDisplay timestamp={entryLite.updatedAt} />
                    </div>
                    <div
                      class="before:content-[attr(data-column-name)] before:w-15 before:inline-block before:font-semibold before:text-grey before:text-xs before:leading-tight before:mr-5 md:before:hidden truncate"
                      data-column-name="Title"
                      title={getEntryTitle(entryLite)}
                    >
                      <span>{getEntryTitle(entryLite)}</span>
                    </div>
                    <div class="flex col-start-2 col-end-3 row-start-1 row-end-3 flex-col items-end md:col-start-[unset] md:col-end-[unset] md:row-start-[unset] md:row-end-[unset] md:flex-row md:items-center">
                      <BCMSLink
                        disabled={!props.policy.put}
                        cyTag="edit"
                        href={`/dashboard/t/${props.template.cid}/e/${entryLite.cid}`}
                        class={`group mb-2.5 rounded-3.5 transition-shadow duration-300 flex items-center font-medium text-base leading-normal -tracking-0.01 whitespace-normal no-underline border border-solid select-none ${
                          props.policy.put
                            ? 'hover:shadow-btnAlternate hover:text-dark hover:text-opacity-100 focus:shadow-btnAlternate focus:text-dark focus:text-opacity-100 active:shadow-btnAlternate active:text-dark active:text-opacity-100'
                            : 'cursor-not-allowed opacity-50'
                        } bg-light border-light text-dark text-opacity-80 py-1.5 px-3.5 md:mb-0 md:mr-5`}
                      >
                        <BCMSIcon
                          class={`text-sm mr-5 w-5 h-5 text-grey fill-current transition-colors duration-200 ${
                            props.policy.put
                              ? 'group-hover:text-green group-focus-visible:text-green'
                              : ''
                          }`}
                          src="/edit"
                        />
                        <span class="relative z-10 transition-colors duration-200">
                          {i18n('entries.table.edit')}
                        </span>
                      </BCMSLink>
                      <BCMSOverflowMenu cyTag="overflow" position="right">
                        {props.policy.post && props.policy.put ? (
                          <BCMSOverflowMenuItem
                            cyTag="duplicate"
                            text={i18n('entries.table.overflowItems.duplicate')}
                            icon="copy"
                            onClick={() => {
                              ctx.emit('duplicate', entryLite);
                            }}
                          />
                        ) : (
                          ''
                        )}
                        <BCMSOverflowMenuItem
                          cyTag="view-model"
                          text={i18n('entries.table.overflowItems.viewModel')}
                          icon="code"
                          onClick={() => {
                            window.bcms.modal.entry.viewModel.show({
                              templateId: entryLite.templateId,
                              entryId: entryLite._id,
                            });
                          }}
                        />
                        {props.policy.delete ? (
                          <BCMSOverflowMenuItem
                            cyTag="remove"
                            text={i18n('entries.table.overflowItems.remove')}
                            icon="trash"
                            onClick={() => {
                              ctx.emit('remove', entryLite);
                            }}
                          />
                        ) : (
                          ''
                        )}
                      </BCMSOverflowMenu>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <BCMSEmptyStateIllustration
            src="/entries.png"
            maxWidth="270px"
            maxHeight="325px"
            class="md:absolute md:bottom-32 md:right-32"
          />
        )}
      </>
    );
  },
});
export default component;
</script>
