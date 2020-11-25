<script context="module" lang="ts">
  import { Media, MediaType } from '@becomes/cms-sdk';

  export const cache: Array<{
    media: Media;
    src: string;
  }> = [];
</script>

<script lang="ts">
  import { beforeUpdate, onMount } from 'svelte';

  import * as uuid from 'uuid';
  import { GeneralService, sdk } from '../services';

  export { className as class };
  export let style: string = undefined;
  export let id: string = uuid.v4();
  export let href: string = '';
  export let alt: string;
  export let media: Media = undefined;

  const buffer = {
    href: '',
    media: '',
  };
  let className: string;
  let element: HTMLImageElement;

  async function setSrc(_media: Media) {
    if (element) {
      const mediaFromCache = cache.find((e) => e.media._id === _media._id);
      if (mediaFromCache) {
        element.setAttribute('src', mediaFromCache.src);
        return;
      }
      const buffer: Buffer = await GeneralService.errorWrapper(
        async () => {
          return await sdk.media.getBinary(_media._id, 'small');
        },
        async (value: Buffer) => {
          return value;
        }
      );
      cache.push({
        media: _media,
        src: `data:${_media.mimetype};base64,${GeneralService.b64.fromBuffer(
          buffer
        )}`,
      });
      element.setAttribute(
        'src',
        `data:${_media.mimetype};base64,${GeneralService.b64.fromBuffer(
          buffer
        )}`
      );
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
            (e.path + '/' + e.name).replace(/\/\//g, '/') === href
        );
        if (_media) {
          setSrc(_media);
        } else {
          element.setAttribute('href', '#');
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
      buffer.href = '' + href;
      load();
    }
  });
  beforeUpdate(() => {
    if (buffer.href !== href) {
      buffer.href = href;
      load();
    } else if (buffer.media !== JSON.stringify(media)) {
      buffer.media = JSON.stringify(media);
      setSrc(media);
    }
  });
</script>

<img {id} data-src={href} {alt} class={className} {style} />
