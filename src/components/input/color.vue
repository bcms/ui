<script lang="tsx">
import {
  computed,
  defineComponent,
  onMounted,
  PropType,
  ref,
  TransitionGroup,
} from 'vue';
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
      type: String,
      required: true,
    },
    view: {
      type: String as PropType<'prop' | 'entry'>,
      default: 'prop',
    },
    allowCustom: Boolean,
    allowGlobal: {
      type: Boolean,
      default: true,
    },
    allowCustomForce: Boolean,
    allowCreateColor: Boolean,
  },
  emits: {
    change: (_value: string) => {
      return true;
    },
  },
  setup(props, ctx) {
    const store = window.bcms.vue.store;
    const throwable = window.bcms.util.throwable;
    const selectedColor = ref({
      id: '',
      value: '#249681',
    });
    const hexColorBuffer = ref(selectedColor.value.value.slice(1));
    const colors = computed(() => {
      return store.getters.color_find((e) => e.global);
    });
    const colorWheelVisible = ref(false);

    async function createColor() {
      await throwable(async () => {
        return await window.bcms.sdk.color.create({
          label: selectedColor.value.value,
          value: selectedColor.value.value,
          global: true,
        });
      });
    }

    async function deleteColor(id: string) {
      await throwable(async () => {
        return await window.bcms.sdk.color.deleteById(id);
      });
    }

    onMounted(async () => {
      await window.bcms.util.throwable(async () => {
        await window.bcms.sdk.color.getAll();
      });
      if (props.value.startsWith('#')) {
        selectedColor.value = {
          id: '',
          value: props.value,
        };
      } else {
        const color = store.getters.color_findOne((e) => e._id === props.value);

        if (color) {
          selectedColor.value = {
            id: color._id,
            value: color.value,
          };
        }
      }
    });

    return () => (
      <div class="flex items-start space-x-4">
        {props.allowCustom && (
          <div class="flex-1">
            {props.allowCustomForce || colorWheelVisible.value ? (
              <>
                <ColorPicker
                  format="hex"
                  pickerType="chrome"
                  isWidget={true}
                  disableHistory={true}
                  disableAlpha={true}
                  pureColor={selectedColor.value.value}
                  onPureColorChange={(value: string) => {
                    if (value !== selectedColor.value.value) {
                      selectedColor.value = {
                        id: '',
                        value,
                      };
                      hexColorBuffer.value = selectedColor.value.value.slice(1);
                      ctx.emit('change', value);
                    }
                  }}
                />

                <div class="flex items-center justify-between pr-[11px] pl-4.5 border border-grey border-opacity-50 rounded-3xl leading-tight -tracking-0.01">
                  <div class="flex items-center flex-1">
                    <span>#</span>
                    <input
                      value={hexColorBuffer.value}
                      class="w-full max-w-full pl-2.5 py-[11px] focus:outline-none"
                      // maxlength={6}
                      onKeyup={(event) => {
                        const target = event.target as HTMLInputElement;
                        target.value = target.value.replace(/[^0-9a-f]+/g, '');
                        if (target.value.length > 6) {
                          target.value = target.value.substring(
                            target.value.length - 6
                          );
                        }
                        if (
                          target.value.length === 6 &&
                          target.value !== hexColorBuffer.value &&
                          window.bcms.util.color.check(target.value)
                        ) {
                          hexColorBuffer.value = target.value;
                          selectedColor.value = {
                            id: '',
                            value: `#${hexColorBuffer.value}`,
                          };
                        }
                      }}
                    />
                  </div>
                  {props.allowCreateColor && (
                    <div class="flex-shrink-0">
                      <button
                        class="group flex items-center"
                        onClick={createColor}
                      >
                        <span class="font-semibold mr-2.5 transition-colors duration-200 group-hover:text-green">
                          Add to list
                        </span>
                        <BCMSIcon
                          src="/plus-circle"
                          class="text-dark fill-current w-6 h-6 transition-colors duration-200 group-hover:text-green"
                        />
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={() => {
                  colorWheelVisible.value = true;
                }}
              >
                Choose other color
              </button>
            )}
          </div>
        )}
        {props.allowGlobal && (
          <div class="min-w-[120px]">
            {colors.value.length === 0 ? (
              <div class="text-sm text-grey font-medium">Add colors</div>
            ) : (
              <div class="grid grid-cols-2 gap-2.5">
                <TransitionGroup name="fade" appear={true} duration={300}>
                  {props.view === 'entry' && (
                    <button
                      class="group w-8 h-8 rounded-full shadow-btnSecondary flex justify-center items-center self-center justify-self-center focus:outline-none"
                      disabled
                      key={-1}
                      style={{
                        backgroundColor: selectedColor.value.value,
                        outline: '1px solid #ecada9',
                        outlineOffset: '10px',
                      }}
                      aria-label="Remove color"
                    >
                      {props.allowCreateColor && (
                        <BCMSIcon
                          src="/trash"
                          class="opacity-0 w-6 h-6 text-white fill-current transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                        />
                      )}
                    </button>
                  )}
                  {colors.value.map((color, index) => {
                    return (
                      <button
                        class={`group w-12 h-12 rounded-full shadow-btnSecondary flex justify-center items-center ${
                          color._id === selectedColor.value.id
                            ? 'outline-pink'
                            : ''
                        }`}
                        style={{
                          backgroundColor: color.value,
                          outline:
                            props.view === 'entry' ? '1px solid #ecada9' : '',
                          outlineOffset: props.view === 'entry' ? '10px' : '',
                        }}
                        key={index}
                        aria-label="Remove color"
                        onClick={() => {
                          if (props.allowCreateColor) {
                            deleteColor(color._id);
                          } else {
                            selectedColor.value = {
                              value: color.value,
                              id: color._id,
                            };
                            ctx.emit('change', color._id);
                          }
                        }}
                      >
                        {props.allowCreateColor && (
                          <BCMSIcon
                            src="/trash"
                            class="opacity-0 w-6 h-6 text-white fill-current transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                          />
                        )}
                      </button>
                    );
                  })}
                </TransitionGroup>
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
});

export default component;
</script>
