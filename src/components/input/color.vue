<script lang="tsx">
import { defineComponent, PropType, ref, TransitionGroup } from 'vue';
import type { BCMSPropColorPickerData } from '@becomes/cms-sdk/types/models/prop/color-picker';
import { ColorPicker } from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';
import { DefaultComponentProps } from '../_default';
import { BCMSIcon } from '..';

const component = defineComponent({
  components: {
    ColorPicker,
  },
  props: {
    ...DefaultComponentProps,
    value: {
      type: Object as PropType<BCMSPropColorPickerData>,
      required: true,
    },
  },
  emits: {
    change: (_value: string[]) => {
      return true;
    },
  },
  setup(_props, ctx) {
    const selectedColor = ref('#249681');
    const preDefinedColors = ref<string[]>([]);

    function handleColorAdd() {
      const isColorDefined = preDefinedColors.value.find(
        (e) => e === selectedColor.value
      );

      if (!isColorDefined) {
        preDefinedColors.value.push(selectedColor.value);
      }

      ctx.emit('change', preDefinedColors.value);
    }

    return () => (
      <div class="flex items-start space-x-4 mt-6">
        <div class="flex-1">
          <ColorPicker
            format="hex"
            pickerType="chrome"
            isWidget={true}
            disableHistory={true}
            disableAlpha={true}
            v-model:pureColor={selectedColor.value}
          />

          <div class="flex items-center justify-between p-[11px] pl-4.5 border border-grey border-opacity-50 rounded-3xl leading-tight -tracking-0.01">
            <div class="flex items-center">
              <span class="mr-2.5">#</span>
              <span>{selectedColor.value.slice(1)}</span>
            </div>
            <div>
              <button class="group flex items-center" onClick={handleColorAdd}>
                <span class="font-semibold mr-2.5 transition-colors duration-200 group-hover:text-green">
                  Add to list
                </span>
                <BCMSIcon
                  src="/plus-circle"
                  class="text-dark fill-current w-6 h-6 transition-colors duration-200 group-hover:text-green"
                />
              </button>
            </div>
          </div>
        </div>
        <div class="min-w-[120px]">
          {preDefinedColors.value.length === 0 ? (
            <div class="text-sm text-grey font-medium">Add colors</div>
          ) : (
            <div class="grid grid-cols-2 gap-2.5">
              <TransitionGroup name="fade" appear={true} duration={300}>
                {preDefinedColors.value.map((e) => {
                  return (
                    <button
                      class="group w-12 h-12 rounded-full shadow-btnSecondary flex justify-center items-center focus:outline-none"
                      style={{ backgroundColor: e }}
                      key={e}
                      aria-label="Remove color"
                      onClick={() => {
                        preDefinedColors.value = preDefinedColors.value.filter(
                          (e2) => e2 !== e
                        );
                      }}
                    >
                      <BCMSIcon
                        src="/trash"
                        class="opacity-0 w-6 h-6 text-white fill-current transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                      />
                    </button>
                  );
                })}
              </TransitionGroup>
            </div>
          )}
        </div>
      </div>
    );
  },
});

export default component;
</script>
