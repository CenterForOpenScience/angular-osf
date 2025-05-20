import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NavMenuComponent } from '@core/components/nav-menu/nav-menu.component';

@Component({
  selector: 'osf-sidenav',
  imports: [NgOptimizedImage, NavMenuComponent],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {}
