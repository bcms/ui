<script lang="tsx">
import { computed, defineComponent, ref } from 'vue';
import { DefaultComponentProps } from '../_default';
import BCMSIcon from '../icon.vue';
import BCMSMarkdownDisplay from '../markdown-display.vue';
import { BCMSTextInput, BCMSMarkdownInput, BCMSButton } from '../index';
import BCMSTimestampDisplay from '../timestamp-display.vue';
import { useRoute } from 'vue-router';

interface SaveData {
  label: string;
  desc: string;
}

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
    save: (_: SaveData) => {
      return true;
    },
  },
  setup(props, ctx) {
    // const dateUtil = useDateUtility();
    const route = useRoute();

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
      ctx.emit('save', {
        label: newTitle.value,
        desc: newDescription.value,
      });
      titleEditing.value = false;
      descriptionEditing.value = false;
    }

    return () => (
      <div class="managerInfo managerInfo--cols">
        <div class="managerInfo--col managerInfo--col_left">
          <div class="managerInfo--heading">
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
                class="managerInfo--title"
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
              class="managerInfo--heading-rename ml-20"
              onClick={() => {
                ctx.emit('edit');
              }}
            >
              <BCMSIcon src="/edit" />
            </button>
          </div>
          {props.description ? (
            descriptionEditing.value ? (
              <BCMSMarkdownInput
                placeholder={`${logic.getManagerName()}'s description`}
                v-model={newDescription.value}
                helperText="Supports markdown"
                onVnodeMounted={(e) => {
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
                class="markdownBoxDisplay "
                tabindex="0"
                onDblclick={() => {
                  descriptionEditing.value = true;
                }}
              >
                Double click here to describe this {logic.getManagerName()}
              </div>
              <BCMSButton
                kind="alternate"
                class="managerInfo--showExampleBtn"
                onClick={() => {
                  // window.bcms.services.modal.showDescriptionExample.show({});
                }}
              >
                Show examples
              </BCMSButton>
            </>
          )}
          {isEditing.value && (
            <BCMSButton
              class="managerInfo--doneEditBtn"
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
          <p class="managerInfo--basicInfo">
            <span class="managerInfo--basicInfo-title mb-10">ID</span>
            <span class="managerInfo--basicInfo-value">{props.id}</span>
          </p>
          <p class="managerInfo--basicInfo">
            <span class="managerInfo--basicInfo-title mb-10">Created at</span>
            <span class="managerInfo--basicInfo-value">
              <BCMSTimestampDisplay timestamp={props.createdAt} />
            </span>
          </p>
          <p class="managerInfo--basicInfo">
            <span class="managerInfo--basicInfo-title mb-10">Updated at</span>
            <span class="managerInfo--basicInfo-value">
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
