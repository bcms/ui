<script lang="tsx">
import { defineComponent, ref } from '@vue/runtime-core';
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3';
import { BCMSPropEditor } from '../props';
import { BCMSEntryExtendedContentAttrWidget } from '../../types';
import { BCMSIcon } from '../index';

const component = defineComponent({
  props: nodeViewProps,
  setup(props) {
    const rootClass = 'bcmsWidget';
    const attrs = ref<BCMSEntryExtendedContentAttrWidget>(
      props.node?.attrs as BCMSEntryExtendedContentAttrWidget
    );

    return () => (
      <NodeViewWrapper class="group relative">
        <div class="absolute z-10 top-0 left-0 w-10 -translate-x-full -translate-y-2 h-full">
          <div data-drag-handle class="cursor-move p-2">
            <BCMSIcon
              src="/editor/drag"
              class="text-grey fill-current w-6 h-6 hidden group-hover:block"
            />
          </div>
        </div>
        <div
          class={`${rootClass} relative border border-t-0 border-green rounded-2.5 rounded-t-none mt-12 mb-10 pt-6 px-5 pb-6 select-none`}
        >
          <div
            class={`${rootClass}--header absolute top-0 left-1/2 w-full -translate-y-1/2 -translate-x-1/2`}
          >
            <div
              class={`${rootClass}--header-label flex items-center pl-5 pr-3 -translate-y-2`}
            >
              <BCMSIcon
                class="flex-shrink-0 w-3 h-3 mr-2 text-green fill-current"
                src="/administration/widget"
              />
              <span class="flex-shrink-0 text-green text-xs leading-normal tracking-0.06 uppercase mr-1.5">
                Widget | {attrs.value?.widget.label}
              </span>
            </div>
          </div>
          <div class={`${rootClass}--body`}>
            <BCMSPropEditor
              props={attrs.value.content}
              onUpdate={(data) => {
                attrs.value.content[data.propIndex] = data.prop;
                if (props.updateAttributes) {
                  props.updateAttributes(attrs);
                }
              }}
            />
          </div>
        </div>
      </NodeViewWrapper>
    );
  },
});
export default component;
</script>
