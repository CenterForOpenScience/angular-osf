import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';
import { Checkbox } from 'primeng/checkbox';
import { Button } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'osf-notifications',
  standalone: true,
  imports: [
    SubHeaderComponent,
    Checkbox,
    Button,
    DropdownModule,
    TranslatePipe,
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent {
  @HostBinding('class') classes = 'flex flex-1 flex-column';
}
