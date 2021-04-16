<script lang="tsx">
import { defineComponent, onMounted, PropType } from 'vue';
import { DefaultComponentProps } from '@/components/_default';
import * as uuid from 'uuid';
import { useRouter } from 'vue-router';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    selected: Boolean,
    href: {
      type: String,
      required: true,
    },
    newTab: Boolean,
    title: String,
    disabled: Boolean,
    onClick: Function as PropType<() => void | Promise<void>>,
  },
  emits: {
    click: () => {
      return true;
    },
  },
  setup(props, ctx) {
    const router = useRouter();
    const id = props.id ? props.id : uuid.v4();

    onMounted(() => {
      if (props.selected) {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView(true);
        }
      }
    });

    return () => (
      <a
        v-cy={props.cyTag}
        id={id}
        style={props.style}
        class={props.class}
        href={props.href}
        target={props.newTab ? '_blank' : undefined}
        onClick={(e) => {
          ctx.emit('click');
          if (props.disabled) {
            e.preventDefault();
            return;
          }
          if (!props.newTab && !props.href.startsWith('http')) {
            e.preventDefault();
            router.push(props.href);
          }
        }}
      >
        {ctx.slots.default ? ctx.slots.default() : ''}
      </a>
    );
  },
});
export default component;
</script>
