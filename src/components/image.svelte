<script lang="ts">
  import { Media, MediaType } from '@becomes/cms-sdk';

  import { beforeUpdate, onMount } from 'svelte';

  import * as uuid from 'uuid';
  import { GeneralService, sdk } from '../services';

  export { className as class };
  export let style: string;
  export let id: string = uuid.v4();
  export let href: string;
  export let alt: string;

  const buffer = {
    href: '',
  };
  let src: string = '';
  let className: string;
  let element: HTMLImageElement;

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
        const media = mediaFiles.find(
          (e) =>
            e.type === MediaType.IMG &&
            (e.path + '/' + e.name).replace(/\/\//g, '/') === href
        );
        if (media) {
          const buffer: Buffer = await GeneralService.errorWrapper(
            async () => {
              return await sdk.media.getBinary(media._id, 'small');
            },
            async (value: Buffer) => {
              return value;
            }
          );
          element.setAttribute(
            'href',
            `data:${media.mimetype};base64,${GeneralService.b64.fromBuffer(
              buffer
            )}`
          );
        } else {
          element.setAttribute('href', '#');
        }
      }
    }
  }

  onMount(() => {
    element = document.getElementById(id) as HTMLImageElement;
    buffer.href = '' + href;
    load();
  });
  beforeUpdate(() => {
    if (buffer.href !== href) {
      buffer.href = href;
      load();
    }
  });
</script>

<img {id} data-src={href} {alt} class={className} {style} />
