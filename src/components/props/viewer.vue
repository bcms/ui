<script lang="tsx">
import { computed, defineComponent, onMounted, PropType } from 'vue';
import type {
  BCMSProp,
  BCMSPropEntryPointerData,
  BCMSPropGroupPointerData,
} from '@becomes/cms-sdk/types';
import { BCMSPropType } from '@becomes/cms-sdk/types';
import BCMSButton from '../button.vue';
import BCMSIcon from '../icon.vue';
import BCMSLink from '../link.vue';
import { BCMSOverflowMenu, BCMSOverflowMenuItem } from '../overflow';

const component = defineComponent({
  props: {
    name: {
      type: String,
      required: true,
    },
    props: { type: Array as PropType<BCMSProp[]>, required: true },
    whereIsItUsedAvailable: Boolean,
  },
  emits: {
    add: () => {
      return true;
    },
    deleteEntity: () => {
      return true;
    },
    whereIsItUsed: () => {
      return true;
    },
    propMove: (_data: { direction: -1 | 1; index: number }) => {
      return true;
    },
    propEdit: (_index: number) => {
      return true;
    },
    propDelete: (_index: number) => {
      return true;
    },
  },
  setup(props, ctx) {
    const throwable = window.bcms.util.throwable;
    const stringUtil = window.bcms.util.string;
    const store = window.bcms.vue.store;
    const groups = computed(() => {
      return store.getters.group_items;
    });
    const templates = computed(() => {
      return store.getters.template_items;
    });

    const logic = {
      getGroupLabel(prop: BCMSProp): string {
        const group = groups.value.find(
          (e) => e._id === (prop.defaultData as BCMSPropGroupPointerData)._id
        );
        return group
          ? `${group.label}${prop.array ? ' Array' : ''}`
          : 'Loading ...';
      },
      getTemplateLabel(prop: BCMSProp): string {
        const template = templates.value.find((e) =>
          (prop.defaultData as BCMSPropEntryPointerData[]).find(
            (d) => d.templateId === e._id
          )
        );
        return template
          ? `${template.label}${prop.array ? ' Array' : ''}`
          : 'Loading ...';
      },
      getTemplateLabelById(id: string): string {
        const template = templates.value.find((e) => e._id === id);
        return template ? `${template.label}` : 'Loading ...';
      },
    };

    onMounted(async () => {
      if (groups.value.length === 0) {
        await throwable(async () => {
          return await window.bcms.sdk.group.getAll();
        });
      }
      if (templates.value.length === 0) {
        await throwable(async () => {
          return await window.bcms.sdk.template.getAll();
        });
      }
    });

    return () => (
      <div>
        <div class="grid grid-cols-1 gap-5 text-base leading-tight -tracking-0.01 justify-between items-center mb-12 xl:grid-cols-[auto,1fr]">
          <div class="flex items-center flex-wrap max-w-max">
            <BCMSButton
              cyTag="add-prop-button"
              class="mr-2.5 mb-3.5"
              onClick={() => {
                ctx.emit('add');
              }}
            >
              Add property
            </BCMSButton>
            <BCMSButton
              cyTag="delete-manager-button"
              class="mr-2.5 mb-3.5"
              kind="danger"
              onClick={() => {
                ctx.emit('deleteEntity');
              }}
            >
              Delete
            </BCMSButton>
            {props.whereIsItUsedAvailable ? (
              <BCMSButton
                cyTag="where-is-it-used-button"
                class="mb-3.5 hover:shadow-none focus:shadow-none"
                kind="ghost"
                onClick={() => {
                  ctx.emit('whereIsItUsed');
                }}
              >
                <span>See where is it used</span>
              </BCMSButton>
            ) : (
              ''
            )}
          </div>
          <p class="text-left mb-3.5 xl:text-right">
            {props.props.length || 'No'}&nbsp; properties in this&nbsp;
            {props.name}
          </p>
        </div>
        {props.props.length > 0 ? (
          <ul class="list-none pb-5">
            <li class="hidden relative font-semibold border-b border-dark border-opacity-20 grid-cols-1 py-5 md:grid md:grid-cols-[minmax(170px,0.4fr),minmax(120px,0.4fr),0.2fr,30px] md:py-[15px] md:border-grey md:border-opacity-50">
              <div class="flex items-center">
                <span class="max-w-max mr-4 md:min-w-[50px]" />
                <span class="truncate">Label</span>
              </div>
              <div class="truncate">Name</div>
              <div class="flex items-center" style="word-break: break-all;">
                <span class="truncate">Type</span>
              </div>
            </li>
            {props.props.map((prop, propIndex) => {
              return (
                <li
                  class="relative border-b border-dark border-opacity-20 grid gap-5 grid-cols-1 py-5 md:grid-cols-[minmax(170px,0.4fr),minmax(120px,0.4fr),0.2fr,30px] md:py-[15px] md:border-grey md:border-opacity-50"
                  style={`z-index: ${props.props.length - propIndex}`}
                >
                  <div
                    class="flex items-center before:content-[attr(data-column-name)] before:w-15 before:inline-block before:font-semibold before:text-grey before:text-xs before:leading-tight col-start-1 col-end-2 md:col-start-[unset] md:col-end-[unset] md:before:hidden"
                    data-column-name="Label"
                    title={prop.label}
                  >
                    <span
                      v-cy={prop.required ? 'required' : 'not-required'}
                      class="max-w-max mr-4 md:min-w-[50px]"
                    >
                      {prop.required ? (
                        <BCMSIcon
                          src="/lock"
                          class="text-base fill-current w-6"
                        />
                      ) : (
                        <BCMSIcon
                          src="/unlock"
                          class="text-base fill-current w-6"
                        />
                      )}
                    </span>
                    <div>
                      <span class="truncate">{prop.label}</span>
                      <div class="text-grey text-xs">{prop.id}</div>
                    </div>
                  </div>
                  <div
                    class="truncate before:content-[attr(data-column-name)] before:w-15 before:inline-block before:font-semibold before:text-grey before:text-xs before:leading-tight col-start-1 col-end-2 md:col-start-[unset] md:col-end-[unset] md:before:hidden"
                    data-column-name="Name"
                    title={prop.name}
                  >
                    {prop.name}
                  </div>
                  <div
                    class="flex items-center before:content-[attr(data-column-name)] before:w-15 before:inline-block before:font-semibold before:text-grey before:text-xs before:leading-tight col-start-1 col-end-2 md:col-start-[unset] md:col-end-[unset] md:before:hidden"
                    style="word-break: break-all;"
                    data-column-name="Type"
                  >
                    {prop.type == BCMSPropType.GROUP_POINTER &&
                    groups.value.length > 0 ? (
                      <BCMSLink
                        href={`/dashboard/g/${
                          groups.value.find(
                            (e) =>
                              (prop.defaultData as BCMSPropGroupPointerData)
                                ._id === e._id
                          )?.cid
                        }`}
                        tooltip={
                          prop.array ? 'Group Pointer Array' : 'Group Pointer'
                        }
                        class="no-underline text-green relative font-semibold flex items-center hover:underline focus-visible:underline"
                      >
                        <BCMSIcon
                          src="/link"
                          class="absolute w-5 text-green fill-current top-1/2 -right-7.5 -translate-y-1/2 md:right-[unset] md:-left-7.5"
                        />
                        <span class="truncate">
                          {logic.getGroupLabel(prop)}
                        </span>
                      </BCMSLink>
                    ) : prop.type === BCMSPropType.ENTRY_POINTER &&
                      templates.value.length > 0 ? (
                      <>
                        {(prop.defaultData as BCMSPropEntryPointerData[]).map(
                          (info) => {
                            return (
                              <BCMSLink
                                href={`/dashboard/t/${
                                  templates.value.find(
                                    (e) => e._id === info.templateId
                                  )?.cid
                                }`}
                                tooltip={
                                  prop.array
                                    ? 'Entry Pointer Array'
                                    : 'Entry Pointer'
                                }
                                class="no-underline text-green relative font-semibold flex items-center hover:underline focus-visible:underline"
                              >
                                <BCMSIcon
                                  src="/link"
                                  class="absolute w-5 text-green fill-current top-1/2 -right-7.5 -translate-y-1/2 md:right-[unset] md:-left-7.5"
                                />
                                <span class="truncate">
                                  {logic.getTemplateLabelById(info.templateId)}
                                </span>
                              </BCMSLink>
                            );
                          }
                        )}
                      </>
                    ) : (
                      <>
                        <span class="truncate">
                          {stringUtil.toPretty(prop.type)}
                        </span>
                        <span class="ml-[5px] truncate">
                          {prop.array ? 'Array' : ''}{' '}
                        </span>
                      </>
                    )}
                  </div>
                  {(props.name === 'template' &&
                    prop.name !== 'title' &&
                    prop.name !== 'slug') ||
                  props.name !== 'template' ? (
                    <BCMSOverflowMenu
                      cyTag="prop-overflow"
                      position="right"
                      class="col-start-2 col-end-3 row-start-1 md:col-start-[unset] md:col-end-[unset] md:row-start-[unset]"
                    >
                      {(props.name === 'template' &&
                        props.props.length > 1 &&
                        propIndex > 0 &&
                        props.props[propIndex - 1].name !== 'slug') ||
                      (props.name !== 'template' &&
                        props.props.length > 1 &&
                        propIndex > 0) ? (
                        <BCMSOverflowMenuItem
                          cyTag="prop-overflow-mu"
                          text="Move up"
                          icon="arrow-up"
                          onClick={() => {
                            ctx.emit('propMove', {
                              direction: -1,
                              index: propIndex,
                            });
                          }}
                        />
                      ) : (
                        ''
                      )}
                      {propIndex < props.props.length - 1 ? (
                        <BCMSOverflowMenuItem
                          cyTag="prop-overflow-md"
                          text="Move down"
                          icon="arrow-down"
                          onClick={() => {
                            ctx.emit('propMove', {
                              direction: 1,
                              index: propIndex,
                            });
                          }}
                        />
                      ) : (
                        ''
                      )}
                      <BCMSOverflowMenuItem
                        cyTag="prop-overflow-edit"
                        text="Edit"
                        icon="edit"
                        onClick={() => {
                          ctx.emit('propEdit', propIndex);
                        }}
                      />
                      <BCMSOverflowMenuItem
                        cyTag="prop-overflow-del"
                        text="Delete"
                        icon="trash"
                        onClick={() => {
                          ctx.emit('propDelete', propIndex);
                        }}
                      />
                    </BCMSOverflowMenu>
                  ) : (
                    ''
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <div class="text-grey text-2xl mt-7.5">
            Click "Add property" to start building this
            {' ' + props.name}
          </div>
        )}
      </div>
    );
  },
});
export default component;
</script>
