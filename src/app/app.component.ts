import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SidenavComponent } from '@osf/sidenav/sidenav.component';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@osf/header/header.component';
import { MainContentComponent } from '@osf/main-content/main-content.component';
import { FooterComponent } from '@osf/footer/footer.component';
import { TopnavComponent } from '@osf/topnav/topnav.component';
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
