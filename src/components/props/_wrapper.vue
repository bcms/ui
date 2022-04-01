<script lang="tsx">
import { computed, defineComponent, PropType } from 'vue';
import { DefaultComponentProps } from '../_default';
import BCMSIcon from '../icon.vue';
import { BCMSPropValueExtended } from '../../types';
import { BCMSPropType } from '@becomes/cms-sdk/types';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    prop: {
      type: Object as PropType<BCMSPropValueExtended>,
      required: true,
    },
  },
  setup(props, ctx) {
    const wrapperClass = computed(() => {
      let cls = '';

      if (
        props.prop.array ||
        props.prop.type === BCMSPropType.GROUP_POINTER ||
        props.prop.type === BCMSPropType.MEDIA
      ) {
        cls +=
          'border-green mb-10 rounded-2.5 border border-solid px-2.5 pb-6 relative border-t-0 rounded-t-none sm:px-5 ';
      }

      if (props.prop.type === BCMSPropType.MEDIA) {
        cls = cls.replace('border-green', 'border-grey border-opacity-50');
      }
      if (props.prop.array) {
        cls += 'mx-0 mt-7.5 pt-9 last:mb-7.5';
      } else if (
        props.prop.type === BCMSPropType.GROUP_POINTER ||
        props.prop.type === BCMSPropType.MEDIA
      ) {
        cls += 'mt-2.5 pt-2 last:mb-2.5';
      }

      return cls;
    });

    const wrapperHeaderClass = computed(() => {
      let cls = '';

      if (
        props.prop.array ||
        props.prop.type === BCMSPropType.GROUP_POINTER ||
        props.prop.type === BCMSPropType.MEDIA
      ) {
        cls +=
          'absolute -top-2.5 -left-px flex items-center justify-between before:w-2.5 before:h-2.5 before:absolute before:top-0 before:left-0 before:border-t before:border-l before:border-green before:rounded-tl-2.5 after:w-2.5 after:h-2.5 after:absolute after:top-0 after:right-0 after:border-t after:border-r after:border-green after:rounded-tr-2.5 ';
      }
      if (props.prop.type === BCMSPropType.MEDIA) {
        cls = cls
          .replace(
            'before:border-green',
            'before:border-grey before:border-opacity-50'
          )
          .replace(
            'after:border-green',
            'after:border-grey after:border-opacity-50'
          );
      }
      if (
        props.prop.array ||
        [
          BCMSPropType.GROUP_POINTER,
          BCMSPropType.ENTRY_POINTER,
          BCMSPropType.MEDIA,
        ].includes(props.prop.type)
      ) {
        cls += 'w-[calc(100%+2px)]';
      }

      return cls;
    });

    const wrapperInnerClass = computed(() => {
      let cls = '';

      if (
        props.prop.array ||
        props.prop.type === BCMSPropType.GROUP_POINTER ||
        props.prop.type === BCMSPropType.MEDIA
      ) {
        cls += 'border-none ';
      }
      return cls;
    });

    const wrapperDetailsClass = computed(() => {
      let cls = '';

      if (
        props.prop.array ||
        props.prop.type === BCMSPropType.GROUP_POINTER ||
        props.prop.type === BCMSPropType.MEDIA
      ) {
        cls +=
          'pl-4 pr-3.5 translate-x-0 translate-y-[-7px] text-green after:relative after:top-1/2 after:flex-grow after:h-px after:bg-green after:translate-x-1 after:-translate-y-0.5 ';
      }
      if (props.prop.type === BCMSPropType.MEDIA) {
        cls = cls
          .replace('text-green', 'text-grey')
          .replace('after:bg-green', 'after:bg-grey after:bg-opacity-50');
      }

      return cls;
    });

    const wrapperLabelClass = computed(() => {
      let cls = '';

      if (
        props.prop.array ||
        props.prop.type === BCMSPropType.GROUP_POINTER ||
        props.prop.type === BCMSPropType.MEDIA
      ) {
        cls += 'text-inherit';
      }

      return cls;
    });

    const wrapperRequiredClass = computed(() => {
      let cls = '';

      if (
        props.prop.array ||
        props.prop.type === BCMSPropType.GROUP_POINTER ||
        props.prop.type === BCMSPropType.MEDIA
      ) {
        cls += 'text-green';
      }
      if (props.prop.type === BCMSPropType.MEDIA) {
        cls = 'text-grey';
      }

      return cls;
    });

    const wrapperBodyClass = computed(() => {
      let cls = '';

      if (
        props.prop.type === BCMSPropType.GROUP_POINTER ||
        props.prop.type === BCMSPropType.MEDIA
      ) {
        cls += 'mt-0 pb-0';
      } else if (
        props.prop.type === BCMSPropType.ENTRY_POINTER &&
        props.prop.array
      ) {
        cls += 'mt-0';
      } else if (props.prop.array) {
        cls += 'pb-0';
      }

      return cls;
    });

    return () => (
      <div
        v-cy={props.cyTag}
        class={`entryEditor--prop_${
          props.prop.type === BCMSPropType.MEDIA
            ? BCMSPropType.GROUP_POINTER
            : props.prop.type
        } ${props.class} ${wrapperClass.value}`}
        style={props.style}
      >
        <div class={`w-full ${wrapperHeaderClass.value}`}>
          <div
            class={`flex items-center pb-1.5 border-b border-grey border-opacity-50 relative w-full justify-between ${wrapperInnerClass.value}`}
          >
            <div
              class={`flex items-center relative w-full ${wrapperDetailsClass.value}`}
            >
              <div
                class={`text-xs leading-normal tracking-0.06 uppercase flex-grow-0 mr-1 flex-shrink-0 ${
                  wrapperLabelClass.value || 'text-dark'
                }`}
              >
                {props.prop.label}
              </div>
              {props.prop.required ? (
                <BCMSIcon
                  class={`w-3.5 h-auto fill-current ${
                    wrapperRequiredClass.value || 'text-grey'
                  }`}
                  src="/lock"
                />
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
        <div
          class={`pb-4 ${wrapperBodyClass.value} ${
            props.prop.array && (props.prop.data as Array<unknown>).length > 0
              ? 'mt-5'
              : ''
          } ${!props.prop.array ? 'mt-5' : ''}`}
        >
          {ctx.slots.default ? ctx.slots.default() : ''}
        </div>
      </div>
    );
  },
});
export default component;
</script>
