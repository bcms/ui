<script lang="tsx">
import { defineComponent, onBeforeUpdate, onMounted, PropType, ref } from 'vue';
import { BCMSMedia, BCMSMediaType } from '@becomes/cms-sdk/types';
import { DefaultComponentProps } from './_default';
import { useThrowable } from '../util';
import BCMSIcon from './icon.vue';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    alt: {
      type: String,
      required: true,
    },
    media: Object as PropType<BCMSMedia>,
    fullQuality: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const throwable = useThrowable();
    const src = ref('/assets/file.svg');
    const exist = ref(true);
    // let lastSrc = '';
    let lastMedia: BCMSMedia | null = null;

    // async function loadImage() {
    //   await throwable(
    //     async () => {
    //       console.log(1);
    //       return await window.bcms.sdk.media.getAll();
    //     },
    //     async (result) => {
    //       const target = result.find((e) => e.type === BCMSMediaType.IMG);
    //       if (target) {
    //         await setSrc(target);
    //       } else {
    //         exist.value = false;
    //       }
    //     },
    //     async (_error) => {
    //       exist.value = false;
    //     }
    //   );
    // }
    async function setSrc(media: BCMSMedia) {
      await throwable(
        async () => {
          await window.bcms.sdk.isLoggedIn();
        },
        async () => {
          if (
            media.type === BCMSMediaType.VID ||
            media.type === BCMSMediaType.GIF
          ) {
            console.log('HERE');
            src.value = `/api/media/${
              media._id
            }/vid/bin/thumbnail?act=${window.bcms.sdk.storage.get('at')}`;
          } else {
            src.value = `/api/media/${
              media._id
            }/bin/small/act?act=${window.bcms.sdk.storage.get('at')}`;
          }
        }
      );
    }

    onMounted(async () => {
      if (props.media) {
        lastMedia = props.media;
        await setSrc(props.media);
      }
    });
    onBeforeUpdate(async () => {
      if (!lastMedia && props.media) {
        lastMedia = props.media;
        await setSrc(props.media);
      } else if (
        props.media &&
        lastMedia &&
        lastMedia._id !== props.media._id
      ) {
        lastMedia = props.media;
        await setSrc(props.media);
      }
    });

    return () => (
      <>
        {props.media ? (
          <img
            id={props.id}
            src={src.value}
            alt={props.alt}
            class={props.class}
            style={`${exist.value ? '' : 'background-color: red;'}${
              props.style
            }`}
          />
        ) : (
          <BCMSIcon id={props.id} class={props.class} src="/broken-file" />
        )}
      </>
    );
  },
});
export default component;
</script>
