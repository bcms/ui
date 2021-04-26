<script lang="tsx">
import { computed, defineComponent, PropType, reactive } from 'vue';
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
    props = reactive(props);
    const createdAt = computed(() => {
      return (
        '' +
        window.bcms.services.general.date.prettyElapsedTimeSince(
          props.createdAt
        )
      );
    });
    const updatedAt = computed(() => {
      return (
        '' +
        window.bcms.services.general.date.prettyElapsedTimeSince(
          props.updatedAt
        )
      );
    });
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
            <span class="managerInfo--basicInfo-value" title={createdAt.value}>
              {createdAt.value}
            </span>
          </p>
          <p class="managerInfo--basicInfo">
            <span class="managerInfo--basicInfo-title mb-10">Updated at</span>
            <span class="managerInfo--basicInfo-value" title={updatedAt.value}>
              {updatedAt.value}
            </span>
          </p>
        </div>
      </div>
    );
  },
});
export default component;
</script>
