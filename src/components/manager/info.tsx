import { computed, defineComponent, ref } from 'vue';
import { DefaultComponentProps } from '../_default';
import BCMSIcon from '../icon';
import BCMSMarkdownDisplay from '../markdown-display';
import { BCMSTextInput, BCMSMarkdownInput } from '../input';
import BCMSButton from '../button';
import BCMSTimestampDisplay from '../timestamp-display';
import { useRoute } from 'vue-router';
import type {
  BCMSGroup,
  BCMSTemplate,
  BCMSWidget,
} from '@becomes/cms-sdk/types';
import { useTranslation } from '../../translations';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    createdAt: {
      type: Number,
      required: true,
    },
    updatedAt: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  emits: {
    edit: () => {
      return true;
    },
  },
  setup(props, ctx) {
    const translations = computed(() => {
      return useTranslation();
    });
    // const dateUtil = useDateUtility();
    const route = useRoute();
    const throwable = window.bcms.util.throwable;
    const store = window.bcms.vue.store;

    const titleEditing = ref(false);
    const descriptionEditing = ref(false);

    const newTitle = ref(props.name);
    const newDescription = ref(props.description);

    // const createdAt = computed(() => {
    //   return dateUtil.prettyElapsedTimeSince(props.createdAt);
    // });
    // const updatedAt = computed(() => {
    //   return dateUtil.prettyElapsedTimeSince(props.updatedAt);
    // });

    const isEditing = computed(() => {
      return titleEditing.value || descriptionEditing.value;
    });

    const logic = {
      getManagerName() {
        const name = route.path.split('/')[2];
        switch (name) {
          case 't': {
            return 'Template';
          }
          case 'g': {
            return 'Group';
          }
          case 'w': {
            return 'Widget';
          }
          case 'key-manager': {
            return 'Key';
          }
        }
      },
    };

    async function saveEdit() {
      await throwable(async () => {
        const name = logic.getManagerName();
        const managerName:
          | 'template'
          | 'group'
          | 'widget'
          | 'apiKey'
          | undefined = name
          ? name.toLowerCase() === 'key'
            ? 'apiKey'
            : (name.toLowerCase() as 'template' | 'group' | 'widget')
          : undefined;

        if (managerName) {
          const managerId = store.getters[`${managerName}_findOne`]((e) => {
            if (managerName === 'apiKey') {
              return e._id === (route.params.kid as string);
            } else {
              return (
                (e as BCMSTemplate | BCMSGroup | BCMSWidget).cid ===
                (route.params[`${route.path.split('/')[2]}id`] as string)
              );
            }
          })?._id;

          if (managerId) {
            if (
              (descriptionEditing.value &&
                newDescription.value !== props.description) ||
              (titleEditing.value && newTitle.value !== props.name)
            ) {
              const objToUpdate = {
                _id: managerId,
                desc: descriptionEditing.value
                  ? newDescription.value
                  : props.description,
                label: titleEditing.value ? newTitle.value : props.name,
                name: titleEditing.value ? newTitle.value : props.name,
              };

              await window.bcms.sdk[managerName].update(objToUpdate);
            }
          }
        }
      });

      titleEditing.value = false;
      descriptionEditing.value = false;
    }

    return () => (
      <div
        class={`managerInfo ${
          logic.getManagerName() === 'Key' ? 'block' : 'grid'
        } grid-cols-1 justify-between gap-10 my-7.5 sm:grid-cols-[1fr,auto] sm:mb-10 md:mb-14 desktop:mt-0 desktop:grid-cols-1 lg:mb-[70px] xl:grid-cols-[0.6fr,0.4fr] xl:gap-5`}
      >
        <div
          class={`${
            logic.getManagerName() === 'Key' ? 'mb-[35px]' : ''
          } min-w-[225px]`}
        >
          <div class="flex items-center mb-[25px]">
            {titleEditing.value ? (
              <BCMSTextInput
                placeholder={`${logic.getManagerName()}'s label`}
                invalidText={
                  !newTitle.value
                    ? translations.value.page.manager.info.error.emptyLabel
                    : ''
                }
                v-model={newTitle.value}
                onEnter={() => {
                  saveEdit();
                }}
                onVnodeMounted={(e) => {
                  const inputEl = (e.el as HTMLElement).querySelector('input');
                  if (inputEl) {
                    inputEl.focus();
                  }
                }}
              />
            ) : (
              <h1
                class="text-9.5 leading-none font-normal -tracking-0.01 select-none dark:text-light"
                tabindex="0"
                onDblclick={() => {
                  titleEditing.value = true;
                }}
              >
                {props.name}
              </h1>
            )}
            <button
              v-cy={'edit-button'}
              class="items-center hidden ml-5 group lg:flex"
              onClick={() => {
                ctx.emit('edit');
              }}
            >
              <BCMSIcon
                src="/edit"
                class="w-6 h-6 transition-colors duration-300 fill-current text-grey group-hover:text-dark group-focus-visible:text-dark dark:group-hover:text-light dark:group-focus-visible:text-light"
              />
            </button>
          </div>
          {props.description ? (
            descriptionEditing.value ? (
              <BCMSMarkdownInput
                placeholder={`${logic.getManagerName()}'s description`}
                v-model={newDescription.value}
                helperText={
                  translations.value.page.manager.info.input.description
                    .helperText
                }
                class="max-w-[600px]"
                minHeight={150}
                onVnodeMounted={(e) => {
                  newTitle.value = props.name;
                  const textareaEl = (e.el as HTMLElement).querySelector(
                    'textarea'
                  );
                  if (textareaEl) {
                    textareaEl.focus();
                  }
                }}
              />
            ) : (
              <BCMSMarkdownDisplay
                cyTag="description-double-click"
                class="mr-5"
                markdown={props.description}
                onEdit={() => {
                  descriptionEditing.value = true;
                }}
              />
            )
          ) : descriptionEditing.value ? (
            <BCMSMarkdownInput
              placeholder={`${logic.getManagerName()}'s description`}
              v-model={newDescription.value}
              helperText={
                translations.value.page.manager.info.input.description
                  .helperText
              }
              class="max-w-[600px]"
              minHeight={150}
              onVnodeMounted={(e) => {
                newDescription.value = props.description;
                const textareaEl = (e.el as HTMLElement).querySelector(
                  'textarea'
                );
                if (textareaEl) {
                  textareaEl.focus();
                }
              }}
            />
          ) : (
            <div class="hidden lg:block">
              <div
                class="markdownBoxDisplay text-grey text-base leading-tight -tracking-0.01 select-none cursor-default inline-block mr-5"
                tabindex="0"
                onDblclick={() => {
                  descriptionEditing.value = true;
                }}
              >
                {translations.value.page.manager.info.clickToDescribe({
                  label: logic.getManagerName() as string,
                })}
              </div>
              {logic.getManagerName() !== 'Key' && (
                <BCMSButton
                  kind="alternate"
                  class="managerInfo--showExampleBtn"
                  onClick={() => {
                    window.bcms.modal.showDescriptionExample.show({});
                  }}
                >
                  {translations.value.page.manager.info.actions.showExamples}
                </BCMSButton>
              )}
            </div>
          )}
          {isEditing.value && (
            <BCMSButton
              class="block mt-3"
              size="m"
              onClick={() => {
                saveEdit();
              }}
            >
              {translations.value.page.manager.info.actions.done}
            </BCMSButton>
          )}
        </div>
        <div class="hidden lg:block">
          <p class="flex text-sm leading-tight">
            <span class="inline-block min-w-[70px] mr-[25px] -tracking-0.01 mb-2.5 dark:text-grey">
              {translations.value.page.manager.info.table.id}
            </span>
            <span class="text-grey">{props.id}</span>
          </p>
          <p class="flex text-sm leading-tight">
            <span class="inline-block min-w-[70px] mr-[25px] -tracking-0.01 mb-2.5 dark:text-grey">
              {translations.value.page.manager.info.table.created}
            </span>
            <span class="text-grey">
              <BCMSTimestampDisplay timestamp={props.createdAt} />
            </span>
          </p>
          <p class="flex text-sm leading-tight">
            <span class="inline-block min-w-[70px] mr-[25px] -tracking-0.01 mb-2.5 dark:text-grey">
              {translations.value.page.manager.info.table.updated}
            </span>
            <span class="text-grey">
              <BCMSTimestampDisplay timestamp={props.updatedAt} />
            </span>
          </p>
        </div>
      </div>
    );
  },
});

export default component;
