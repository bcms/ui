<script lang="ts">
  import type { Media } from '@becomes/cms-sdk';
  import { MediaType } from '@becomes/cms-sdk';
  import { beforeUpdate, onMount } from 'svelte';
  import * as uuid from 'uuid';
  import { GeneralService, sdk } from '../services';

  export { className as class };
  export let style: string = undefined;
  export let id: string = uuid.v4();
  export let src: string = '';
  export let alt: string;
  export let media: Media = undefined;
  export let fullQuality = false;

  const buffer = {
    src: '',
    media: '',
  };
  let className: string = '';
  let element: HTMLImageElement;

  async function setSrc(_media: Media) {
    if (element) {
      element.setAttribute('src', '/assets/file.svg');
      setTimeout(async () => {
        element.setAttribute(
          'src',
          await sdk.media.getUrlWithAccessToken(
            _media,
            fullQuality ? undefined : 'small'
          )
        );
      }, 20);
    }
  }
  async function load() {
    if (element) {
      const mediaFiles: Media[] = await GeneralService.errorWrapper(
        async () => {
          return await sdk.media.getAll();
        },
        async (value: Media[]) => {
          return value;
        }
      );
      if (mediaFiles) {
        const _media = mediaFiles.find(
          (e) =>
            e.type === MediaType.IMG &&
            (e.path + '/' + e.name).replace(/\/\//g, '/') === src
        );
        if (_media) {
          setSrc(_media);
        } else {
          element.setAttribute('href', '#');
          element.setAttribute('style', 'background-color: red;');
        }
      }
    }
  }

  onMount(() => {
    element = document.getElementById(id) as HTMLImageElement;
    if (media) {
      buffer.media = JSON.stringify(media);
      setSrc(media);
    } else {
      buffer.src = '' + src;
      load();
    }
  });
  beforeUpdate(() => {
    if (buffer.src !== src) {
      buffer.src = src;
      load();
    } else if (buffer.media !== JSON.stringify(media)) {
      buffer.media = JSON.stringify(media);
      setSrc(media);
    }
  });
</script>

<img {id} data-src={src} {alt} class={className} {style} />
