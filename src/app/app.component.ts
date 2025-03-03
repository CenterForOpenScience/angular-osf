import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SidenavComponent } from '@core/components/sidenav/sidenav.component';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@core/components/header/header.component';
import { MainContentComponent } from '@core/components/main-content/main-content.component';
import { FooterComponent } from '@core/components/footer/footer.component';
import { TopnavComponent } from '@core/components/topnav/topnav.component';
import { IS_PORTRAIT } from '@shared/utils/breakpoints.tokens';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'osf-root',
  imports: [
    SidenavComponent,
    RouterOutlet,
    HeaderComponent,
    MainContentComponent,
    FooterComponent,
    TopnavComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private isPortrait$ = inject(IS_PORTRAIT);
  isPortrait = toSignal(this.isPortrait$);
}
