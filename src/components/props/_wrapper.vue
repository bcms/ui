<script lang="tsx">
import { defineComponent, PropType } from 'vue';
import { DefaultComponentProps } from '../_default';
import BCMSIcon from '../icon.vue';
import { BCMSPropValueExtended } from '../../types';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    prop: {
      type: Object as PropType<BCMSPropValueExtended>,
      required: true,
    },
  },
  setup(props, ctx) {
    return () => (
      <div
        v-cy={props.cyTag}
        class={`entryEditor--prop entryEditor--prop_${props.prop.type} ${
          props.prop.array ? 'entryEditor--prop_ARRAY' : ''
        } ${props.class}`}
        style={props.style}
      >
        <div class="entryEditor--prop-header">
          <div class="entryEditor--prop-header-inner">
            <div class="entryEditor--prop-header-details">
              <div class="entryEditor--prop-header-label">
                {props.prop.label}
              </div>
              {props.prop.required ? (
                <BCMSIcon
                  class="entryEditor--prop-header-required"
                  src="/lock"
                />
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
        <div class="entryEditor--prop-body">
          {ctx.slots.default ? ctx.slots.default() : ''}
        </div>
      </div>
    );
  },
});
export default component;
</script>
