import { MenuItem } from 'primeng/api';

export const AUTHENTICATED_MENU_ITEMS: string[] = [
  'my-projects',
  'my-profile',
  'settings',
  'registries-my-registrations',
  'registry-details',
  'preprints-my-preprints',
  'preprints-my-reviewing',
  'settings',
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'home',
    routerLink: '/',
    label: 'navigation.home',
    icon: 'osf-icon-home',
    routerLinkActiveOptions: { exact: true },
    visible: true,
  },
  {
    id: 'search',
    routerLink: '/search',
    label: 'navigation.searchOsf',
    icon: 'osf-icon-search',
    routerLinkActiveOptions: { exact: false },
    styleClass: 'mb-5',
    visible: true,
  },
  {
    id: 'my-projects',
    routerLink: '/my-projects',
    label: 'navigation.myProjects',
    icon: 'osf-icon-my-projects',
    routerLinkActiveOptions: { exact: true },
    visible: false,
  },
  {
    id: 'registries',
    label: 'navigation.registries',
    icon: 'osf-icon-registries',
    visible: true,
    routerLinkActiveOptions: { exact: true },
    items: [
      {
        id: 'registries-overview',
        routerLink: '/registries/overview',
        label: 'navigation.registriesSubRoutes.overview',
        visible: true,
        routerLinkActiveOptions: { exact: true },
      },
      {
        id: 'registries-my-registrations',
        routerLink: '/registries/my-registrations',
        label: 'navigation.registriesSubRoutes.myRegistrations',
        visible: false,
        routerLinkActiveOptions: { exact: true },
      },
      {
        id: 'registry-details',
        routerLink: '/registry-overview',
        label: 'navigation.registriesSubRoutes.registryDetails',
        visible: false,
        routerLinkActiveOptions: { exact: true },
      },
    ],
  },
  {
    id: 'preprints',
    label: 'navigation.preprints',
    icon: 'osf-icon-preprints',
    visible: true,
    routerLinkActiveOptions: { exact: true },
    items: [
      {
        id: 'preprints-overview',
        routerLink: '/preprints/overview',
        label: 'navigation.preprintsSubRoutes.overview',
        visible: true,
        routerLinkActiveOptions: { exact: false },
      },
      {
        id: 'preprints-my-preprints',
        routerLink: 'preprints/my-preprints',
        label: 'navigation.preprintsSubRoutes.myPreprints',
        visible: false,
        routerLinkActiveOptions: { exact: false },
      },
      {
        id: 'preprints-my-reviewing',
        routerLink: '/preprints/my-reviewing',
        label: 'navigation.preprintsSubRoutes.myReviewing',
        visible: false,
        routerLinkActiveOptions: { exact: true },
      },
    ],
  },
  {
    id: 'my-profile',
    routerLink: '/my-profile',
    label: 'navigation.profile',
    icon: 'osf-icon-profile',
    visible: false,
    routerLinkActiveOptions: { exact: false },
  },
  {
    id: 'institutions',
    routerLink: '/institutions',
    label: 'navigation.institutions',
    icon: 'osf-icon-institutions',
    visible: true,
    routerLinkActiveOptions: { exact: false },
  },
  {
    id: 'collections',
    routerLink: '/collections',
    label: 'navigation.collections',
    icon: 'osf-icon-collections',
    visible: true,
    routerLinkActiveOptions: { exact: false },
  },
  {
    id: 'meetings',
    routerLink: '/meetings',
    label: 'navigation.meetings',
    icon: 'osf-icon-meetings',
    visible: true,
    routerLinkActiveOptions: { exact: false },
  },
  {
    id: 'settings',
    label: 'navigation.settings',
    icon: 'osf-icon-settings',
    routerLinkActiveOptions: { exact: true },
    styleClass: 'mt-5',
    visible: false,
    items: [
      {
        id: 'settings-profile-settings',
        routerLink: '/settings/profile-settings',
        label: 'navigation.profileSettings',
        visible: true,
        routerLinkActiveOptions: { exact: true },
      },
      {
        id: 'settings-account-settings',
        routerLink: '/settings/account-settings',
        label: 'navigation.accountSettings',
        visible: true,
        routerLinkActiveOptions: { exact: true },
      },
      {
        id: 'settings-addons',
        routerLink: '/settings/addons',
        label: 'navigation.configureAddonAccounts',
        visible: true,
        routerLinkActiveOptions: { exact: false },
      },
      {
        id: 'settings-notifications',
        routerLink: '/settings/notifications',
        label: 'navigation.notifications',
        visible: true,
        routerLinkActiveOptions: { exact: true },
      },
      {
        id: 'settings-developer-apps',
        routerLink: '/settings/developer-apps',
        label: 'navigation.developerApps',
        visible: true,
        routerLinkActiveOptions: { exact: false },
      },
      {
        id: 'settings-tokens',
        routerLink: '/settings/tokens',
        label: 'navigation.personalAccessTokens',
        visible: true,
        routerLinkActiveOptions: { exact: false },
      },
    ],
  },
];

export const PROJECT_MENU_ITEMS: MenuItem[] = [
  {
    id: 'project-details',
    label: 'navigation.project.details',
    icon: 'osf-icon-my-projects',
    expanded: true,
    visible: true,
    items: [
      { id: 'project-overview', label: 'navigation.project.overview', routerLink: 'overview', visible: true },
      { id: 'project-metadata', label: 'navigation.project.metadata', routerLink: 'metadata', visible: true },
      { id: 'project-files', label: 'navigation.project.files', routerLink: 'files', visible: true },
      {
        id: 'project-wiki',
        label: 'navigation.project.wiki',
        routerLink: 'wiki',
        visible: true,
      },
      {
        id: 'project-registrations',
        label: 'navigation.project.registrations',
        routerLink: 'registrations',
        visible: true,
      },
      {
        id: 'project-contributors',
        label: 'navigation.project.contributors',
        routerLink: 'contributors',
        visible: true,
      },
      {
        id: 'project-analytics',
        label: 'navigation.project.analytics',
        routerLink: 'analytics',
        visible: true,
      },
      {
        id: 'project-addons',
        label: 'navigation.project.addons',
        routerLink: 'addons',
        visible: true,
      },
      {
        id: 'project-settings',
        label: 'navigation.project.settings',
        routerLink: 'settings',
        visible: true,
      },
    ],
  },
];

export const REGISTRATION_MENU_ITEMS: MenuItem[] = [
  {
    id: 'registration-details',
    label: 'navigation.registration.details',
    icon: 'osf-icon-my-projects',
    expanded: true,
    visible: true,
    items: [
      { id: 'registration-overview', label: 'navigation.registration.overview', routerLink: 'overview', visible: true },
      { id: 'registration-metadata', label: 'navigation.registration.metadata', routerLink: 'metadata', visible: true },
      { id: 'registration-files', label: 'navigation.registration.files', routerLink: 'files', visible: true },
      {
        id: 'registration-resources',
        label: 'navigation.registration.resources',
        routerLink: 'resources',
        visible: true,
      },
      {
        id: 'registration-wiki',
        label: 'navigation.registration.wiki',
        routerLink: 'wiki',
        visible: true,
      },
      {
        id: 'registration-components',
        label: 'navigation.registration.components',
        routerLink: 'components',
        visible: true,
      },
      {
        id: 'registration-contributors',
        label: 'navigation.registration.contributors',
        routerLink: 'contributors',
        visible: true,
      },
      {
        id: 'registration-links',
        label: 'navigation.registration.links',
        routerLink: 'links',
        visible: true,
      },
      {
        id: 'registration-analytics',
        label: 'navigation.registration.analytics',
        routerLink: 'analytics',
        visible: true,
      },
    ],
  },
];

export const MODERATION_MENU_ITEM: MenuItem = {
  label: 'navigation.moderation',
  routerLink: 'moderation',
  state: {
    isModeration: true,
  },
};
