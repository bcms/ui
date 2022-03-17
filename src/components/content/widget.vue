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
      <NodeViewWrapper class="group-scope relative">
        <div class="hidden absolute z-10 top-0 left-0 w-10 -translate-x-full -translate-y-2 h-full group-scope-hover:block">
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
                Widget | {attrs.value?.widget.label}
              </span>
            </div>
          </div>
          <div>
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
