<script lang="tsx">
import { Editor, BubbleMenu } from '@tiptap/vue-3';
import { defineComponent } from '@vue/runtime-core';
import { DefaultComponentProps } from '../_default';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    editor: Editor,
  },
  setup(props) {
    const headings: [1, 2, 3, 4, 5, 6] = [1, 2, 3, 4, 5, 6];

    return () => (
      <>
        {props.editor ? (
          <BubbleMenu class={props.class} editor={props.editor}>
            <button
              class={props.editor.isActive('bold') ? 'is-active' : undefined}
              onClick={() => {
                (props.editor as Editor).chain().focus().toggleBold().run();
              }}
            >
              B
            </button>
            <button
              class={props.editor.isActive('italic') ? 'is-active' : undefined}
              onClick={() => {
                (props.editor as Editor).chain().focus().toggleItalic().run();
              }}
            >
              I
            </button>
            <button
              class={
                props.editor.isActive('underline') ? 'is-active' : undefined
              }
              onClick={() => {
                (props.editor as Editor)
                  .chain()
                  .focus()
                  .toggleUnderline()
                  .run();
              }}
            >
              U
            </button>
            <button
              class={props.editor.isActive('strike') ? 'is-active' : undefined}
              onClick={() => {
                (props.editor as Editor).chain().focus().toggleStrike().run();
              }}
            >
              S
            </button>
            <button
              class={props.editor.isActive('link') ? 'is-active' : undefined}
              onClick={() => {
                const editor = props.editor as Editor;
                if (editor.isActive('link')) {
                  editor.chain().focus().unsetLink().run();
                } else {
                  window.bcms.modal.content.link.show({
                    onDone({ href }) {
                      editor
                        .chain()
                        .focus()
                        .extendMarkRange('link')
                        .setLink({ href })
                        .run();
                    },
                  });
                }
              }}
            >
              Link
            </button>
            <div class="split">|</div>
            {headings.map((headingIndex) => {
              const editor = props.editor as Editor;
              return (
                <button
                  class={
                    editor.isActive('heading', { level: headingIndex })
                      ? 'is-active'
                      : undefined
                  }
                  onClick={() => {
                    editor
                      .chain()
                      .focus()
                      .toggleHeading({ level: headingIndex })
                      .run();
                  }}
                >
                  H{headingIndex}
                </button>
              );
            })}
            <div class="split">|</div>
          </BubbleMenu>
        ) : (
          ''
        )}
      </>
    );
  },
});
export default component;
</script>
