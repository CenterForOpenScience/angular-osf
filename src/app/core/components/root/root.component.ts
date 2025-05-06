import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from '@core/components/sidenav/sidenav.component';
import { HeaderComponent } from '@core/components/header/header.component';
import { MainContentComponent } from '@core/components/main-content/main-content.component';
import { FooterComponent } from '@core/components/footer/footer.component';
import { TopnavComponent } from '@core/components/topnav/topnav.component';
import { IS_WEB, IS_XSMALL } from '@shared/utils/breakpoints.tokens';
import { toSignal } from '@angular/core/rxjs-interop';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'osf-root',
  standalone: true,
  imports: [
    CommonModule,
    SidenavComponent,
    HeaderComponent,
    MainContentComponent,
    FooterComponent,
    TopnavComponent,
    ConfirmDialog,
    BreadcrumbComponent,
  ],
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RootComponent {
  isWeb = toSignal(inject(IS_WEB));
  isMobile = toSignal(inject(IS_XSMALL));
}
