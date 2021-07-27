<script lang="tsx">
import { defineComponent, onBeforeUpdate, onMounted, PropType, ref } from 'vue';
import { BCMSMedia, BCMSMediaType } from '@becomes/cms-sdk/types';
import BCMSIcon from '../icon.vue';
import { useThrowable } from '../../util';

const component = defineComponent({
  props: {
    targetMediaId: {
      type: String,
      default: '',
    },
    onClick: Function as PropType<(media: BCMSMedia) => void | Promise<void>>,
  },
  emits: {
    click: (_media: BCMSMedia) => {
      return true;
    },
  },
  setup(props, ctx) {
    const throwable = useThrowable();
    let lastMediaId = '';
    const tree = ref<BCMSMedia[]>([]);

    async function getParentTree(parentId?: string): Promise<BCMSMedia[]> {
      const output: BCMSMedia[] = [];
      if (!parentId) {
        return output;
      }
      const parent: BCMSMedia | undefined = await throwable(
        async () => {
          return await window.bcms.sdk.media.getById(parentId);
        },
        async (value) => {
          return value;
        }
      );
      if (!parent) {
        return output;
      }
      output.push(parent);
      if (parent.isInRoot) {
        return output;
      }
      return [...output, ...(await getParentTree(parent.parentId))];
    }

    onMounted(async () => {
      lastMediaId = props.targetMediaId;
      tree.value = (await getParentTree(props.targetMediaId)).reverse();
    });
    onBeforeUpdate(async () => {
      if (lastMediaId !== props.targetMediaId) {
        lastMediaId = props.targetMediaId;
        tree.value = (await getParentTree(props.targetMediaId)).reverse();
      }
    });

    return () => (
      <nav class="media--breadcrumb">
        <ul class="media--breadcrumb-list">
          <li class="media--breadcrumb-list-item">
            <button
              onClick={() => {
                ctx.emit('click', {
                  _id: '',
                  type: BCMSMediaType.DIR,
                  createdAt: 0,
                  updatedAt: 0,
                  hasChildren: false,
                  isInRoot: false,
                  mimetype: '',
                  name: '',
                  parentId: '',
                  size: 0,
                  userId: '',
                });
              }}
            >
              <span>Media Manager</span>
            </button>
          </li>
          {tree.value.map((item) => {
            return (
              <li class="media--breadcrumb-list-item">
                <BCMSIcon src="/chevron/right" />
                <button
                  onClick={() => {
                    ctx.emit('click', item);
                  }}
                >
                  <span>{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  },
});
export default component;
</script>
