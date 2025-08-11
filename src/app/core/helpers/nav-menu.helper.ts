import { MenuItem } from 'primeng/api';

import { AUTHENTICATED_MENU_ITEMS } from '../constants';

export function filterMenuItems(items: MenuItem[], isAuthenticated: boolean): MenuItem[] {
  return items.map((item) => {
    const isAuthenticatedItem = AUTHENTICATED_MENU_ITEMS.includes(item.id || '');
    const shouldShow = isAuthenticated || !isAuthenticatedItem;

    const updatedItem = { ...item, visible: shouldShow };

    if (item.items) {
      updatedItem.items = filterMenuItems(item.items, isAuthenticated);
    }

    return updatedItem;
  });
}
