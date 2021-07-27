<script lang="tsx">
import { defineComponent, ref } from '@vue/runtime-core';
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3';
import { BCMSPropEditor } from '../props';
import { BCMSEntryExtendedContentAttrWidget } from '../../types';

const component = defineComponent({
  props: nodeViewProps,
  setup(props) {
    const rootClass = 'bcmsWidget';
    const attrs = ref<BCMSEntryExtendedContentAttrWidget>(
      props.node?.attrs as BCMSEntryExtendedContentAttrWidget
    );

    return () => (
      <NodeViewWrapper>
        <div class={rootClass}>
          <div class={`${rootClass}--header`}>
            <div class="${rootClass}--header-inner">
              <div class="${rootClass}--header-details">
                <div class="${rootClass}--header-label">
                  {attrs.value?.widget.label}
                </div>
              </div>
            </div>
          </div>
          <div class="${rootClass}--body">
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
