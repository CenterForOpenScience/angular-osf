import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { NavMenuComponent } from '@core/components/nav-menu/nav-menu.component';

@Component({
  standalone: true,
  selector: 'osf-sidenav',
  imports: [NgOptimizedImage, NavMenuComponent],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {}
