import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SidenavComponent } from '@osf/sidenav/sidenav.component';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@osf/header/header.component';
import { MainContentComponent } from '@osf/main-content/main-content.component';
import { FooterComponent } from '@osf/footer/footer.component';
import { TopnavComponent } from '@osf/topnav/topnav.component';

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
  title = 'osf';
  isDesktop = window.innerWidth > 1024;
}
