<script lang="tsx">
import { defineComponent, PropType } from 'vue';
import { useRouter } from 'vue-router';
import { DefaultComponentProps } from '../_default';
import BCMSButton from '../button.vue';
import BCMSIcon from '../icon.vue';
import BCMSManagerNavItem from './nav-item.vue';
import { BCMSManagerNavItemType } from '../../types';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    label: {
      type: String,
      default: '',
    },
    items: {
      type: Array as PropType<BCMSManagerNavItemType[]>,
      default: () => [],
    },
    actionText: String,
    onAction: Function as PropType<() => void | Promise<void>>,
  },
  emits: {
    action: () => {
      return true;
    },
  },
  setup(props, ctx) {
    const router = useRouter();

    return () => (
      <div class="managerLayout--sideNav">
        <div class="managerLayout--sideNav--body">
          {ctx.slots.default ? (
            ctx.slots.default()
          ) : (
            <>
              <button class="sideNav--section-toggler sideNav--section-toggler_active">
                <BCMSIcon src="/caret/right" />
                <span>{props.label}</span>
              </button>
              <ul class="sideNav--section-items">
                {props.items.map((item) => {
                  return (
                    <BCMSManagerNavItem
                      item={item}
                      onOpen={() => {
                        router.push(item.link);
                      }}
                    />
                  );
                })}
              </ul>
            </>
          )}
        </div>
        {props.actionText ? (
          <div class="managerLayout--sideNav--footer">
            <div class="managerLayout--sideNav--footer-inner">
              <BCMSButton
                class="managerLayout--sideNav--addNewBtn"
                size="m"
                onClick={() => {
                  ctx.emit('action');
                }}
              >
                {props.actionText}
              </BCMSButton>
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    );
  },
});
export default component;
</script>
