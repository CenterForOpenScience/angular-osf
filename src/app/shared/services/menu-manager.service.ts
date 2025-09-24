import { TieredMenu } from 'primeng/tieredmenu';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MenuManagerService {
  private currentOpenMenu: TieredMenu | null = null;

  openMenu(menu: TieredMenu, event: Event): void {
    if (this.currentOpenMenu && this.currentOpenMenu !== menu) {
      this.currentOpenMenu.hide();
    }

    this.currentOpenMenu = menu;
    menu.toggle(event);
  }

  closeCurrentMenu(): void {
    if (this.currentOpenMenu) {
      this.currentOpenMenu.hide();
      this.currentOpenMenu = null;
    }
  }

  onMenuHide(): void {
    this.currentOpenMenu = null;
  }
}
