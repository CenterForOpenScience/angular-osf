import {
  ChangeDetectionStrategy,
  Component,
  effect,
  HostBinding,
  inject,
  OnInit,
} from '@angular/core';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';
import { Checkbox } from 'primeng/checkbox';
import { Button } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TranslatePipe } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { GetCurrentUserSettings } from '@core/store/user';
import { UserSelectors } from '@core/store/user/user.selectors';

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
export class NotificationsComponent implements OnInit {
  @HostBinding('class') classes = 'flex flex-1 flex-column';

  readonly #store = inject(Store);
  readonly #userSettings = this.#store.selectSignal(
    UserSelectors.getCurrentUserSettings,
  );

  constructor() {
    effect(() => {
      console.log('Current user settings:', this.#userSettings());
    });
  }

  ngOnInit(): void {
    this.#store.dispatch(new GetCurrentUserSettings());
  }
}
