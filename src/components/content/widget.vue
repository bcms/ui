<script lang="tsx">
import {
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
} from '@vue/runtime-core';
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3';
import { BCMSPropEditor } from '../props';
import {
  BCMSEntryExtendedContentAttrWidget,
  BCMSPropValueExtended,
  BCMSStoreMutationTypes,
} from '../../types';
import { BCMSIcon, BCMSImage } from '../index';
import { BCMSMedia, BCMSWidget } from '@becomes/cms-sdk/types';

const component = defineComponent({
  props: nodeViewProps,
  setup(props) {
    const store = window.bcms.vue.store;
    const rootClass = 'bcmsWidget';
    const attrs = ref<BCMSEntryExtendedContentAttrWidget>(
      JSON.parse(
        JSON.stringify(props.node?.attrs as BCMSEntryExtendedContentAttrWidget)
      )
    );
    if (typeof attrs.value.widget === 'string') {
      attrs.value.widget = JSON.parse(attrs.value.widget as never);
    }
    if (typeof attrs.value.content === 'string') {
      attrs.value.content = JSON.parse(attrs.value.content as never);
    }
    const image = ref<BCMSMedia | null>(null);
    const showImage = ref(true);
    const handleRef = ref<HTMLElement | null>(null);

    const storeUnsub = store.subscribe(async (mutation) => {
      if (mutation.type === BCMSStoreMutationTypes.widget_set) {
        if (mutation.payload._id === attrs.value.widget?._id) {
          attrs.value.widget = mutation.payload;
          await parseWidget();
        }
      }
    });

    async function parseWidget() {
      const contentItems: BCMSPropValueExtended[] = [];
      if (attrs.value.widget && attrs.value.widget.props) {
        for (let i = 0; i < attrs.value.widget.props.length; i++) {
          const prop = attrs.value.widget.props[i];
          const targetValue = attrs.value.content.find((e) => e.id === prop.id);
          const result = await window.bcms.prop.toPropValueExtended({
            prop,
            value: targetValue,
          });
          if (result) {
            contentItems.push(result);
          }
        }
        attrs.value.content = contentItems;
        if (attrs.value.widget.previewImage) {
          await window.bcms.util.throwable(
            async () => {
              return await window.bcms.sdk.media.getById(
                (attrs.value.widget as BCMSWidget).previewImage
              );
            },
            async (result) => {
              image.value = result;
            }
          );
        }
      }
    }

    function onResize() {
      if (window.innerWidth > 1300) {
        showImage.value = true;
      } else {
        showImage.value = false;
      }
    }

    onMounted(async () => {
      await parseWidget();
      onResize();
      window.addEventListener('resize', onResize);
      if (handleRef.value) {
        const parent = handleRef.value.parentElement as HTMLElement;
        if (parent) {
          parent.setAttribute('id', 'widget_wrapper');
        }
      }
    });
    onUnmounted(() => {
      window.removeEventListener('resize', onResize);
      storeUnsub();
    });

    return () => (
      <NodeViewWrapper class="group-scope relative">
        <div
          ref={handleRef}
          class="absolute z-10 top-0 left-0 w-10 -translate-x-full -translate-y-2 h-full group-scope-hover:block"
        >
          <div data-drag-handle class="cursor-move p-2">
            <BCMSIcon
              src="/editor/drag"
              class="text-grey fill-current w-6 h-6"
            />
          </div>
        </div>
        <div
          class={`${rootClass} relative border border-t-0 border-green rounded-2.5 rounded-t-none mt-12 mb-10 pt-6 px-2.5 pb-6 select-none sm:px-5`}
        >
          <div
            class={`${rootClass}_top absolute top-0 left-1/2 w-[calc(100%+2px)] -translate-y-1/2 -translate-x-1/2 before:absolute before:top-0 before:left-0 before:rounded-tl-2.5 before:border-t before:border-l before:w-2.5 before:h-2.5 before:border-solid before:border-green after:absolute after:top-0 after:right-0 after:rounded-tr-2.5 after:border-t after:border-r after:w-2.5 after:h-2.5 after:border-solid after:border-green`}
          >
            <div class="flex items-center pl-5 pr-3 -translate-y-2 after:top-1/2 after:w-full after:relative after:h-px after:flex-grow after:bg-green after:translate-x-1 after:-translate-y-px">
              <BCMSIcon
                class="flex-shrink-0 w-3 h-3 mr-2 text-green fill-current"
                src="/administration/widget"
              />
              <span class="flex-shrink-0 text-green text-xs leading-normal tracking-0.06 uppercase mr-1.5">
                Widget | {attrs.value?.widget?.label}
              </span>
            </div>
          </div>
          <div>
            <BCMSPropEditor
              props={attrs.value.content}
              onUpdate={(data) => {
                attrs.value.content[data.propIndex] = data.prop;
                if (props.updateAttributes) {
                  props.updateAttributes({
                    widget: JSON.stringify(attrs.value.widget),
                    content: JSON.stringify(attrs.value.content),
                  });
                }
              }}
            />
          </div>
        </div>
        {image.value ? (
          <div
            style={`position: absolute; top: 0; right: -320px; transition: all 0.2s; opacity: ${
              showImage.value ? '1' : '0'
            }`}
          >
            <BCMSImage
              media={image.value}
              alt={attrs.value.widget?.label || ''}
            />
          </div>
        ) : (
          ''
        )}
      </NodeViewWrapper>
    );
  },
});
export default component;
</script>
