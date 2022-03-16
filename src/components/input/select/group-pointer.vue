<script lang="tsx">
import { computed, defineComponent, onMounted, PropType } from 'vue';
import { DefaultComponentProps } from '../../_default';
import { BCMSSelectOption, BCMSStoreMutationTypes } from '../../../types';
import BCMSSelect from './index.vue';
import { BCMSGroup } from '@becomes/cms-sdk/types';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    exclude: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    selected: String,
    invalidText: String,
  },
  emits: {
    change: (_value: BCMSSelectOption) => {
      return true;
    },
  },
  setup(props, ctx) {
    const throwable = window.bcms.util.throwable;
    const store = window.bcms.vue.store;
    const groups = computed(() => {
      return (
        JSON.parse(JSON.stringify(store.getters.group_items)) as BCMSGroup[]
      ).sort((a, b) => (b.label < a.label ? 1 : -1));
    });

    onMounted(async () => {
      if (groups.value.length === 0) {
        await throwable(
          async () => {
            return await window.bcms.sdk.group.getAll();
          },
          async (result) => {
            store.commit(BCMSStoreMutationTypes.group_set, result);
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
