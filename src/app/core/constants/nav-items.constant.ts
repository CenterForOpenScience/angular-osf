import { NavItem } from '@shared/entities/nav-item.interface';
import { MenuItem } from 'primeng/api';

export const NAV_ITEMS: NavItem[] = [
  {
    path: '/home',
    label: 'navigation.home',
    icon: 'home',
    useExactMatch: true,
  },
  {
    path: '/search',
    label: 'navigation.search-osf',
    icon: 'search',
    useExactMatch: true,
  },
  {
    path: '/support',
    label: 'navigation.support',
    icon: 'support',
    useExactMatch: true,
  },
  {
    path: '/my-projects',
    label: 'navigation.my-projects',
    icon: 'my-projects',
    useExactMatch: true,
  },
  {
    path: '/settings',
    label: 'navigation.settings',
    icon: 'settings',
    isCollapsible: true,
    useExactMatch: true,
    items: [
      {
        path: '/settings/profile-settings',
        label: 'navigation.profile-settings',
        useExactMatch: true,
      },
      {
        path: '/settings/account-settings',
        label: 'navigation.account-settings',
        useExactMatch: true,
      },
      {
        path: '/settings/addons',
        label: 'navigation.configure-addon-accounts',
        useExactMatch: false,
      },
      {
        path: '/settings/notifications',
        label: 'navigation.notifications',
        useExactMatch: true,
      },
      {
        path: '/settings/developer-apps',
        label: 'navigation.developer-apps',
        useExactMatch: true,
      },
      {
        path: '/settings/tokens',
        label: 'navigation.personal-access-tokens',
        useExactMatch: true,
      },
    ],
  },
  {
    path: '/donate',
    label: 'navigation.donate',
    icon: 'donate',
    useExactMatch: true,
  },
];

export const PROJECT_MENU_ITEMS: MenuItem[] = [
  {
    label: 'navigation.project.details',
    icon: 'osf-icon-my-projects',
    expanded: true,
    items: [
      { label: 'navigation.project.overview', routerLink: 'overview' },
      { label: 'navigation.project.metadata', routerLink: 'metadata' },
      { label: 'navigation.project.files', routerLink: 'files' },
      {
        label: 'navigation.project.registrations',
        routerLink: 'registrations',
      },
    ],
  },
];
