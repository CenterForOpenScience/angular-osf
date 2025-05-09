import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';

import {
  ChangeDetectionStrategy,
  Component,
  effect,
  HostBinding,
  inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { UserSettings } from '@core/services/user/user.models';
import { GetCurrentUserSettings, UpdateUserSettings } from '@core/store/user/user.actions';
import { UserSelectors } from '@core/store/user/user.selectors';
import {
  EmailPreferencesForm,
  EmailPreferencesFormControls,
} from '@osf/features/settings/notifications/notifications-form.entities';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';

@Component({
  selector: 'osf-notifications',
  standalone: true,
  imports: [
    SubHeaderComponent,
    Checkbox,
    Button,
    DropdownModule,
    TranslatePipe,
    ReactiveFormsModule,
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent implements OnInit {
  @HostBinding('class') classes = 'flex flex-1 flex-column';

  readonly #store = inject(Store);
  readonly #fb = inject(FormBuilder);

  readonly #currentUser = this.#store.selectSignal(
    UserSelectors.getCurrentUser,
  );
  readonly #userSettings = this.#store.selectSignal(
    UserSelectors.getCurrentUserSettings,
  );

  protected readonly EmailPreferencesFormControls =
    EmailPreferencesFormControls;
  protected readonly emailPreferencesForm: EmailPreferencesForm = new FormGroup(
    {
      [EmailPreferencesFormControls.SubscribeOsfGeneralEmail]: this.#fb.control(
        false,
        { nonNullable: true },
      ),
      [EmailPreferencesFormControls.SubscribeOsfHelpEmail]: this.#fb.control(
        false,
        { nonNullable: true },
      ),
    },
  );

  constructor() {
    effect(() => {
      if (this.#userSettings()) {
        this.updateEmailPreferencesForm();
      }
    });
  }

  ngOnInit(): void {
    this.#store.dispatch(new GetCurrentUserSettings());
  }

  emailPreferencesFormSubmit(): void {
    if(!this.#currentUser()) {
      return;
    }

    const formValue = this.emailPreferencesForm.value as UserSettings;
    this.#store.dispatch(new UpdateUserSettings(this.#currentUser()!.id, formValue));
  }

  private updateEmailPreferencesForm() {
    this.emailPreferencesForm.patchValue({
      [EmailPreferencesFormControls.SubscribeOsfGeneralEmail]:
        this.#userSettings()?.subscribeOsfGeneralEmail,
      [EmailPreferencesFormControls.SubscribeOsfHelpEmail]:
        this.#userSettings()?.subscribeOsfHelpEmail,
    });
  }
}
