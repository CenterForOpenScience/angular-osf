import { MenuItem } from 'primeng/api';

import {
  AUTHENTICATED_MENU_ITEMS,
  PREPRINT_MENU_ITEMS,
  PROJECT_MENU_ITEMS,
  REGISTRATION_MENU_ITEMS,
} from '../constants';
import { RouteContext } from '../models';

export function filterMenuItems(items: MenuItem[], isAuthenticated: boolean): MenuItem[] {
  return items.map((item) => {
    const isAuthenticatedItem = AUTHENTICATED_MENU_ITEMS.includes(item.id || '');

    let updatedItem: MenuItem = { ...item, visible: isAuthenticatedItem ? isAuthenticated : item.visible };

    if (item.id === 'home') {
      updatedItem = {
        ...updatedItem,
        routerLink: isAuthenticated ? '/dashboard' : '/',
        routerLinkActiveOptions: isAuthenticated ? { exact: false } : { exact: true },
      };
    }

    if (item.id === 'sign-in') {
      updatedItem = { ...updatedItem, visible: !isAuthenticated };
    }

    if (item.id === 'log-out') {
      updatedItem = { ...updatedItem, visible: isAuthenticated };
    }

    if (item.items) {
      updatedItem.items = filterMenuItems(item.items, isAuthenticated);
    }

    return updatedItem;
  });
}

export function updateMenuItems(menuItems: MenuItem[], ctx: RouteContext): MenuItem[] {
  return menuItems.map((item) => {
    if (item.id === 'my-resources') {
      return updateMyResourcesMenuItem(item, ctx);
    }

    if (item.id === 'projects') {
      return updateProjectMenuItem(item, ctx);
    }

    if (item.id === 'registries') {
      return updateRegistryMenuItem(item, ctx);
    }

    if (item.id === 'preprints') {
      return updatePreprintMenuItem(item, ctx);
    }

    if (item.id === 'collections') {
      return { ...item, visible: ctx.isCollections };
    }

    return item;
  });
}

function updateMyResourcesMenuItem(item: MenuItem, ctx: RouteContext): MenuItem {
  const currentUrl = ctx.currentUrl || '';
  const isMyResourcesActive =
    currentUrl.startsWith('/my-projects') ||
    currentUrl.startsWith('/my-registrations') ||
    currentUrl.startsWith('/my-preprints');

  return {
    ...item,
    expanded: isMyResourcesActive,
  };
}

function updateProjectMenuItem(item: MenuItem, ctx: RouteContext): MenuItem {
  const hasProject = ctx.isProject && !!ctx.resourceId;
  const items = (item.items || []).map((subItem) => {
    if (subItem.id === 'project-details') {
      if (hasProject) {
        return {
          ...subItem,
          visible: true,
          expanded: true,
          items: PROJECT_MENU_ITEMS.map((menuItem) => ({
            ...menuItem,
            routerLink: ['project', ctx.resourceId as string, menuItem.routerLink],
          })),
        };
      }
      return { ...subItem, visible: false, expanded: false };
    }
    return subItem;
  });

  return { ...item, visible: hasProject, expanded: hasProject, items };
}

function updateRegistryMenuItem(item: MenuItem, ctx: RouteContext): MenuItem {
  const hasRegistry = ctx.isRegistry && !!ctx.resourceId;
  const items = (item.items || []).map((subItem) => {
    if (subItem.id === 'registry-details') {
      if (hasRegistry) {
        return {
          ...subItem,
          visible: true,
          expanded: true,
          items: REGISTRATION_MENU_ITEMS.map((menuItem) => ({
            ...menuItem,
            routerLink: ['registries', ctx.resourceId as string, menuItem.routerLink],
          })),
        };
      }
      return { ...subItem, visible: false, expanded: false };
    }
    return subItem;
  });

  return { ...item, expanded: ctx.isRegistry, items };
}

function updatePreprintMenuItem(item: MenuItem, ctx: RouteContext): MenuItem {
  const hasPreprint = ctx.isPreprint && !!ctx.resourceId;
  const items = (item.items || []).map((subItem) => {
    if (subItem.id === 'preprints-details') {
      if (hasPreprint) {
        return {
          ...subItem,
          visible: true,
          expanded: true,
          items: PREPRINT_MENU_ITEMS.map((menuItem) => ({
            ...menuItem,
            routerLink: ['preprints', ctx.providerId, ctx.resourceId as string],
          })),
        };
      }
      return { ...subItem, visible: false, expanded: false };
    }
    return subItem;
  });

  return { ...item, expanded: ctx.isPreprint, items };
}
