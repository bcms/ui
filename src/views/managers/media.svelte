<script lang="ts">
  import type { Media } from '@becomes/cms-sdk';
  import { beforeUpdate, onMount } from 'svelte';
  import { MediaViewer } from '../../components';
  import { Router } from '../../router';
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
    Router.setTitle(`Media${media ? `: ${media.name}` : ''}`);
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

<div class="view media">
  <MediaViewer mediaId={params.id} />
</div>
