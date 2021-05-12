<script lang="tsx">
import { computed, defineComponent, onMounted, PropType, ref } from 'vue';
import type { BCMSStatus } from '@becomes/cms-sdk/types';
import { BCMSRoleName } from '@becomes/cms-sdk/types';
import { DefaultComponentProps } from '../_default';
import { MutationTypes, useStore } from '../../store';
import { BCMSSelect } from '../input';
import { BCMSSelectOption } from '../../types';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    selected: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: 'Select a status',
    },
    invalidText: String,
    onChange: Function as PropType<(statusId: string) => void | Promise<void>>,
  },
  emits: {
    change: (_statusId: string) => {
      return true;
    },
  },
  setup(props, ctx) {
    const store = useStore();
    const isUserAdmin = ref(false);
    const status = computed<{
      list: BCMSStatus[];
      options: BCMSSelectOption[];
    }>(() => {
      const statuses = store.getters.status_items;
      const specialOptions: BCMSSelectOption[] = isUserAdmin.value
        ? [
            {
              label: 'Edit statuses',
              value: '___edit___',
              special: 'editStatuses',
            },
          ]
        : [];
      const output = {
        list: statuses,
        options: [
          ...statuses
            .map((e) => {
              return {
                label: e.label,
                value: e._id,
              };
            })
            .sort((a, b) => (b.label < a.label ? 1 : -1)),
          ...specialOptions,
        ],
      };
      console.log(output);
      return output;
    });

    onMounted(async () => {
      if (status.value.list.length === 0) {
        await window.bcms.services.error.wrapper(
          async () => {
            return await window.bcms.sdk.status.getAll();
          },
          async (result) => {
            store.commit(MutationTypes.status_set, result);
          }
        );
      }
      await window.bcms.services.error.wrapper(
        async () => {
          return await window.bcms.sdk.user.get();
        },
        async (result) => {
          if (result) {
            isUserAdmin.value = result.roles[0].name === BCMSRoleName.ADMIN;
            console.log(isUserAdmin.value);
          }
        }
      );
    });

    return () => (
      <div id={props.id} class={`statuses ${props.class}`} style={props.style}>
        <BCMSSelect
          placeholder={props.placeholder}
          invalidText={props.invalidText}
          selected={props.selected}
          options={status.value.options}
          onChange={(option) => {
            if (option.value === '___edit___') {
              // TODO
            } else {
              ctx.emit('change', option.value);
            }
          }}
        />
      </div>
    );
  },
});
export default component;
</script>
