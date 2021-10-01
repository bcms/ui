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

      if (props.prop.array || props.prop.type === BCMSPropType.GROUP_POINTER) {
        cls +=
          'border-green mb-10 rounded-2.5 border border-solid px-5 pb-6 relative border-t-0 rounded-t-none ';
      }
      if (props.prop.array) {
        cls += 'mx-0 mt-7.5 pt-9 last:mb-7.5';
      } else if (props.prop.type === BCMSPropType.GROUP_POINTER) {
        cls += 'mt-2.5 pt-2 last:mb-2.5';
      }

      return cls;
    });

    const wrapperHeaderClass = computed(() => {
      let cls = '';

      if (props.prop.array || props.prop.type === BCMSPropType.GROUP_POINTER) {
        cls += 'absolute -top-2.5 -left-px flex items-center justify-between';
      }

      return cls;
    });

    const wrapperInnerClass = computed(() => {
      let cls = '';

      if (props.prop.array || props.prop.type === BCMSPropType.GROUP_POINTER) {
        cls += 'border-none ';
      } else if (props.prop.type === BCMSPropType.MEDIA) {
        cls += 'mb-0';
      }

      return cls;
    });

    const wrapperDetailsClass = computed(() => {
      let cls = '';

      if (props.prop.array || props.prop.type === BCMSPropType.GROUP_POINTER) {
        cls += 'pl-4 pr-3.5 translate-x-0 translate-y-[-7px]';
      }

      return cls;
    });

    const wrapperLabelClass = computed(() => {
      let cls = '';

      if (props.prop.array || props.prop.type === BCMSPropType.GROUP_POINTER) {
        cls += 'text-inherit';
      }

      return cls;
    });

    const wrapperRequiredClass = computed(() => {
      let cls = '';

      if (props.prop.array || props.prop.type === BCMSPropType.GROUP_POINTER) {
        cls += 'text-green';
      }

      return cls;
    });

    const wrapperBodyClass = computed(() => {
      let cls = '';

      if (props.prop.type === BCMSPropType.MEDIA) {
        cls += 'mt-1.5';
      } else if (props.prop.type === BCMSPropType.GROUP_POINTER) {
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
        class={`entryEditor--prop entryEditor--prop_${props.prop.type} ${
          props.prop.array ? 'entryEditor--prop_ARRAY' : ''
        } ${props.class} ${wrapperClass.value}`}
        style={props.style}
      >
        <div
          class={`entryEditor--prop-header w-full ${wrapperHeaderClass.value}`}
        >
          <div
            class={`entryEditor--prop-header-inner flex items-center pb-1.5 border-b border-grey border-opacity-50 relative w-full justify-between ${wrapperInnerClass.value}`}
          >
            <div
              class={`entryEditor--prop-header-details flex items-center relative w-full ${wrapperDetailsClass.value}`}
            >
              <div
                class={`entryEditor--prop-header-label text-xs leading-normal tracking-0.06 uppercase flex-grow-0 mr-1 flex-shrink-0 ${
                  wrapperLabelClass.value || 'text-dark'
                }`}
              >
                {props.prop.label}
              </div>
              {props.prop.required ? (
                <BCMSIcon
                  class={`entryEditor--prop-header-required w-3.5 h-auto fill-current ${
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
          class={`entryEditor--prop-body pb-4 ${wrapperBodyClass.value} ${
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
