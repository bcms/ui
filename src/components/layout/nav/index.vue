<script lang="tsx">
import { computed, defineComponent, onMounted, ref, Ref } from 'vue';
import {
  BCMSJwtRoleName,
  BCMSTemplate,
  BCMSTemplateOrganizer,
  BCMSUserPolicyCRUD,
} from '@becomes/cms-sdk/types';
import { BCMSNavItemMergeEvent, BCMSNavItemType } from '../../../types';
import NavigationLogo from './logo.vue';
import BCMSIcon from '../../icon.vue';
import BCMSNavItem from './item.vue';
import { useRoute, useRouter } from 'vue-router';

interface OrganizerExtended extends BCMSTemplateOrganizer {
  templates: BCMSTemplate[];
}

const component = defineComponent({
  setup() {
    const throwable = window.bcms.util.throwable;
    const store = window.bcms.vue.store;
    const stringUtil = window.bcms.util.string;
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
        let templatePath = '/dashboard/t';
        if (path.startsWith('/dashboard/t')) {
          const parts = path.split('/');
          if (parts.length === 4) {
            templatePath =
              templatePath.split('/').slice(0, 3).join('/') + `/${parts[3]}`;
          }
        }
        let groupPath = '/dashboard/g';
        if (path.startsWith('/dashboard/g')) {
          const parts = path.split('/');
          if (parts.length === 4) {
            groupPath =
              groupPath.split('/').slice(0, 3).join('/') + `/${parts[3]}`;
          }
        }
        let widgetPath = '/dashboard/w';
        if (path.startsWith('/dashboard/w')) {
          const parts = path.split('/');
          if (parts.length === 4) {
            widgetPath =
              widgetPath.split('/').slice(0, 3).join('/') + `/${parts[3]}`;
          }
        }
        let mediaPath = '/dashboard/media';
        if (path.startsWith('/dashboard/media')) {
          const parts = path.split('/');
          if (parts.length === 4) {
            mediaPath =
              mediaPath.split('/').slice(0, 3).join('/') + `/${parts[3]}`;
          }
        }
        const isAdmin = user.value.roles[0].name === BCMSJwtRoleName.ADMIN;
        const data: BCMSNavItemType[] = [
          {
            type: 'child',
            name: 'Templates',
            onClick: (event) => {
              logic.onNavItemClick(templatePath, event);
            },
            href: templatePath,
            icon: '/administration/template',
            visible: isAdmin,
            selected: logic.isSelected('template', path),
          },
          {
            type: 'child',
            name: 'Groups',
            href: groupPath,
            onClick: (event) => {
              logic.onNavItemClick(groupPath, event);
            },
            icon: '/administration/group',
            visible: isAdmin,
            selected: logic.isSelected('group', path),
          },
          {
            type: 'child',
            name: 'Widgets',
            href: widgetPath,
            onClick: (event) => {
              logic.onNavItemClick(widgetPath, event);
            },
            icon: '/administration/widget',
            visible: isAdmin,
            selected: logic.isSelected('widget', path),
          },
          {
            type: 'child',
            name: 'Media',
            href: mediaPath,
            onClick: (event) => {
              logic.onNavItemClick(mediaPath, event);
            },
            icon: '/administration/media',
            visible: isAdmin || user.value.customPool.policy.media.get,
            selected: logic.isSelected('media', path),
          },
        ];
        return {
          show: true,
          extended:
            !!data.find((e) => e.selected) ||
            store.getters.entryLite_items.length === 0,
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
      root?: BCMSNavItemType;
      show: boolean;
      extended: boolean;
    }> = computed(() => {
      if (user.value) {
        const organizers = store.getters.templateOrganizer_items;
        const tmps = store.getters.template_items;
        const isAdmin = user.value.roles[0].name === BCMSJwtRoleName.ADMIN;
        const policy = user.value.customPool.policy.templates;
        const items: BCMSNavItemType[] = logic.aggregateOrganizersAndTemplates({
          organizers,
          templates: tmps,
          isAdmin,
          policy,
        });

        return {
          show: tmps.length > 0,
          extended: templates.value
            ? templates.value.extended
            : tmps.length > 0,
          root: {
            id: 'root',
            draggableType: 'organizer',
            type: 'parent',
            name: 'Entries',
            visible: true,
            selected: templates.value
              ? templates.value.extended
              : tmps.length > 0,
            children: items,
          },
        };
      }
      return {
        root: undefined,
        show: false,
        extended: true,
      };
    });
    const pluginsList = ref<string[]>([]);
    const plugins: Ref<{
      data: BCMSNavItemType[];
      show: boolean;
      extended: boolean;
    }> = computed(() => {
      if (user.value) {
        const isAdmin = user.value.roles[0].name === BCMSJwtRoleName.ADMIN;
        const policy = user.value.customPool.policy.plugins;
        const data: BCMSNavItemType[] = pluginsList.value
          .filter((e) => isAdmin || !!policy.find((t) => t.get && t.name === e))
          .map((e) => {
            const path = `/dashboard/plugin/${e}`;
            const navItem: BCMSNavItemType = {
              type: 'child',
              name: stringUtil.toPretty(e),
              onClick: path,
              icon: '/wind',
              visible: true,
              selected: route.path.startsWith(path),
              ignoreSelected: true,
            };
            return navItem;
          })
          .sort((a, b) => (b.name < a.name ? 1 : -1));
        return {
          show: pluginsList.value.length > 0,
          extended: !!data.find((e) => e.selected),
          data,
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
        path: string
      ): boolean {
        switch (target) {
          case 'template':
            {
              if (path === '/dashboard/t') {
                return true;
              } else {
                const parts = path.split('/');
                if (parts.length === 4 && parts[2] === 't') {
                  return true;
                }
              }
            }
            break;
          case 'group':
            {
              if (path === '/dashboard/g') {
                return true;
              } else {
                const parts = path.split('/');
                if (parts.length === 4 && parts[2] === 'g') {
                  return true;
                }
              }
            }
            break;
          case 'widget':
            {
              if (path === '/dashboard/w') {
                return true;
              } else {
                const parts = path.split('/');
                if (parts.length === 4 && parts[2] === 'w') {
                  return true;
                }
              }
            }
            break;
          case 'media':
            {
              if (path === '/dashboard/media') {
                return true;
              } else {
                const parts = path.split('/');
                if (parts.length === 4 && parts[2] === 'media') {
                  return true;
                }
              }
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
      onNavItemClick(path: string, event?: Event) {
        if (event) {
          event.preventDefault();
          isMobileNavOpen.value = false;
          document.body.style.overflowY = 'auto';
          router.push(path);
        }
      },
      handleMerge(event: BCMSNavItemMergeEvent): void {
        const rootItem = templates.value.root as BCMSNavItemType;
        const result = logic.findNavItem([rootItem], event.targetId);
        if (result) {
          const targetItem = result.item;
          const srcItem = event.src;
          if (
            targetItem.parentId !== 'root' &&
            srcItem.parentId !== 'root' &&
            targetItem.parentId === srcItem.parentId
          ) {
            window.bcms.notification.warning(
              `"${targetItem.name}" and "${srcItem.name}" are already in the same collection.`
            );
            return;
          }
          if (
            targetItem.draggableType === 'template' &&
            srcItem.draggableType === 'template'
          ) {
            if (targetItem.parentId !== 'root') {
              throwable(async () => {
                const organizer = store.getters.templateOrganizer_findOne(
                  (e) => e._id === targetItem.parentId
                );
                if (organizer) {
                  organizer.templateIds.push(srcItem.id as string);
                  await window.bcms.sdk.templateOrganizer.update({
                    _id: organizer._id,
                    templateIds: organizer.templateIds,
                  });
                }
              });
            } else {
              window.bcms.modal.templateOrganizer.create.show({
                async onDone(data) {
                  await throwable(async () => {
                    await window.bcms.sdk.templateOrganizer.create({
                      label: data.name,
                      templateIds: [
                        srcItem.id as string,
                        targetItem.id as string,
                      ],
                    });
                  });
                },
              });
            }
          } else if (targetItem.id === 'root' && srcItem.parentId !== 'root') {
            const organizer = store.getters.templateOrganizer_findOne(
              (e) => e._id === srcItem.parentId
            );
            if (organizer) {
              throwable(async () => {
                organizer.templateIds = organizer.templateIds.filter(
                  (e) => e !== srcItem.id
                );
                if (organizer.templateIds.length === 0) {
                  await window.bcms.sdk.templateOrganizer.deleteById(
                    organizer._id
                  );
                } else {
                  await window.bcms.sdk.templateOrganizer.update({
                    _id: organizer._id,
                    templateIds: organizer.templateIds.filter(
                      (e) => e !== srcItem.id
                    ),
                  });
                }
              });
            }
          } else if (
            targetItem.draggableType === 'organizer' &&
            srcItem.draggableType === 'template'
          ) {
            const organizer = store.getters.templateOrganizer_findOne(
              (e) => e._id === targetItem.id
            );
            if (organizer) {
              throwable(async () => {
                if (srcItem.parentId !== 'root') {
                  const srcOrganizer = store.getters.templateOrganizer_findOne(
                    (e) => e._id === srcItem.parentId
                  );
                  if (srcOrganizer) {
                    srcOrganizer.templateIds = srcOrganizer.templateIds.filter(
                      (e) => e !== srcItem.id
                    );
                    if (srcOrganizer.templateIds.length === 0) {
                      await window.bcms.sdk.templateOrganizer.deleteById(
                        srcOrganizer._id
                      );
                    } else {
                      await window.bcms.sdk.templateOrganizer.update({
                        _id: srcOrganizer._id,
                        templateIds: srcOrganizer.templateIds,
                      });
                    }
                  }
                }
                organizer.templateIds.push(srcItem.id as string);
                await window.bcms.sdk.templateOrganizer.update({
                  _id: organizer._id,
                  templateIds: organizer.templateIds,
                });
              });
            }
          }
        }
      },
      findNavItem(
        items: BCMSNavItemType[],
        id: string,
        index?: string[]
      ): { item: BCMSNavItemType; index: string[] } | null {
        if (!index) {
          index = [];
        }
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.id === id) {
            index.push(`${i}`);
            return {
              index,
              item,
            };
          } else if (item.children) {
            index.push('children');
            const result = logic.findNavItem(item.children, id, index);
            if (result) {
              return result;
            }
            index.pop();
          }
        }
        return null;
      },
      aggregateOrganizersAndTemplates(data: {
        organizers: BCMSTemplateOrganizer[];
        templates: BCMSTemplate[];
        isAdmin: boolean;
        policy: Array<BCMSUserPolicyCRUD & { _id: string }>;
      }): BCMSNavItemType[] {
        const items: BCMSNavItemType[] = [];
        const extendedOrgs: OrganizerExtended[] = [];
        const foundTemplateIds: string[] = [];
        for (let i = 0; i < data.organizers.length; i++) {
          const organizer = data.organizers[i];
          if (organizer.templateIds.length > 0) {
            const extendedOrg: OrganizerExtended = {
              ...organizer,
              templates: [],
            };
            for (let j = 0; j < organizer.templateIds.length; j++) {
              const templateId = organizer.templateIds[j];
              const template = data.templates.find((e) => e._id === templateId);
              if (template) {
                foundTemplateIds.push(template._id);
                extendedOrg.templates.push(template);
              }
            }
            extendedOrgs.push(extendedOrg);
          }
        }
        if (foundTemplateIds.length !== data.templates.length) {
          for (let i = 0; i < data.templates.length; i++) {
            const template = data.templates[i];
            let path: string;
            if (template.singleEntry) {
              path = `/dashboard/t/${template.cid}/e/1`;
            } else {
              path = `/dashboard/t/${template.cid}/e`;
            }
            if (
              !foundTemplateIds.includes(template._id) &&
              (data.isAdmin || data.policy.find((t) => t._id === template._id))
            ) {
              items.push({
                id: template._id,
                parentId: 'root',
                type: 'child',
                draggableType: 'template',
                name: template.label,
                href: path,
                onClick: (event) => {
                  logic.onNavItemClick(path, event);
                },
                icon: '/entries/entry',
                visible: true,
                selected: route.path.startsWith(path),
                ignoreSelected: true,
              });
            }
          }
        }
        const organizeredItems = logic.aggregateExtendedOrganizers({
          organizers: extendedOrgs,
          forParent: '',
          isAdmin: data.isAdmin,
          policy: data.policy,
        });
        return [...organizeredItems, ...items];
      },
      aggregateExtendedOrganizers(data: {
        organizers: OrganizerExtended[];
        forParent: string;
        isAdmin: boolean;
        policy: Array<BCMSUserPolicyCRUD & { _id: string }>;
      }): BCMSNavItemType[] {
        const items: BCMSNavItemType[] = [];
        for (let i = 0; i < data.organizers.length; i++) {
          const organizer = data.organizers[i];
          if (
            organizer.parentId === data.forParent ||
            (!organizer.parentId && !data.forParent)
          ) {
            const item: BCMSNavItemType = {
              id: organizer._id,
              draggableType: 'organizer',
              parentId: organizer.parentId ? organizer.parentId : 'root',
              type: 'parent',
              name: organizer.label,
              visible: true,
              selected: false,
              children: organizer.templates
                .filter(
                  (template) =>
                    data.isAdmin ||
                    data.policy.find((e) => e._id === template._id)
                )
                .map((template) => {
                  let path: string;
                  if (template.singleEntry) {
                    path = `/dashboard/t/${template.cid}/e/1`;
                  } else {
                    path = `/dashboard/t/${template.cid}/e`;
                  }
                  return {
                    id: template._id,
                    parentId: organizer._id,
                    type: 'child',
                    draggableType: 'template',
                    name: template.label,
                    href: path,
                    onClick: (event) => {
                      logic.onNavItemClick(path, event);
                    },
                    icon: '/entries/entry',
                    visible: true,
                    selected: route.path.startsWith(path),
                    ignoreSelected: true,
                  };
                }),
            };
            (item.children as BCMSNavItemType[]).sort((a, b) =>
              b.name < a.name ? 1 : -1
            );
            const children = logic.aggregateExtendedOrganizers({
              organizers: data.organizers,
              forParent: organizer._id,
              isAdmin: data.isAdmin,
              policy: data.policy,
            });
            if (children.length > 0) {
              (item.children as BCMSNavItemType[]) = [
                ...children,
                ...(item.children as BCMSNavItemType[]),
              ];
            }
            items.push(item);
          }
        }
        return items;
      },
    };

    onMounted(async () => {
      if (await window.bcms.sdk.isLoggedIn()) {
        jwt.value = window.bcms.sdk.getAccessToken();
        if (!user.value) {
          await throwable(async () => {
            await window.bcms.sdk.templateOrganizer.getAll();
            return window.bcms.sdk.user.get();
          });
          await throwable(async () => {
            return await window.bcms.sdk.template.getAll();
          });
        }
        await throwable(
          async () => {
            return (await window.bcms.sdk.send({
              url: '/plugin/list',
              method: 'GET',
            })) as { items: string[] };
          },
          async (result) => {
            pluginsList.value = result.items;
          }
        );
      }
    });

    return () => (
      <nav
        v-cy={'side-nav'}
        class={`sideNav ${
          isMobileNavOpen.value ? 'is-active' : ''
        } bcmsScrollbar`}
      >
        <div class="sideNav--top">
          <NavigationLogo />
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
            {plugins.value.show ? (
              <BCMSNavItem
                item={{
                  type: 'parent',
                  name: 'Plugins',
                  visible: true,
                  selected: plugins.value.extended,
                  children: plugins.value.data,
                }}
              />
            ) : (
              ''
            )}
            {templates.value.show && templates.value.root ? (
              <BCMSNavItem
                item={templates.value.root}
                cyTag="entries"
                draggable={true}
                onMerge={logic.handleMerge}
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
