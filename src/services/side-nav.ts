import { User, RoleName } from '@becomes/cms-sdk';
import type { NavItem } from '../types';
import { sdk } from './sdk';
import {
  EntryIcon,
  KeyIcon,
  UsersIcon,
  LanguageIcon,
  MediaIcon,
  WidgetIcon,
  GroupIcon,
  TemplateIcon,
} from '../components/icons';
import { GeneralService } from './general';

export type SideNavServicePrototype = {
  getUser(): Promise<User>;
  getAdministration(): NavItem[];
  getEntries(): Promise<Array<NavItem & { templateId: string }>>;
};

function sideNavService(): SideNavServicePrototype {
  let user: User;
  let administration: NavItem[];
  let entries: Array<NavItem & { templateId: string }>;
  return {
    async getUser() {
      return GeneralService.errorWrapper(
        async () => {
          return await sdk.user.get();
        },
        async (value: User) => {
          user = value;
          return user;
        }
      );
    },
    getAdministration() {
      if (!administration) {
        administration = [
          {
            name: 'Templates',
            link: '/dashboard/template/editor/-',
            icon: TemplateIcon,
            visible: false,
            selected: false,
          },
          {
            name: 'Groups',
            link: '/dashboard/group/editor/-',
            icon: GroupIcon,
            visible: false,
            selected: false,
          },
          {
            name: 'Widgets',
            link: '/dashboard/widget/editor/-',
            icon: WidgetIcon,
            visible: false,
            selected: false,
          },
          {
            name: 'Media',
            link: '/dashboard/media/editor/-',
            icon: MediaIcon,
            visible: false,
            selected: false,
          },
          {
            name: 'Languages',
            link: '/dashboard/language/editor/-',
            icon: LanguageIcon,
            visible: false,
            selected: false,
          },
          {
            name: 'Members',
            link: '/dashboard/user/editor/-',
            icon: UsersIcon,
            visible: false,
            selected: false,
          },
          {
            name: 'Key Manager',
            link: '/dashboard/key/editor/-',
            icon: KeyIcon,
            visible: false,
            selected: false,
          },
        ];
        administration.forEach((item) => {
          if (user.roles[0].name === RoleName.ADMIN) {
            item.visible = true;
          } else {
            if (
              item.link === '/dashboard/media/editor' &&
              user.customPool.policy.media.get === true
            ) {
              item.visible = true;
            }
            if (
              item.link === '/dashboard/custom' &&
              user.customPool.policy.customPortal.get === true
            ) {
              item.visible = true;
            }
          }
        });
      }
      return administration;
    },
    async getEntries() {
      const templates = await sdk.template.getAll();
      entries = templates.map((template) => {
        const userTemplatePolicy = user.customPool.policy.templates.find(
          (e) => e._id === template._id
        );
        const link = `/dashboard/template/${template._id}/entry`;
        return {
          templateId: template._id,
          name: template.label,
          link,
          icon: EntryIcon,
          selected: link === window.location.pathname ? true : false,
          visible:
            user.roles[0].name === RoleName.ADMIN
              ? true
              : userTemplatePolicy
              ? userTemplatePolicy.get
              : false,
        };
      });
      return entries;
    },
  };
}

export const SideNavService = sideNavService();
