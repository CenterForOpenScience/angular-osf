import { Store } from '@ngxs/store';

import { DialogService } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';

import { UserSelectors } from '@core/store/user/user.selectors';
import {
  AffiliatedInstitutionsComponent,
  ChangePasswordComponent,
  ConnectedEmailsComponent,
  ConnectedIdentitiesComponent,
  DeactivateAccountComponent,
  DefaultStorageLocationComponent,
  ShareIndexingComponent,
  TwoFactorAuthComponent,
} from '@osf/features/settings/account-settings/components';
import {
  GetAccountSettings,
  GetEmails,
  GetExternalIdentities,
  GetRegions,
  GetUserInstitutions,
} from '@osf/features/settings/account-settings/store/account-settings.actions';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';

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
