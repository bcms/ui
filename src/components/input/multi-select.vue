<script lang="tsx">
import {
  computed,
  defineComponent,
  onMounted,
  PropType,
} from '@vue/runtime-core';
import { BCMSMultiSelectItem, BCMSMultiSelectItemExtended } from '../../types';
import { DefaultComponentProps } from '../_default';
import InputWrapper from './_input.vue';
import BCMSImage from '../image.vue';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    label: String,
    invalidText: String,
    helperText: String,
    addActionText: String,
    onlyOne: Boolean,
    items: {
      type: Array as PropType<BCMSMultiSelectItemExtended[]>,
      required: true,
    },
  },
  emits: {
    change: (_items: BCMSMultiSelectItem[]) => {
      return true;
    },
  },
  setup(props, ctx) {
    const store = window.bcms.vue.store;
    const selectedItems = computed(() =>
      props.items
        .filter((e) => e.selected)
        .map((e) => {
          console.log({ e });
          if (e.imageId) {
            e.image = store.getters.media_findOne((m) => m._id === e.imageId);
          }
          return e;
        })
    );

    onMounted(async () => {
      await window.bcms.util.throwable(async () => {
        await window.bcms.sdk.media.getAll();
      });
    });

    return () => (
      <InputWrapper
        class={props.class}
        label={props.label}
        invalidText={props.invalidText}
        helperText={props.helperText}
      >
        <button
          class="bcmsMultiSelect--items"
          onClick={() => {
            window.bcms.modal.multiSelect.show({
              items: props.items,
              onlyOne: props.onlyOne,
              onDone(data) {
                ctx.emit('change', data.items);
              },
            });
          }}
        >
          {selectedItems.value.length ? (
            <>
              {props.items
                .filter((item) => item.selected)
                .map((item) => (
                  <div class="bcmsMultiSelect--item">
                    {item.image ? (
                      <>
                        <div class="bcmsMultiSelect--item-left">
                          <div class="bcmsMultiSelect--item-title">
                            {item.title}
                          </div>
                          {item.subtitle ? (
                            <div class="bcmsMultiSelect--item-sub">
                              {item.subtitle}
                            </div>
                          ) : (
                            ''
                          )}
                        </div>
                        <div class="bcmsMultiSelect--item-right">
                          <BCMSImage media={item.image} alt={item.title} />
                        </div>
                      </>
                    ) : (
                      <>
                        <div class="bcmsMultiSelect--item-title">
                          {item.title}
                        </div>
                        {item.subtitle ? (
                          <div class="bcmsMultiSelect--item-sub">
                            {item.subtitle}
                          </div>
                        ) : (
                          ''
                        )}
                      </>
                    )}
                  </div>
                ))}
            </>
          ) : (
            <div class="bcmsMultiSelect--noSelection">No items selected</div>
          )}
        </button>
      </InputWrapper>
    );
  },
});
export default component;
</script>
