<script lang="tsx">
import {
  BCMSEntryLite,
  BCMSLanguage,
  BCMSTemplate,
} from '@becomes/cms-sdk/types';
import { defineComponent, PropType } from '@vue/runtime-core';
import BCMSTimestampDisplay from '../timestamp-display.vue';
import BCMSLink from '../link.vue';
import BCMSIcon from '../icon.vue';
import { BCMSOverflowMenu, BCMSOverflowMenuItem } from '../overflow';
import { BCMSEmptyStateIllustration } from '..';

const component = defineComponent({
  props: {
    template: { type: Object as PropType<BCMSTemplate>, required: true },
    entries: { type: Array as PropType<BCMSEntryLite[]>, required: true },
    visibleLanguage: {
      type: Object as PropType<{ data: BCMSLanguage; index: number }>,
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
            <ul v-cy={'entries-list'} class="list-none">
              <li class="grid grid-cols-1 py-5 border-b border-dark border-opacity-20 gap-5 text-base leading-tight -tracking-0.01 items-center justify-between first:hidden md:grid-cols-[minmax(100px,0.1fr),minmax(100px,0.1fr),0.8fr,145px] md:first:grid md:border-grey md:border-opacity-50 md:relative md:first:font-semibold">
                <div>
                  <span>Created At</span>
                </div>
                <div>
                  <span>Updated At</span>
                </div>
                <div class="truncate">
                  <span>Title</span>
                </div>
              </li>
              {props.entries.map((entryLite, entryLiteIndex) => {
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
                        cyTag="edit"
                        href={`/dashboard/t/${props.template.cid}/e/${entryLite.cid}`}
                        class="group mb-2.5 rounded-3.5 transition-shadow duration-300 flex items-center font-medium text-base leading-normal -tracking-0.01 whitespace-normal no-underline border border-solid select-none disabled:cursor-not-allowed bg-light border-light text-dark text-opacity-80 hover:shadow-btnAlternate hover:text-dark hover:text-opacity-100 focus:shadow-btnAlternate focus:text-dark focus:text-opacity-100 active:shadow-btnAlternate active:text-dark active:text-opacity-100 disabled:opacity-50 py-1.5 px-3.5 md:mb-0 md:mr-5 "
                      >
                        <BCMSIcon
                          class="text-sm mr-5 w-5 h-5 text-grey fill-current transition-colors duration-200 group-hover:text-green group-focus-visible:text-green"
                          src="/edit"
                        />
                        <span class="relative z-10 transition-colors duration-200">
                          Edit
                        </span>
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
