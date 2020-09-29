<script lang="ts">
  import type { Prop, PropQuill } from '@becomes/cms-sdk';
  import { beforeUpdate } from 'svelte';
  import type { PropWidget } from '@becomes/cms-sdk';
  import PropsEditor from '../props-editor.svelte';

  export let id: string = undefined;
  export let prop: Prop;

  let value = prop.value as PropWidget;

  beforeUpdate(() => {
    value = prop.value as PropWidget;
  });
</script>

<div class="prop-quill--widget">
  <PropsEditor
    depth="content.{prop.name}"
    props={value.props}
    on:update={(event) => {
      console.log(event);
    }} />
</div>
