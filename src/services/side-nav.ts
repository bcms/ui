import type { User } from '@becomes/cms-sdk';
import type { NavItem } from '../types';
import { sdk } from './sdk';

export type SideNavServicePrototype = {
  getUser(): Promise<User>;
  getAdministration(): NavItem[];
  getEntries(): Promise<NavItem[]>;
};

function sideNavService(): SideNavServicePrototype {
  let user: User;
  let administration: NavItem[];
  let entries: NavItem[];
  return {
    async getUser() {
      if (!user) {
        user = await sdk.user.get();
        console.log('USER', user);
      }
      return user;
    },
    getAdministration() {
      if (!administration) {
        administration = [
          {
            name: 'Template Manager',
            link: '/dashboard/template/editor/-',
            icon: 'fas fa-cubes',
            visable: false,
            selected: false,
          },
          {
            name: 'Group Manager',
            link: '/dashboard/group/editor/-',
            icon: 'fas fa-layer-group',
            visable: false,
            selected: false,
          },
          {
            name: 'Widget Manager',
            link: '/dashboard/widget/editor/-',
            icon: 'fas fa-pepper-hot',
            visable: false,
            selected: false,
          },
          {
            name: 'Media Manager',
            link: '/dashboard/media/editor',
            icon: 'fa fa-folder',
            visable: false,
            selected: false,
          },
          {
            name: 'Language Manager',
            link: '/dashboard/language/editor/-',
            icon: 'fas fa-globe-europe',
            visable: false,
            selected: false,
          },
          {
            name: 'Users Manager',
            link: '/dashboard/user/editor/-',
            icon: 'fas fa-users',
            visable: false,
            selected: false,
          },
          {
            name: 'Key Manager',
            link: '/dashboard/key/editor/-',
            icon: 'fas fa-key',
            visable: false,
            selected: false,
          },
        ];
        administration.forEach((item) => {
          if (user.roles[0].name === 'ADMIN') {
            item.visable = true;
          } else {
            if (
              item.link === '/dashboard/media/editor' &&
              user.customPool.policy.media.get === true
            ) {
              item.visable = true;
            }
            if (
              item.link === '/dashboard/custom' &&
              user.customPool.policy.customPortal.get === true
            ) {
              item.visable = true;
            }
          }
        });
      }
      return administration;
    },
    async getEntries() {
      if (!entries) {
        const templates = await sdk.template.getAll();
        entries = templates.map((template) => {
          const link = `/dashboard/template/${template._id}/entry`;
          return {
            name: template.label,
            link,
            icon: 'fas fa-pencil-alt',
            selected: link === window.location.pathname ? true : false,
            visable:
              user.roles[0].name === 'ADMIN'
                ? true
                : user.customPool.policy.templates.find(
                    (e) => e._id === template._id
                  )
                ? true
                : false,
          };
        });
      }
      return entries;
    },
  };
}

export const SideNavService = sideNavService();
