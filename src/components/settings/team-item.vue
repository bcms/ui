<script lang="tsx">
import { defineComponent } from 'vue';
import { BCMSIcon } from '..';
import { DefaultComponentProps } from '../_default';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    // TODO: Handle this prop/type
    item: {
      type: Object,
      required: true,
    },
    invitation: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    function handleViewClick() {
      window.bcms.modal.settings.view.show({});
    }

    return () => (
      <div
        class={`flex flex-col justify-between gap-4 sm:flex-row sm:items-center sm:gap-0`}
      >
        <div class="flex items-center">
          <div class="relative flex">
            {props.invitation ? (
              <div class="flex items-center justify-center bg-pink w-10 h-10 rounded-full mr-2.5">
                <BCMSIcon
                  src="/administration/users"
                  class="w-6 h-6 text-white fill-current"
                />
              </div>
            ) : (
              <img
                src={props.item.avatar}
                alt={props.item.name}
                class="w-10 h-10 rounded-full object-cover mr-2.5"
              />
            )}
            {props.item.role === 'admin' && (
              <BCMSIcon
                src="/administration/admin-role"
                class="absolute -bottom-2 right-0 bg-white rounded-full  w-6 h-6 text-green fill-current"
              />
            )}
            {props.item.role === 'developer' && (
              <div class="absolute -bottom-1.5 right-1 bg-white rounded-full flex justify-center items-center w-5.5 h-5.5 border-2 border-green">
                <span class="relative font-bold text-green top-px tracking-tighter">
                  D
                </span>
              </div>
            )}
          </div>
          <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2.5">
            <span class="leading-tight -tracking-0.01">{props.item.name}</span>
            <span class="font-semibold leading-tight -tracking-0.01 truncate">
              {props.item.email}
            </span>
          </div>
        </div>
        {props.invitation ? (
          <span class="font-medium leading-tight -tracking-0.01 text-grey mr-1.5">
            Pending
          </span>
        ) : (
          <button
            class="self-start text-green flex items-center font-semibold leading-tight -tracking-0.01 mr-1.5 sm:self-center"
            onClick={handleViewClick}
          >
            View
          </button>
        )}
      </div>
    );
  },
});

export default component;
</script>
