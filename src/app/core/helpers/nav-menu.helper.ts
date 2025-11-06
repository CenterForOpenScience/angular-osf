import {
  AUTHENTICATED_MENU_ITEMS,
  PREPRINT_MENU_ITEMS,
  PROJECT_MENU_ITEMS,
  REGISTRATION_MENU_ITEMS,
  VIEW_ONLY_PROJECT_MENU_ITEMS,
  VIEW_ONLY_REGISTRY_MENU_ITEMS,
} from '@core/constants/nav-items.constant';
import { RouteContext } from '@core/models/route-context.model';
import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';
import { getViewOnlyParamFromUrl } from '@osf/shared/helpers/view-only.helper';

import { CustomMenuItem } from '../models/custom-menu-item.model';

function shouldShowMenuItem(menuItem: CustomMenuItem, permissions: UserPermissions[] | undefined): boolean {
  if (!menuItem.requiredPermission) {
    return true;
  }

  return permissions?.length ? permissions.includes(menuItem.requiredPermission) : false;
}

export function filterMenuItems(items: CustomMenuItem[], isAuthenticated: boolean): CustomMenuItem[] {
  return items.map((item) => {
    const isAuthenticatedItem = AUTHENTICATED_MENU_ITEMS.includes(item.id || '');

    let updatedItem: CustomMenuItem = { ...item, visible: isAuthenticatedItem ? isAuthenticated : item.visible };

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

export function updateMenuItems(menuItems: CustomMenuItem[], ctx: RouteContext): CustomMenuItem[] {
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
      return updateCollectionMenuItem(item, ctx);
    }

    return item;
  });
}

function updateMyResourcesMenuItem(item: CustomMenuItem, ctx: RouteContext): CustomMenuItem {
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

function updateProjectMenuItem(item: CustomMenuItem, ctx: RouteContext): CustomMenuItem {
  const hasProject = ctx.isProject && !!ctx.resourceId;
  const items = (item.items || []).map((subItem) => {
    if (subItem.id === 'project-details') {
      if (hasProject) {
        let menuItems = PROJECT_MENU_ITEMS;

        if (ctx.isViewOnly) {
          const allowedViewOnlyItems = VIEW_ONLY_PROJECT_MENU_ITEMS;
          menuItems = PROJECT_MENU_ITEMS.filter((menuItem) => allowedViewOnlyItems.includes(menuItem.id || ''));
        }

        menuItems = menuItems.map((menuItem) => {
          const isVisible = shouldShowMenuItem(menuItem, ctx.permissions);

          if (menuItem.id === 'project-wiki') {
            return {
              ...menuItem,
              visible: ctx.wikiPageVisible && isVisible,
            };
          }

          return {
            ...menuItem,
            visible: isVisible,
          };
        });

        return {
          ...subItem,
          visible: true,
          expanded: true,
          items: menuItems.map((menuItem) => ({
            ...menuItem,
            routerLink: [ctx.resourceId as string, menuItem.routerLink],
            queryParams: ctx.isViewOnly ? { view_only: getViewOnlyParamFromUrl(ctx.currentUrl) } : undefined,
          })),
        };
      }
      return { ...subItem, visible: false, expanded: false };
    }
    return subItem;
  });

  return { ...item, visible: hasProject, expanded: hasProject, items };
}

function updateRegistryMenuItem(item: CustomMenuItem, ctx: RouteContext): CustomMenuItem {
  const hasRegistry = ctx.isRegistry && !!ctx.resourceId;
  const items = (item.items || []).map((subItem) => {
    if (subItem.id === 'registry-details') {
      if (hasRegistry) {
        let menuItems = REGISTRATION_MENU_ITEMS;

        if (ctx.isViewOnly) {
          const allowedViewOnlyItems = VIEW_ONLY_REGISTRY_MENU_ITEMS;
          menuItems = REGISTRATION_MENU_ITEMS.filter((menuItem) => allowedViewOnlyItems.includes(menuItem.id || ''));
        }

        menuItems = menuItems.map((menuItem) => {
          const isVisible = shouldShowMenuItem(menuItem, ctx.permissions);

          return {
            ...menuItem,
            visible: isVisible,
          };
        });

        return {
          ...subItem,
          visible: true,
          expanded: true,
          items: menuItems.map((menuItem) => {
            return {
              ...menuItem,
              routerLink: [ctx.resourceId as string, menuItem.routerLink],
              queryParams: ctx.isViewOnly ? { view_only: getViewOnlyParamFromUrl(ctx.currentUrl) } : undefined,
            };
          }),
        };
      }
      return { ...subItem, visible: false, expanded: false };
    }

    if (subItem.id === 'registries-moderation') {
      return {
        ...subItem,
        visible: ctx.registrationModerationPageVisible,
        routerLink: ['/registries', ctx.providerId, 'moderation'],
      };
    }

    return subItem;
  });

  return { ...item, expanded: ctx.isRegistry, items };
}

function updatePreprintMenuItem(item: CustomMenuItem, ctx: RouteContext): CustomMenuItem {
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
            queryParams: ctx.isViewOnly ? { view_only: getViewOnlyParamFromUrl(ctx.currentUrl) } : undefined,
          })),
        };
      }
      return { ...subItem, visible: false, expanded: false };
    }
    if (subItem.id === 'preprints-moderation') {
      return { ...subItem, visible: ctx.preprintReviewsPageVisible };
    }
    return subItem;
  });

  return { ...item, expanded: ctx.isPreprint, items };
}

function updateCollectionMenuItem(item: CustomMenuItem, ctx: RouteContext): CustomMenuItem {
  const isCollections = ctx.isCollections;

  const items = (item.items || []).map((subItem) => {
    if (subItem.id === 'collections-moderation') {
      return {
        ...subItem,
        visible: isCollections && ctx.collectionModerationPageVisible,
        routerLink: ['/collections', ctx.providerId, 'moderation'],
      };
    }
    return subItem;
  });

  return { ...item, items, visible: ctx.isCollections };
}
