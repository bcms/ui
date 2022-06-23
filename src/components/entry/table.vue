<script lang="tsx">
import {
  BCMSEntryLite,
  BCMSLanguage,
  BCMSMedia,
  BCMSPropType,
  BCMSTemplate,
  BCMSUserPolicyTemplate,
} from '@becomes/cms-sdk/types';
import {
  computed,
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
import { BCMSEmptyStateIllustration, BCMSImage } from '..';
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
    const store = window.bcms.vue.store;
    const entries = computed(() => {
      if (props.entries.length === 0) {
        return [];
      }
      const template = store.getters.template_findOne(
        (e) => e._id === props.entries[0].templateId
      );
      return props.entries.map((entry) => {
        let status = '';
        if (entry.status) {
          const fullStatus = store.getters.status_findOne(
            (e) => e._id === entry.status
          );
          if (fullStatus) {
            status = fullStatus.label;
          }
        }
        let imageId: string | undefined;
        let subtitle: string | undefined;
        if (template) {
          for (let i = 2; i < entry.meta[0].props.length; i++) {
            const prop = entry.meta[0].props[i];
            const tProp = template.props.find((e) => e.id === prop.id);
            if (tProp && prop.data) {
              if (
                tProp.type === BCMSPropType.MEDIA &&
                (prop.data as BCMSMedia[])[0]
              ) {
                imageId = (prop.data as BCMSMedia[])[0]._id;
              } else if (tProp.type === BCMSPropType.STRING) {
                subtitle = (prop.data as string[])[0];
              }
            }
          }
        }
        return {
          ...entry,
          title: (entry.meta[0].props[0].data as string[])[0],
          image: store.getters.media_findOne((e) => e._id === imageId),
          subtitle,
          status,
        };
      });
    });
    const hasData = computed(() => {
      return {
        image: !!entries.value.find((e) => e.image),
        status: !!entries.value.find((e) => e.status),
      };
    });

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
              <li
                class={`bcmsEntryTable bcmsEntryTable${
                  hasData.value.image ? '_wi' : ''
                }${
                  hasData.value.status ? '_ws' : ''
                } grid grid-cols-1 py-5 border-b border-dark border-opacity-20 gap-5 text-base leading-tight -tracking-0.01 items-center justify-between first:hidden md:first:grid md:border-grey md:border-opacity-50 md:relative md:first:font-semibold`}
              >
                {hasData.value.image ? <div /> : ''}
                <div>
                  <span>{i18n('entries.table.createdAt')}</span>
                </div>
                <div>
                  <span>{i18n('entries.table.updatedAt')}</span>
                </div>
                {hasData.value.status ? (
                  <div>
                    <span>{i18n('entries.table.status')}</span>
                  </div>
                ) : (
                  ''
                )}
                <div class="truncate">
                  <span>{i18n('entries.table.title')}</span>
                </div>
              </li>
              {entries.value.map((entryLite, entryLiteIndex) => {
                if (entryLiteIndex > showToIndex.value) {
                  return '';
                }
                return (
                  <li
                    v-cy={`item-${entryLiteIndex}`}
                    class={`bcmsEntryTable bcmsEntryTable${
                      hasData.value.image ? '_wi' : ''
                    }${hasData.value.status ? '_ws' : ''}
                relative grid grid-cols-1 py-5 border-b border-dark border-opacity-20 gap-5 text-base leading-tight -tracking-0.01 items-center justify-between first:hidden md:grid-cols-[minmax(100px,0.1fr),minmax(100px,0.1fr),0.8fr,145px] md:first:grid md:border-grey md:border-opacity-50 md:relative md:first:font-semibold`}
                    style={`z-index: ${props.entries.length - entryLiteIndex}`}
                  >
                    {hasData.value.image ? (
                      <div
                        class="col-start-1 before:content-[attr(data-column-name)] before:w-15 before:inline-block before:font-semibold before:text-grey before:text-xs before:leading-tight before:mr-5 md:col-start-[unset] md:before:hidden"
                        data-column-name="Image"
                      >
                        {entryLite.image ? (
                          <BCMSImage
                            class="object-cover w-20 h-20 inline md:w-[80px] md:h-[80px] rounded-2.5"
                            media={entryLite.image}
                            alt={entryLite.title}
                          />
                        ) : (
                          ''
                        )}
                      </div>
                    ) : (
                      ''
                    )}
                    <div
                      class="col-start-1 before:content-[attr(data-column-name)] before:w-15 before:inline-block before:font-semibold before:text-grey before:text-xs before:leading-tight before:mr-5 md:col-start-[unset] md:before:hidden"
                      data-column-name="Created At"
                    >
                      <BCMSTimestampDisplay timestamp={entryLite.createdAt} />
                    </div>
                    <div
                      class="col-start-1 before:content-[attr(data-column-name)] before:w-15 before:inline-block before:font-semibold before:text-grey before:text-xs before:leading-tight before:mr-5 md:col-start-[unset] md:before:hidden"
                      data-column-name="Updated At"
                    >
                      <BCMSTimestampDisplay timestamp={entryLite.updatedAt} />
                    </div>
                    {hasData.value.status ? (
                      <div
                        class="col-start-1 before:content-[attr(data-column-name)] before:w-15 before:inline-block before:font-semibold before:text-grey before:text-xs before:leading-tight before:mr-5 md:col-start-[unset] md:before:hidden"
                        data-column-name="Status"
                      >
                        <span>{entryLite.status || ''}</span>
                      </div>
                    ) : (
                      ''
                    )}
                    <div
                      class="col-start-1 before:content-[attr(data-column-name)] before:w-15 before:inline-block before:font-semibold before:text-grey before:text-xs before:leading-tight before:mr-5 md:col-start-[unset] md:before:hidden"
                      data-column-name="Title"
                      title={entryLite.title}
                    >
                      <span>{entryLite.title}</span>
                      {entryLite.subtitle ? (
                        <div class="text-grey">{entryLite.subtitle}</div>
                      ) : (
                        ''
                      )}
                    </div>
                    <div class="mb-auto flex col-start-2 col-end-3 row-start-1 row-end-3 items-center items-end md:mb-0 md:col-start-[unset] md:col-end-[unset] md:row-start-[unset] md:row-end-[unset] md:flex-row md:items-center">
                      <BCMSLink
                        disabled={!props.policy.put}
                        cyTag="edit"
                        href={`/dashboard/t/${props.template.cid}/e/${entryLite.cid}`}
                        class={`group rounded-3.5 transition-shadow duration-300 flex items-center font-medium text-base leading-normal -tracking-0.01 whitespace-normal no-underline border border-solid select-none ${
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
