<script lang="tsx">
import { computed, defineComponent, onMounted, PropType } from 'vue';
import { DefaultComponentProps } from '../../_default';
import { BCMSSelectOption } from '../../../types';
import { MutationTypes, useStore } from '../../../store';
import BCMSSelect from './index.vue';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    exclude: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    selected: String,
    invalidText: String,
    onChange: Function as PropType<
      (option: BCMSSelectOption) => void | Promise<void>
    >,
  },
  emits: {
    change: (_value: BCMSSelectOption) => {
      return true;
    },
  },
  setup(props, ctx) {
    const store = useStore();
    const groups = computed(() => {
      return store.getters.group_items;
    });

    onMounted(async () => {
      if (groups.value.length === 0) {
        await window.bcms.services.error.wrapper(
          async () => {
            return await window.bcms.sdk.group.getAll();
          },
          async (result) => {
            store.commit(MutationTypes.group_set, result);
          }
        );
      }
    });

    return () => (
      <BCMSSelect
        cyTag={props.cyTag ? props.cyTag : 'groupPointer'}
        class={props.class}
        label="Select a group"
        placeholder="Select a group"
        invalidText={props.invalidText}
        options={groups.value.map((e) => {
          return { label: e.label, value: e._id };
        })}
        selected={props.selected ? props.selected : ''}
        disabled={groups.value.length === 0}
        onChange={(value) => {
          ctx.emit('change', value);
        }}
      />
    );
  },
});
export default component;
</script>
