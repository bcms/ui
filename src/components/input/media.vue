<script lang="tsx">
import { defineComponent, PropType } from 'vue';
import { DefaultComponentProps } from '../_default';
import BCMSImage from '../image.vue';
import BCMSIcon from '../icon.vue';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    value: {
      type: String,
      default: '',
    },
    invalidText: {
      type: String,
      default: '',
    },
    onClick: Function as PropType<() => void | Promise<void>>,
    onClear: Function as PropType<() => void | Promise<void>>,
  },
  emits: {
    clear: () => {
      return true;
    },
    click: () => {
      return true;
    },
  },
  setup(props, ctx) {
    function isFileImage(src: string): boolean {
      return /\.(gif|jpe?g|tiff?|png|webp|bmp|svg)$/i.test(src);
    }

    return () => (
      <div
        class={`bcmsMedia--inner ${
          props.invalidText && !props.value ? 'bcmsMedia--inner_isError' : ''
        } ${props.class}`}
      >
        {props.value ? (
          <>
            <button
              onClick={() => {
                ctx.emit('click');
              }}
              class="bcmsMedia--details"
            >
              <div class="bcmsMedia--details-visual">
                {isFileImage(props.value) ? (
                  <BCMSImage src={props.value} alt="" />
                ) : (
                  <BCMSIcon src="/file" />
                )}
              </div>
              <div class="bcmsMedia--details-info">
                <div class="bcmsMedia--path">{props.value}</div>
                <div class="bcmsMedia--details-cta">
                  Click to select another media
                </div>
              </div>
            </button>
            <button
              aria-label="clear"
              class="bcmsMedia--actions"
              onClick={() => {
                ctx.emit('clear');
              }}
            >
              <BCMSIcon src="/trash" />
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              ctx.emit('click');
            }}
            class="bcmsMedia--details"
          >
            <div class="bcmsMedia--details-cta">
              {props.invalidText
                ? 'Media file is required. Please select one'
                : 'Click to select a media'}
            </div>
          </button>
        )}
      </div>
    );
  },
});
export default component;
</script>
