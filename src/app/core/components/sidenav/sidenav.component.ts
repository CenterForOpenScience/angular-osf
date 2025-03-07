import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { NavItem } from '@osf/shared/entities/nav-item.interface';

@Component({
  standalone: true,
  selector: 'osf-sidenav',
  imports: [RouterLink, RouterLinkActive, NgOptimizedImage],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {
  protected readonly navItems: NavItem[] = [
    { path: '/home', label: 'Home', icon: 'assets/icons/menu/home.svg' },
    { path: '', label: 'Search OSF', icon: 'assets/icons/menu/search.svg' },
    {
      path: '/support',
      label: 'Support',
      icon: 'assets/icons/menu/support.svg',
    },
  ];
}
