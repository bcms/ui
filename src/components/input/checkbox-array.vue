<script lang="tsx">
import { computed, defineComponent, PropType, ref } from '@vue/runtime-core';
import BCMSButton from '../button.vue';
import { BCMSCheckboxInput } from '../input';
import { DefaultComponentProps } from '../_default';

interface Data {
  label?: string;
  desc: string;
  selected: boolean;
  helperText?: string;
  invalidText?: string;
}

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    title: {
      type: String,
      default: '',
    },
    initialValue: {
      type: Array as PropType<Data[]>,
      required: true,
    },
  },
  emits: {
    change: (_data: Data[]) => {
      return true;
    },
  },
  setup(props, { emit }) {
    const data = ref(getData());
    const allChecked = computed(() => {
      return !data.value.find((e) => !e.selected);
    });

    function getData(): Data[] {
      if (props.initialValue) {
        return props.initialValue;
      }
      return [];
    }

    function checkAll() {
      if (allChecked.value) {
        for (let i = 0; i < data.value.length; i++) {
          data.value[i].selected = false;
        }
      } else {
        for (let i = 0; i < data.value.length; i++) {
          data.value[i].selected = true;
        }
      }

      emit('change', data.value);
    }

    function change(index: number, selected: boolean) {
      data.value[index].selected = selected;

      emit('change', data.value);
    }

    return () => (
      <div v-cy={props.cyTag} class={props.class}>
        <h3
          class="text-[28px] leading-tight font-normal text-dark mb-5"
          v-html={props.title}
        />
        <div class="max-w-max">
          <BCMSButton
            class="mb-4 hover:shadow-none focus:shadow-none"
            kind="ghost"
            onClick={checkAll}
          >
            {allChecked.value ? 'Uncheck all' : 'Check all'}
          </BCMSButton>
          {data.value.map((item, itemIndex) => (
            <BCMSCheckboxInput
              cyTag={`${props.cyTag}-get`}
              description={item.desc}
              label={item.label}
              helperText={item.helperText}
              invalidText={item.invalidText}
              class="mb-5 ml-5"
              value={item.selected}
              onInput={(event) => {
                change(itemIndex, event);
              }}
            />
          ))}
        </div>
      </div>
    );
  },
});

export default component;
</script>
