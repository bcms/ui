<script lang="tsx">
import { NodeViewWrapper, nodeViewProps, NodeViewContent } from '@tiptap/vue-3';
import { defineComponent, onBeforeUpdate, ref } from '@vue/runtime-core';
import { BCMSIcon } from '../../index';

const component = defineComponent({
  props: nodeViewProps,
  setup(props) {
    const attrs = ref(
      props.node?.attrs as {
        icon?: string;
        class?: string;
        tag?: string;
        level?: string;
      }
    );

    onBeforeUpdate(() => {
      attrs.value.tag = props.node?.attrs.tag;
    });

    return () => (
      <NodeViewWrapper class={attrs.value.class} key={attrs.value.tag}>
        <div
          class={`nodeWrapper--inner ${
            attrs.value.tag !== 'code' ? 'relative' : ''
          }`}
          onMouseenter={(event) => {
            window.editorNodeEnter({
              element: event.currentTarget as HTMLElement,
            });
          }}
          onMouseleave={(event) => {
            window.editorNodeLeave({
              element: event.currentTarget as HTMLElement,
            });
          }}
        >
          {attrs.value.icon && (
            <div class="nodeWrapper--icon absolute -top-2 -left-6 pointer-events-none">
              <BCMSIcon
                src={attrs.value.icon}
                class="text-grey text-opacity-60 fill-current w-5 h-5"
              />
            </div>
          )}
          <NodeViewContent></NodeViewContent>
        </div>
      </NodeViewWrapper>
    );
  },
});

export default component;
</script>
