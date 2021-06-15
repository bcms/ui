<script lang="tsx">
import { defineComponent, onBeforeUpdate, onMounted, PropType, ref } from 'vue';
import { BCMSMedia, BCMSMediaType } from '@becomes/cms-sdk/types';
import { DefaultComponentProps } from './_default';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    src: {
      type: String,
      default: '',
    },
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
    const src = ref('/assets/file.svg');
    const exist = ref(true);
    let lastSrc = '';
    let lastMedia: BCMSMedia | null = null;

    async function loadImage() {
      await window.bcms.services.error.wrapper(
        async () => {
          return await window.bcms.sdk.media.getAll();
        },
        async (result) => {
          const target = result.find(
            (e) =>
              e.type === BCMSMediaType.IMG &&
              (e.path + '/' + e.name).replace(/\/\//g, '/') === props.src
          );
          if (target) {
            await setSrc(target);
          } else {
            exist.value = false;
          }
        }
      );
    }
    async function setSrc(media: BCMSMedia) {
      src.value = await window.bcms.sdk.media.getUrlWithAccessToken(
        media,
        props.fullQuality ? undefined : 'small'
      );
    }

    onMounted(async () => {
      if (props.media) {
        lastMedia = props.media;
        await setSrc(props.media);
      } else {
        lastSrc = props.src;
        await loadImage();
      }
    });
    onBeforeUpdate(async () => {
      if (props.media && lastMedia && lastMedia._id !== props.media._id) {
        lastMedia = props.media;
        await setSrc(props.media);
      } else if (props.src && lastSrc !== props.src) {
        lastSrc = props.src;
        await loadImage();
      }
    });

    return () => (
      <img
        id={props.id}
        data-src={props.src}
        src={src.value}
        alt={props.alt}
        class={props.class}
        style={`${exist.value ? '' : 'background-color: red;'}${props.style}`}
      />
    );
  },
});
export default component;
</script>
