import { ConfirmDialog } from 'primeng/confirmdialog';

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';

import { SidenavComponent } from '@core/components';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { FooterComponent } from '@core/components/footer/footer.component';
import { HeaderComponent } from '@core/components/header/header.component';
import { TopnavComponent } from '@core/components/topnav/topnav.component';
import { IS_MEDIUM, IS_WEB } from '@osf/shared/helpers';

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
  ],
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RootComponent {
  isWeb = toSignal(inject(IS_WEB));
  isMedium = toSignal(inject(IS_MEDIUM));
}
