import { NavItem } from '@osf/shared/entities/nav-item.interface';

export const NAV_ITEMS: NavItem[] = [
  { path: '/home', label: 'Home', icon: 'home' },
  { path: '', label: 'Search OSF', icon: 'search' },
  {
    path: '/support',
    label: 'Support',
    icon: 'support',
  },
  {
    path: '/donate',
    label: 'Donate',
    icon: 'donate',
  },
];
