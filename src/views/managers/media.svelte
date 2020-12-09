<script lang="ts">
  import type { Media } from '@becomes/cms-sdk';
  import { beforeUpdate, onMount } from 'svelte';
  import { Layout, MediaViewer } from '../../components';
  import { GeneralService, sdk } from '../../services';

  export let id: string;

  const buffer = {
    id: '' + id,
  };
  let media: Media;

  if (id === '-') {
    id = undefined;
  }

  async function getMedia(): Promise<Media> {
    return await GeneralService.errorWrapper(
      async () => {
        return await sdk.media.get(id);
      },
      async (value: Media) => {
        return value;
      }
    );
  }

  beforeUpdate(async () => {
    if (id === '-') {
      id = undefined;
      media = undefined;
    } else if (id && id !== buffer.id) {
      buffer.id = '' + id;
      media = await getMedia();
    }
  });
  onMount(async () => {
    if (id === '-') {
      id = undefined;
    } else if (id) {
      media = await getMedia();
    }
  });
</script>

<Layout title="Media{media ? `: ${media.name}` : ''}">
  <div class="view media">
    <MediaViewer mediaId={id} />
  </div>
</Layout>
