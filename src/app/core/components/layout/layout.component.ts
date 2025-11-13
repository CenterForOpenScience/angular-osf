import { TranslatePipe } from '@ngx-translate/core';

import { ConfirmDialog } from 'primeng/confirmdialog';

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';

import { ScrollTopOnRouteChangeDirective } from '@osf/shared/directives/scroll-top.directive';
import { IS_MEDIUM, IS_WEB } from '@osf/shared/helpers/breakpoints.tokens';

import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { OSFBannerComponent } from '../osf-banners/osf-banner.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { TopnavComponent } from '../topnav/topnav.component';

@Component({
  selector: 'osf-layout',
  imports: [
    BreadcrumbComponent,
    CommonModule,
    ConfirmDialog,
    FooterComponent,
    HeaderComponent,
    OSFBannerComponent,
    RouterOutlet,
    ScrollTopOnRouteChangeDirective,
    SidenavComponent,
    TopnavComponent,
    TranslatePipe,
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  isWeb = toSignal(inject(IS_WEB));
  isMedium = toSignal(inject(IS_MEDIUM));
}
