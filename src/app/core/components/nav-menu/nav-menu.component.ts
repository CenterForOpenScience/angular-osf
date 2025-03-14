import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NAV_ITEMS } from '@osf/core/helpers/nav-items.constant';

@Component({
  selector: 'osf-nav-menu',
  imports: [RouterLinkActive, RouterLink],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss',
})
export class NavMenuComponent {
  navItems = NAV_ITEMS;
}
