<script lang="tsx">
import { computed, defineComponent, ref } from 'vue';
import { DefaultComponentProps } from '../_default';
import BCMSIcon from '../icon.vue';
import BCMSMarkdownDisplay from '../markdown-display.vue';
import { BCMSTextInput, BCMSMarkdownInput, BCMSButton } from '../index';
import BCMSTimestampDisplay from '../timestamp-display.vue';
import { useRoute } from 'vue-router';
import { useThrowable } from '../../util';
import { useBcmsStore } from '../../store';

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
    // const dateUtil = useDateUtility();
    const route = useRoute();
    const throwable = useThrowable();
    const store = useBcmsStore();

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
        }
      },
    };

    async function saveEdit() {
      await throwable(async () => {
        const templateId = store.getters.template_findOne(
          (e) => e.cid === (route.params.tid as string)
        )?._id;

        if (templateId) {
          if (
            (descriptionEditing.value &&
              newDescription.value !== props.description) ||
            (titleEditing.value && newTitle.value !== props.name)
          ) {
            await window.bcms.sdk.template.update({
              _id: templateId,
              desc: descriptionEditing.value
                ? newDescription.value
                : props.description,
              label: titleEditing.value ? newTitle.value : props.name,
            });
          }
        }
      });

      titleEditing.value = false;
      descriptionEditing.value = false;
    }

    return () => (
      <div class="managerInfo managerInfo--cols grid justify-between gap-10 my-[30px] sm:mb-10 md:mb-14 desktop:mt-0 lg:mb-[70px] xl:gap-5">
        <div class="managerInfo--col managerInfo--col_left min-w-[225px]">
          <div class="flex items-center mb-[25px]">
            {titleEditing.value ? (
              <BCMSTextInput
                placeholder={`${logic.getManagerName()}'s label`}
                invalidText={!newTitle.value ? 'Label cannot be empty' : ''}
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
              <h2
                class="text-[38px] leading-none font-normal -tracking-0.01 select-none"
                tabindex="0"
                onDblclick={() => {
                  titleEditing.value = true;
                }}
              >
                {props.name}
              </h2>
            )}
            <button
              v-cy={'edit-button'}
              class="group flex items-center ml-5"
              onClick={() => {
                ctx.emit('edit');
              }}
            >
              <BCMSIcon
                src="/edit"
                class="w-6 text-grey fill-current transition-colors duration-300 group-hover:text-dark group-focus-visible:text-dark"
              />
            </button>
          </div>
          {props.description ? (
            descriptionEditing.value ? (
              <BCMSMarkdownInput
                placeholder={`${logic.getManagerName()}'s description`}
                v-model={newDescription.value}
                helperText="Supports markdown"
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
              helperText="Supports markdown"
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
            <>
              <div
                class="markdownBoxDisplay text-grey text-base leading-tight -tracking-0.01 select-none cursor-default inline-block mr-5"
                tabindex="0"
                onDblclick={() => {
                  descriptionEditing.value = true;
                }}
              >
                Double click here to describe this {logic.getManagerName()}
              </div>
              <BCMSButton
                kind="alternate"
                class="managerInfo--showExampleBtn hidden md:inline-block"
                onClick={() => {
                  window.bcms.modal.showDescriptionExample.show({});
                }}
              >
                Show examples
              </BCMSButton>
            </>
          )}
          {isEditing.value && (
            <BCMSButton
              class="managerInfo--doneEditBtn mt-3 block"
              size="m"
              onClick={() => {
                saveEdit();
              }}
            >
              Done
            </BCMSButton>
          )}
        </div>
        <div class="managerInfo--col managerInfo--col_right">
          <p class="text-sm leading-tight flex">
            <span class="inline-block min-w-[70px] mr-[25px] -tracking-0.01 mb-2.5">
              ID
            </span>
            <span class="text-grey">{props.id}</span>
          </p>
          <p class="text-sm leading-tight flex">
            <span class="inline-block min-w-[70px] mr-[25px] -tracking-0.01 mb-2.5">
              Created
            </span>
            <span class="text-grey">
              <BCMSTimestampDisplay timestamp={props.createdAt} />
            </span>
          </p>
          <p class="text-sm leading-tight flex">
            <span class="inline-block min-w-[70px] mr-[25px] -tracking-0.01 mb-2.5">
              Updated
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
</script>
