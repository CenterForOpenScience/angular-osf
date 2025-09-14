import { TranslatePipe } from '@ngx-translate/core';

import { ConfirmDialog } from 'primeng/confirmdialog';

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';

import { IS_MEDIUM, IS_WEB } from '@osf/shared/helpers';

import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { MaintenanceBannerComponent } from '../maintenance-banner/maintenance-banner.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { TopnavComponent } from '../topnav/topnav.component';

@Component({
  selector: 'osf-root',
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    TopnavComponent,
    ConfirmDialog,
    BreadcrumbComponent,
    RouterOutlet,
    SidenavComponent,
    MaintenanceBannerComponent,
    TranslatePipe,
  ],
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RootComponent {
  isWeb = toSignal(inject(IS_WEB));
  isMedium = toSignal(inject(IS_MEDIUM));
}
