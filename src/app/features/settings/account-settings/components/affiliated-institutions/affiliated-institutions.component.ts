import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';

import { finalize } from 'rxjs';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { UserSelectors } from '@osf/core/store/user';
import { ReadonlyInputComponent } from '@osf/shared/components';
import { Institution } from '@osf/shared/models';
import { CustomConfirmationService, LoaderService, ToastService } from '@osf/shared/services';

import { AccountSettingsSelectors, DeleteUserInstitution } from '../../store';

@Component({
  selector: 'osf-affiliated-institutions',
  imports: [Card, TranslatePipe, ReadonlyInputComponent],
  templateUrl: './affiliated-institutions.component.html',
  styleUrl: './affiliated-institutions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AffiliatedInstitutionsComponent {
  private readonly customConfirmationService = inject(CustomConfirmationService);
  private readonly toastService = inject(ToastService);
  private readonly loaderService = inject(LoaderService);

  private readonly actions = createDispatchMap({ deleteUserInstitution: DeleteUserInstitution });
  protected institutions = select(AccountSettingsSelectors.getUserInstitutions);
  protected currentUser = select(UserSelectors.getCurrentUser);

  deleteInstitution(institution: Institution) {
    this.customConfirmationService.confirmDelete({
      headerKey: 'settings.accountSettings.affiliatedInstitutions.deleteDialog.header',
      messageParams: { name: institution.name },
      messageKey: 'settings.accountSettings.affiliatedInstitutions.deleteDialog.message',
      onConfirm: () => {
        if (this.currentUser()?.id) {
          this.actions
            .deleteUserInstitution(institution.id, this.currentUser()!.id)
            .pipe(finalize(() => this.loaderService.hide()))
            .subscribe(() =>
              this.toastService.showSuccess('settings.accountSettings.affiliatedInstitutions.successDelete')
            );
        }
      },
    });
  }
}
