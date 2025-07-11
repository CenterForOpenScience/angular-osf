import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { DialogService } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, effect } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { UserSelectors } from '@osf/core/store/user';
import { SubHeaderComponent } from '@osf/shared/components';

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
    TranslatePipe,
  ],
  providers: [DialogService],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountSettingsComponent {
  readonly actions = createDispatchMap({
    getAccountSettings: GetAccountSettings,
    getEmails: GetEmails,
    getExternalIdentities: GetExternalIdentities,
    getRegions: GetRegions,
    getUserInstitutions: GetUserInstitutions,
  });
  protected readonly currentUser = select(UserSelectors.getCurrentUser);

  constructor() {
    effect(() => {
      if (this.currentUser()) {
        this.actions.getAccountSettings();
        this.actions.getEmails();
        this.actions.getExternalIdentities();
        this.actions.getRegions();
        this.actions.getUserInstitutions();
      }
    });
  }
}
