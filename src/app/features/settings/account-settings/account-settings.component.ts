import { Store } from '@ngxs/store';

import { DialogService } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';

import { UserSelectors } from '@osf/core/store/user';
import { SubHeaderComponent } from '@osf/shared/components';
import { IS_XSMALL } from '@osf/shared/utils';

import {
  AffiliatedInstitutionsComponent,
  ChangePasswordComponent,
  ConnectedEmailsComponent,
  ConnectedIdentitiesComponent,
  DeactivateAccountComponent,
  DefaultStorageLocationComponent,
  ShareIndexingComponent,
  TwoFactorAuthComponent,
} from './components';
import { GetAccountSettings, GetEmails, GetExternalIdentities, GetRegions, GetUserInstitutions } from './store';

@Component({
  selector: 'osf-account-settings',
  imports: [
    ReactiveFormsModule,
    SubHeaderComponent,
    ConnectedEmailsComponent,
    DefaultStorageLocationComponent,
    ConnectedIdentitiesComponent,
    ShareIndexingComponent,
    ChangePasswordComponent,
    TwoFactorAuthComponent,
    DeactivateAccountComponent,
    AffiliatedInstitutionsComponent,
  ],
  providers: [DialogService],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountSettingsComponent {
  readonly #store = inject(Store);
  protected readonly isMobile = toSignal(inject(IS_XSMALL));
  protected readonly currentUser = this.#store.selectSignal(UserSelectors.getCurrentUser);

  constructor() {
    effect(() => {
      if (this.currentUser()) {
        this.#store.dispatch(GetAccountSettings);
        this.#store.dispatch(GetEmails);
        this.#store.dispatch(GetExternalIdentities);
        this.#store.dispatch(GetRegions);
        this.#store.dispatch(GetUserInstitutions);
      }
    });
  }
}
