<script lang="tsx">
import { computed, defineComponent, onMounted, PropType } from 'vue';
import {
  BCMSProp,
  BCMSPropEntryPointerData,
  BCMSPropGroupPointerData,
  BCMSPropType,
} from '@becomes/cms-sdk/types';
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
        const template = templates.value.find(
          (e) =>
            e._id === (prop.defaultData as BCMSPropEntryPointerData).templateId
        );
        return template
          ? `${template.label}${prop.array ? ' Array' : ''}`
          : 'Loading ...';
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
      <div class="managerPropsEditor">
        <div class="managerPropsEditor--top managerPropsEditor--cols">
          <div class="managerPropsEditor--top-buttons">
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
          <p class="managerPropsEditor--top-propsCount">
            {props.props.length || 'No'}&nbsp; properties in this&nbsp;
            <span class="managerPropsEditor--top-managerName">
              {props.name}
            </span>
          </p>
        </div>
        <div class="managerPropsEditor--bottom">
          {props.props.length > 0 ? (
            <ul class="managerPropsEditor--list">
              <li class="managerPropsEditor--list-item managerPropsEditor--cols">
                <div class="managerPropsEditor--list-label">
                  <span />
                  <span>Label</span>
                </div>
                <div class="managerPropsEditor--list-name">Name</div>
                <div class="managerPropsEditor--list-type">
                  <span>Type</span>
                </div>
              </li>
              {props.props.map((prop, propIndex) => {
                return (
                  <li class="managerPropsEditor--list-item managerPropsEditor--cols">
                    <div
                      class="managerPropsEditor--list-label managerPropsEditor--list-item-col"
                      data-column-name="Label"
                      title={prop.label}
                    >
                      <span v-cy={prop.required ? 'required' : 'not-required'}>
                        {prop.required ? (
                          <BCMSIcon src="/lock" />
                        ) : (
                          <BCMSIcon src="/unlock" />
                        )}
                      </span>
                      <span>{prop.label}</span>
                    </div>
                    <div
                      class="managerPropsEditor--list-name managerPropsEditor--list-item-col"
                      data-column-name="Name"
                      title={prop.name}
                    >
                      {prop.name}
                    </div>
                    <div
                      class={`managerPropsEditor--list-type managerPropsEditor--list-item-col ${
                        prop.type === BCMSPropType.GROUP_POINTER ||
                        prop.type === BCMSPropType.ENTRY_POINTER
                          ? 'managerPropsEditor--list-type_link'
                          : ''
                      }`}
                      data-column-name="Type"
                    >
                      {prop.type === BCMSPropType.GROUP_POINTER &&
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
                        >
                          <BCMSIcon src="/link" />
                          <span>{logic.getGroupLabel(prop)}</span>
                        </BCMSLink>
                      ) : prop.type === BCMSPropType.ENTRY_POINTER &&
                        templates.value.length > 0 ? (
                        <BCMSLink
                          href={`/dashboard/t/${
                            templates.value.find(
                              (e) =>
                                e._id ===
                                (prop.defaultData as BCMSPropEntryPointerData)
                                  .templateId
                            )?.cid
                          }`}
                          tooltip={
                            prop.array ? 'Entry Pointer Array' : 'Entry Pointer'
                          }
                        >
                          <BCMSIcon src="/link" />
                          <span>{logic.getTemplateLabel(prop)}</span>
                        </BCMSLink>
                      ) : (
                        <>
                          <span>{stringUtil.toPretty(prop.type)}</span>
                          <span class="ml-[5px]">
                            {prop.array ? 'Array' : ''}{' '}
                          </span>
                        </>
                      )}
                    </div>
                    {prop.name !== 'title' && prop.name !== 'slug' ? (
                      <BCMSOverflowMenu cyTag="prop-overflow" position="right">
                        {props.props.length > 1 &&
                        propIndex > 0 &&
                        props.props[propIndex - 1].name !== 'slug' ? (
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
            <div class="managerPropsEditor--empty">
              Click "Add property" to start building this
              {' ' + props.name}
            </div>
          )}
        </div>
      </div>
    );
  },
});
export default component;
</script>
