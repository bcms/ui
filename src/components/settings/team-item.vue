<script lang="tsx">
import type { BCMSUser } from '@becomes/cms-sdk/types';
import { BCMSJwtRoleName } from '@becomes/cms-sdk/types';
import { computed, defineComponent, PropType } from 'vue';
import { BCMSIcon } from '..';
import { useTranslation } from '../../translations';
import { DefaultComponentProps } from '../_default';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    item: {
      type: Object as PropType<BCMSUser>,
      required: true,
    },
    invitation: {
      type: Boolean,
      default: false,
    },
    isAdmin: Boolean,
  },
  setup(props) {
    const translations = computed(() => {
      return useTranslation();
    });
    const throwable = window.bcms.util.throwable;

    function handleViewClick() {
      window.bcms.modal.settings.view.show({
        user: props.item,
        async onDone(data) {
          await throwable(
            async () => {
              await window.bcms.sdk.user.update({
                _id: props.item._id,
                customPool: {
                  policy: data.policy,
                },
              });
            },
            async () => {
              window.bcms.notification.success(
                translations.value.modal.viewUser.notification.userPolicySuccess
              );
            }
          );
        },
      });
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
            ) : props.item.customPool.personal.avatarUri ? (
              <img
                src={props.item.customPool.personal.avatarUri}
                alt={props.item.username}
                class="w-10 h-10 rounded-full object-cover mr-2.5"
              />
            ) : (
              <div class="w-10 h-10 rounded-full bg-grey bg-opacity-70 border-2 border-green mr-2.5 flex justify-center items-center select-none dark:border-yellow">
                <span class="text-white font-semibold relative top-0.5">
                  {props.item.username
                    .split(' ')
                    .map((word) => word[0])
                    .slice(0, 2)
                    .join('')}
                </span>
              </div>
            )}
            {props.item.roles[0].name === BCMSJwtRoleName.ADMIN ? (
              <BCMSIcon
                src="/administration/admin-role"
                class="absolute -bottom-2 right-0 bg-white rounded-full  w-6 h-6 text-green fill-current dark:text-yellow"
              />
            ) : (
              <div class="absolute -bottom-1.5 right-1 bg-white rounded-full flex justify-center items-center w-5.5 h-5.5 border-2 border-green dark:border-yellow">
                <span class="relative font-bold text-green top-px tracking-tighter dark:text-dark">
                  D
                </span>
              </div>
            )}
          </div>
          <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2.5 dark:text-light">
            <span class="leading-tight -tracking-0.01">
              {props.item.username}
            </span>
            <span class="font-semibold leading-tight -tracking-0.01 truncate">
              {props.item.email}
            </span>
          </div>
        </div>
        {props.invitation ? (
          <span class="font-medium leading-tight -tracking-0.01 text-grey mr-1.5">
            {translations.value.page.settings.team.pendingCta}
          </span>
        ) : props.item.roles[0].name !== BCMSJwtRoleName.ADMIN &&
          props.isAdmin ? (
          <button
            class="self-start text-green flex items-center font-semibold leading-tight -tracking-0.01 mr-1.5 sm:self-center dark:text-yellow"
            onClick={handleViewClick}
          >
            {translations.value.page.settings.team.viewCta}
          </button>
        ) : (
          ''
        )}
      </div>
    );
  },
});

export default component;
</script>
