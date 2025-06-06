import { Button } from 'primeng/button';
import { Drawer } from 'primeng/drawer';

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NavMenuComponent } from '@core/components/nav-menu/nav-menu.component';

@Component({
  selector: 'osf-topnav',
  imports: [Button, Drawer, NgOptimizedImage, NavMenuComponent],
  templateUrl: './topnav.component.html',
  styleUrl: './topnav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopnavComponent {
  isDrawerVisible = signal(false);

  toggleMenuVisibility() {
    this.isDrawerVisible.set(!this.isDrawerVisible());
  }
}
