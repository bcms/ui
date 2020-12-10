<script lang="ts">
  import { blur } from 'svelte/transition';
  import type { Media } from '@becomes/cms-sdk';
  import { beforeUpdate, onMount } from 'svelte';
  import { MediaViewer, Meta } from '../../components';
  import { GeneralService, sdk } from '../../services';

  export let params: {
    id?: string;
  } = {};

  const buffer = {
    id: '' + params.id,
  };
  let media: Media;

  if (params.id === '-') {
    params.id = undefined;
  }

  async function getMedia(): Promise<Media> {
    return await GeneralService.errorWrapper(
      async () => {
        return await sdk.media.get(params.id);
      },
      async (value: Media) => {
        return value;
      }
    );
  }

  beforeUpdate(async () => {
    if (params.id === '-') {
      params.id = undefined;
      media = undefined;
    } else if (params.id && params.id !== buffer.id) {
      buffer.id = '' + params.id;
      media = await getMedia();
    }
  });
  onMount(async () => {
    if (params.id === '-') {
      params.id = undefined;
    } else if (params.id) {
      media = await getMedia();
    }
  });
</script>

<Meta title="Media{media ? `: ${media.name}` : ''}" />
<div
  in:blur={{ delay: 250, duration: 200 }}
  out:blur={{ duration: 200 }}
  class="view media">
  <MediaViewer mediaId={params.id} />
</div>
