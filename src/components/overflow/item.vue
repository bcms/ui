<script lang="tsx">
import { defineComponent } from 'vue';
import BCMSIcon from '../icon.vue';
import { DefaultComponentProps } from '../_default';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    text: {
      type: String,
      required: true,
    },
    icon: String,
  },
  emits: {
    click: () => {
      return true;
    },
  },
  setup(props, ctx) {
    return () => {
      return (
        <div
          id={props.id}
          class={`flex ${props.class ? props.class : ''}`}
          style={props.style}
          v-cy={props.cyTag}
        >
          <button
            onClick={() => {
              ctx.emit('click');
            }}
            class="group w-full flex items-center transition-colors duration-300 py-4 px-5.5 hover:bg-light focus-visible:bg-light hover:text-green focus-visible:text-green dark:text-light dark:hover:bg-grey dark:focus-visible:bg-grey dark:hover:text-yellow dark:focus-visible:text-yellow"
          >
            {props.icon ? (
              <BCMSIcon
                src={props.icon.startsWith('/') ? props.icon : `/${props.icon}`}
                class="mr-[15px] w-5 h-5 text-grey fill-current transition-colors duration-300 group-hover:text-green group-focus-visible:text-green dark:group-hover:text-yellow dark:group-focus-visible:text-yellow"
              />
            ) : (
              ''
            )}
            <span>{props.text}</span>
          </button>
        </div>
      );
    };
  },
});
export default component;
</script>
