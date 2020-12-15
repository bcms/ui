<script lang="ts">
  import type { Prop, PropQuill, PropType } from '@becomes/cms-sdk';
  import { beforeUpdate } from 'svelte';
  import { GeneralService } from '../../../services';
  import {
    CodeIcon,
    HeadingFiveIcon,
    HeadingFourIcon,
    HeadingOneIcon,
    HeadingThreeIcon,
    HeadingTwoIcon,
  } from '../../icons';
  import QuillContainer from './quill.svelte';

  export let id: string = undefined;
  export let prop: Prop;

  let value = prop.value as PropQuill;

  function getHeadingIcon(type: PropType) {
    switch (type) {
      case 'HEADING_1':
        return HeadingOneIcon;
      case 'HEADING_2':
        return HeadingTwoIcon;
      case 'HEADING_3':
        return HeadingThreeIcon;
      case 'HEADING_4':
        return HeadingFourIcon;
      case 'HEADING_5':
        return HeadingFiveIcon;

      default:
        return CodeIcon;
    }
  }

  beforeUpdate(() => {
    value = prop.value as PropQuill;
  });
</script>

<QuillContainer
  cyTag={prop.type}
  {id}
  class="prop-quill--{GeneralService.string.toUri(prop.type)}"
  label={getHeadingIcon(prop.type)}
  formats={['heading']}
  toolbar={false}
  name={prop.name}
  ops={value.ops}
  on:update
  on:move
  on:add
  on:remove />
