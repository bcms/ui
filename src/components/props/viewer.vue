<script lang="tsx">
import { computed, defineComponent, onMounted, PropType } from 'vue';
import {
  BCMSProp,
  BCMSPropType,
  BCMSPropGroupPointer,
  BCMSPropEntryPointer,
} from '@becomes/cms-sdk/types';
import { useRoute } from 'vue-router';
import BCMSButton from '../button.vue';
import BCMSIcon from '../icon.vue';
import BCMSLink from '../link.vue';
import { BCMSOverflowMenu, BCMSOverflowMenuItem } from '../overflow';
import { BCMSStoreMutationTypes } from '../../types';

const component = defineComponent({
  props: {
    props: { type: Array as PropType<BCMSProp[]>, required: true },
    whereIsItUsedAvailable: Boolean,
    onAdd: Function as PropType<() => void | Promise<void>>,
    onDeleteEntity: Function as PropType<() => void | Promise<void>>,
    onWhereIsItUsed: Function as PropType<() => void | Promise<void>>,
    onPropMove: Function as PropType<
      (data: { direction: -1 | 1; index: number }) => void | Promise<void>
    >,
    onPropEdit: Function as PropType<(index: number) => void | Promise<void>>,
    onPropDelete: Function as PropType<(index: number) => void | Promise<void>>,
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
    const store = window.bcms.vue.useStore();
    const route = useRoute();
    const groups = computed(() => {
      return store.getters.group_items;
    });
    const templates = computed(() => {
      return store.getters.template_items;
    });

    const logic = {
      getManagerName() {
        return route.path.split('/')[2];
      },
      getGroupLabel(prop: BCMSProp): string {
        const group = groups.value.find(
          (e) => e._id === (prop.value as BCMSPropGroupPointer)._id
        );
        return group ? group.label : 'Loading ...';
      },
      getTemplateLabel(prop: BCMSProp): string {
        const template = templates.value.find(
          (e) => e._id === (prop.value as BCMSPropEntryPointer).templateId
        );
        return template ? template.label : 'Loading ...';
      },
    };

    onMounted(async () => {
      if (groups.value.length === 0) {
        await window.bcms.services.error.wrapper(
          async () => {
            return await window.bcms.sdk.group.getAll();
          },
          async (result) => {
            store.commit(BCMSStoreMutationTypes.group_set, result);
          }
        );
      }
      if (templates.value.length === 0) {
        await window.bcms.services.error.wrapper(
          async () => {
            return await window.bcms.sdk.template.getAll();
          },
          async (result) => {
            store.commit(BCMSStoreMutationTypes.template_set, result);
          }
        );
      }
    });

    return () => (
      <div class="managerPropsEditor">
        <div class="managerPropsEditor--top managerPropsEditor--cols">
          <div class="managerPropsEditor--top-buttons">
            <BCMSButton
              cyTag="add-prop-button"
              class="mr-10"
              onClick={() => {
                ctx.emit('add');
              }}
            >
              Add property
            </BCMSButton>
            <BCMSButton
              cyTag="delete-manager-button"
              class="mr-10"
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
              {logic.getManagerName()}
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
                          href={`/dashboard/group/${
                            (prop.value as BCMSPropGroupPointer)._id
                          }`}
                        >
                          <BCMSIcon src="/link" />
                          <span>{logic.getGroupLabel(prop)}</span>
                        </BCMSLink>
                      ) : prop.type === BCMSPropType.ENTRY_POINTER &&
                        templates.value.length > 0 ? (
                        <BCMSLink
                          href={`/dashboard/template/${
                            (prop.value as BCMSPropEntryPointer).templateId
                          }`}
                        >
                          <BCMSIcon src="/link" />
                          <span>{logic.getTemplateLabel(prop)}</span>
                        </BCMSLink>
                      ) : (
                        <>
                          <span>
                            {window.bcms.services.general.string.toPretty(
                              prop.type
                            )}
                          </span>
                          <span class="ml-5">{prop.array ? 'Array' : ''} </span>
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
              {logic.getManagerName()}
            </div>
          )}
        </div>
      </div>
    );
  },
});
export default component;
</script>
