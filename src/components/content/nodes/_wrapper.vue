<script lang="tsx">
import { NodeViewWrapper, nodeViewProps, NodeViewContent } from '@tiptap/vue-3';
import {
  defineComponent,
  onBeforeUpdate,
  onMounted,
  ref,
} from '@vue/runtime-core';
import { Node } from 'prosemirror-model';

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

    function getTag(node?: Node<any>) {
      if (!node) {
        return '';
      }
      switch (node.type.name) {
        case 'heading': {
          return `h${node.attrs.level}`;
        }
        default: {
          return 's';
        }
      }
    }

    onMounted(() => {
      console.log(props);
    });
    onBeforeUpdate(() => {
      console.log(props);
    });

    return () => (
      <NodeViewWrapper>
        <NodeViewContent class={attrs.value.class} as={getTag(props.node)} />
      </NodeViewWrapper>
    );
  },
});

export default component;
</script>
