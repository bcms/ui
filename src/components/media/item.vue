<script lang="tsx">
import { defineComponent, PropType, reactive } from 'vue';
import { BCMSMedia, BCMSMediaType } from '@becomes/cms-sdk/types';
import { DefaultComponentProps } from '../_default';
import BCMSIcon from '../icon.vue';
import BCMSImage from '../image.vue';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    selected: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object as PropType<BCMSMedia>,
      required: true,
    },
  },
  emits: {
    open: () => {
      return true;
    },
    remove: () => {
      return true;
    },
  },
  setup(props, ctx) {
    props = reactive(props);
    return () => (
      <li
        class={`media--item media--item_${props.item.type} ${
          props.selected ? 'media--item_selected' : ''
        }`}
      >
        <button
          class="media--item-click"
          title={props.item.name}
          onClick={() => {
            ctx.emit('open');
          }}
        >
          {props.item.type !== BCMSMediaType.DIR ? (
            <div class="media--item-visual">
              <div class="media--item-visual-inner">
                {props.item.type === BCMSMediaType.IMG ||
                props.item.type === BCMSMediaType.VID ||
                props.item.type === BCMSMediaType.GIF ? (
                  <>
                    <BCMSImage media={props.item} alt={props.item.name} />
                    <div class="type">{props.item.type}</div>
                  </>
                ) : (
                  <BCMSIcon src="/file" />
                )}
              </div>
            </div>
          ) : (
            ''
          )}
          <div class="media--item-footer">
            {props.item.type === BCMSMediaType.DIR ? (
              <BCMSIcon class="media--item-icon" src="/folder" />
            ) : (
              ''
            )}
            <span class="media--item-name">{props.item.name}</span>
            <button
              class="media--item-delete"
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                ctx.emit('remove');
              }}
            >
              <BCMSIcon src="/trash" />
            </button>
          </div>
        </button>
      </li>
    );
  },
});
export default component;
</script>
