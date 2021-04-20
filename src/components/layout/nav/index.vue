<script lang="tsx">
import { computed, defineComponent, onMounted, ref, Ref } from 'vue';
import { BCMSRoleName } from '@becomes/cms-sdk/types';
import { useRoute, useRouter } from 'vue-router';
import { BCMSNavItemType } from '../../../types';
import { MutationTypes, useStore } from '../../../store';
import { BCMSIcon, BCMSLink, BCMSNavItem } from '../../index';

const component = defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const isMobileNavOpen = ref(false);
    const jwt = ref(window.bcms.sdk.getAccessToken());
    const user = computed(() => {
      if (jwt.value) {
        return store.getters.user_findOne(
          (e) => e._id === jwt.value?.payload.userId
        );
      }
      return null;
    });
    const administration: Ref<{
      data: BCMSNavItemType[];
      show: boolean;
      extended: boolean;
    }> = computed(() => {
      if (user.value) {
        const path = route.path;
        let templatePath = '/dashboard/template';
        if (path.startsWith('/dashboard/template')) {
          const parts = path.split('/');
          if (parts.length === 4) {
            templatePath =
              templatePath.split('/').slice(0, 3).join('/') + `/${parts[3]}`;
          }
        }
        const isAdmin = user.value.roles[0].name === BCMSRoleName.ADMIN;
        const data: BCMSNavItemType[] = [
          {
            type: 'child',
            name: 'Templates',
            onClick: templatePath,
            icon: '/administration/template',
            visible: isAdmin,
            selected: logic.isSelected('template', path),
          },
          {
            type: 'child',
            name: 'Groups',
            onClick: '/dashboard/group',
            icon: '/administration/group',
            visible: isAdmin,
            selected: false,
          },
          {
            type: 'child',
            name: 'Widgets',
            onClick: '/dashboard/widget',
            icon: '/administration/widget',
            visible: isAdmin,
            selected: false,
          },
          {
            type: 'child',
            name: 'Media',
            onClick: '/dashboard/media',
            icon: '/administration/media',
            visible: isAdmin || user.value.customPool.policy.media.get,
            selected: false,
          },
        ];
        return {
          show: true,
          extended: !!data.find((e) => e.selected),
          data,
        };
      }
      return {
        data: [],
        show: false,
        extended: false,
      };
    });
    const templates: Ref<{
      data: BCMSNavItemType[];
      show: boolean;
      extended: boolean;
    }> = computed(() => {
      if (user.value) {
        const isAdmin = user.value.roles[0].name === BCMSRoleName.ADMIN;
        const policy = user.value.customPool.policy.templates;
        const tmps = store.getters.template_items;
        return {
          show: tmps.length > 0,
          extended: templates.value
            ? templates.value.extended
            : tmps.length > 0,
          data: tmps
            .filter((e) => isAdmin || !!policy.find((t) => t._id === e._id))
            .map((e) => {
              const navItem: BCMSNavItemType = {
                type: 'child',
                name: e.label,
                onClick: `/dashboard/template/${e._id}/entry`,
                icon: '/entries/entry',
                visible: true,
                selected: false,
              };
              return navItem;
            }),
        };
      }
      return {
        data: [],
        show: false,
        extended: true,
      };
    });

    const logic = {
      isSelected(
        target: 'template' | 'group' | 'widget' | 'media' | 'entry',
        path: string,
        templateId?: string
      ): boolean {
        switch (target) {
          case 'template':
            {
              if (path === '/dashboard/template') {
                return true;
              } else {
                const parts = path.split('/');
                if (parts.length === 4) {
                  return true;
                }
              }
            }
            break;
          case 'group':
            {
              // TODO
            }
            break;
          case 'widget':
            {
              // TODO
            }
            break;
          case 'media':
            {
              // TODO
            }
            break;
          case 'entry':
            {
              // TODO
            }
            break;
        }
        return false;
      },
      toggleMobileNav() {
        isMobileNavOpen.value = !isMobileNavOpen.value;
        if (isMobileNavOpen.value) {
          document.body.style.overflowY = 'hidden';
        } else {
          document.body.style.overflowY = 'auto';
        }
      },
    };

    onMounted(async () => {
      if ((await window.bcms.sdk.isLoggedIn()) === false) {
        await router.push(
          `/?error=${encodeURIComponent('You are not logged in.')}`
        );
        return;
      }
      jwt.value = window.bcms.sdk.getAccessToken();
      if (!user.value) {
        await window.bcms.services.error.wrapper(
          async () => {
            return window.bcms.sdk.user.get();
          },
          async (result) => {
            if (result) {
              store.commit(MutationTypes.user_set, result);
            }
          }
        );
        await window.bcms.services.error.wrapper(
          async () => {
            return await window.bcms.sdk.template.getAll();
          },
          async (result) => {
            store.commit(MutationTypes.template_set, result);
          }
        );
      }
    });

    return () => (
      <nav
        v-cy={'side-nav'}
        class={`sideNav ${
          isMobileNavOpen.value ? 'is-active' : ''
        } customScrollbar`}
      >
        <div class="sideNav--top">
          <BCMSLink cyTag="go-home" href="/dashboard" class="sideNav--logo">
            <BCMSIcon src="/logo" />
          </BCMSLink>
          <button
            v-cy={'open-nav-mob'}
            aria-label="Toggle navigation"
            onClick={logic.toggleMobileNav}
          >
            <BCMSIcon src="/nav" />
          </button>
        </div>
        <div class="sideNav--wrapper">
          <div class="sideNav--inner">
            {administration.value.show ? (
              <BCMSNavItem
                item={{
                  type: 'parent',
                  name: 'Administration',
                  visible: true,
                  selected: administration.value.extended,
                  children: administration.value.data,
                }}
              />
            ) : (
              ''
            )}
            {templates.value.show ? (
              <BCMSNavItem
                item={{
                  type: 'parent',
                  name: 'Entries',
                  visible: true,
                  selected: templates.value.extended,
                  children: templates.value.data,
                }}
              />
            ) : (
              ''
            )}
          </div>
        </div>
      </nav>
    );
  },
});
export default component;
</script>
