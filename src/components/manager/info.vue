<script lang="tsx">
import { defineComponent, PropType } from 'vue';
import { DefaultComponentProps } from '../_default';
import BCMSIcon from '../icon.vue';
import BCMSMarkdownDisplay from '../markdown-display.vue';

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
    description: String,
    onEdit: Function as PropType<() => void | Promise<void>>,
  },
  emits: {
    edit: () => {
      return true;
    },
  },
  setup(props, ctx) {
    return () => (
      <div class="managerInfo managerInfo--cols">
        <div class="managerInfo--col managerInfo--col_left">
          <div class="managerInfo--heading">
            <h2 class="managerInfo--title">{props.name}</h2>
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
            <BCMSMarkdownDisplay
              cyTag="description-double-click"
              markdown={props.description}
            />
          ) : (
            ''
          )}
        </div>
        <div class="managerInfo--col managerInfo--col_right">
          <p class="managerInfo--basicInfo">
            <span class="managerInfo--basicInfo-title mb-10">ID</span>
            <span class="managerInfo--basicInfo-value">{props.id}</span>
          </p>
          <p class="managerInfo--basicInfo">
            <span class="managerInfo--basicInfo-title mb-10">Created at</span>
            <span
              class="managerInfo--basicInfo-value"
              title={window.bcms.services.general.date.toReadable(
                props.createdAt
              )}
            >
              {window.bcms.services.general.date.prettyElapsedTimeSince(
                props.createdAt
              )}
            </span>
          </p>
          <p class="managerInfo--basicInfo">
            <span class="managerInfo--basicInfo-title mb-10">Updated at</span>
            <span
              class="managerInfo--basicInfo-value"
              title={window.bcms.services.general.date.toReadable(
                props.updatedAt
              )}
            >
              {window.bcms.services.general.date.prettyElapsedTimeSince(
                props.updatedAt
              )}
            </span>
          </p>
        </div>
      </div>
    );
  },
});
export default component;
</script>
