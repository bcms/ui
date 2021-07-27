<script lang="tsx">
import {
  BCMSEntryLite,
  BCMSLanguage,
  BCMSTemplate,
} from '@becomes/cms-sdk/types';
import { defineComponent, PropType } from '@vue/runtime-core';
import { BCMSSelect } from '../input';
import BCMSTimestampDisplay from '../timestamp-display.vue';
import BCMSLink from '../link.vue';
import BCMSIcon from '../icon.vue';
import { BCMSOverflowMenu, BCMSOverflowMenuItem } from '../overflow';

const component = defineComponent({
  props: {
    template: { type: Object as PropType<BCMSTemplate>, required: true },
    entries: { type: Array as PropType<BCMSEntryLite[]>, required: true },
    languages: { type: Array as PropType<BCMSLanguage[]>, required: true },
    visibleLanguage: {
      type: Object as PropType<{ data: BCMSLanguage; index: number }>,
      required: true,
    },
    onSelectLanguage: Function as PropType<
      (id: string) => void | Promise<void>
    >,
    onRemove: Function as PropType<
      (entryLite: BCMSEntryLite) => void | Promise<void>
    >,
    onDuplicate: Function as PropType<
      (entryLite: BCMSEntryLite) => void | Promise<void>
    >,
  },
  emits: {
    selectLanguage: (_: string) => {
      return true;
    },
    remove: (_: BCMSEntryLite) => {
      return true;
    },
    duplicate: (_: BCMSEntryLite) => {
      return true;
    },
  },
  setup(props, ctx) {
    function getEntryTitle(entryLite: BCMSEntryLite): string {
      if (entryLite.meta[props.visibleLanguage.index]) {
        const title = (
          entryLite.meta[props.visibleLanguage.index].props[0].data as string[]
        )[0];
        if (title) {
          return title;
        }
      }
      return 'No given title';
    }

    return () => (
      <>
        {props.entries.length > 0 ? (
          <>
            {props.languages.length > 1 ? (
              <BCMSSelect
                cyTag="select-lang"
                label="Select language"
                selected={props.visibleLanguage.data._id}
                options={props.languages.map((e) => {
                  return { label: `${e.name}`, value: e._id };
                })}
                onChange={(option) => {
                  ctx.emit('selectLanguage', option.value);
                }}
              />
            ) : (
              ''
            )}
            <ul v-cy={'entries-list'} class="entryOverview--entries">
              <li class="entryOverview--entries-item entryOverview--cols">
                <div class="entryOverview--entries-createdAt">
                  <span>Created At</span>
                </div>
                <div class="entryOverview--entries-updatedAt">
                  <span>Updated At</span>
                </div>
                <div class="entryOverview--entries-title">
                  <span>Title</span>
                </div>
              </li>
              {props.entries.map((entryLite, entryLiteIndex) => {
                return (
                  <li
                    v-cy={`item-${entryLiteIndex}`}
                    class="entryOverview--entries-item entryOverview--cols"
                  >
                    <div
                      class="entryOverview--entries-item-col entryOverview--entries-createdAt"
                      data-column-name="Created At"
                    >
                      <BCMSTimestampDisplay timestamp={entryLite.createdAt} />
                    </div>
                    <div
                      class="entryOverview--entries-item-col entryOverview--entries-createdAt"
                      data-column-name="Updated At"
                    >
                      <BCMSTimestampDisplay timestamp={entryLite.updatedAt} />
                    </div>
                    <div
                      class="entryOverview--entries-item-col entryOverview--entries-title"
                      data-column-name="Title"
                      title={getEntryTitle(entryLite)}
                    >
                      <span>{getEntryTitle(entryLite)}</span>
                    </div>
                    <div class="entryOverview--entries-actions">
                      <BCMSLink
                        cyTag="edit"
                        href={`/dashboard/t/${props.template.cid}/e/${entryLite.cid}`}
                        class="entryOverview--entries-actions-edit bcmsButton bcmsButton_alternate bcmsButton_m"
                      >
                        <BCMSIcon class="bcmsButton--icon" src="/edit" />
                        <span>Edit</span>
                      </BCMSLink>
                      <BCMSOverflowMenu cyTag="overflow" position="right">
                        <BCMSOverflowMenuItem
                          cyTag="duplicate"
                          text="Duplicate"
                          icon="copy"
                          onClick={() => {
                            ctx.emit('duplicate', entryLite);
                          }}
                        />
                        <BCMSOverflowMenuItem
                          cyTag="view-model"
                          text="View model"
                          icon="code"
                          onClick={() => {
                            window.bcms.modal.entry.viewModel.show({
                              templateId: entryLite.templateId,
                              entryId: entryLite._id,
                            });
                          }}
                        />
                        <BCMSOverflowMenuItem
                          cyTag="remove"
                          text="Remove"
                          icon="trash"
                          onClick={() => {
                            ctx.emit('remove', entryLite);
                          }}
                        />
                      </BCMSOverflowMenu>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <div>
            <h3 class="entryOverview--entries_empty">
              There are no entries available.
            </h3>
          </div>
        )}
      </>
    );
  },
});
export default component;
</script>
