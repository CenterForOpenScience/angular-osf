import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AffiliatedInstitutionSelectComponent } from '@osf/shared/components';
import { Institution } from '@osf/shared/models';
import { InstitutionsSelectors } from '@osf/shared/stores/institutions';

@Component({
  selector: 'osf-affiliated-institutions-dialog',
  imports: [Button, TranslatePipe, ReactiveFormsModule, AffiliatedInstitutionSelectComponent],
  templateUrl: './affiliated-institutions-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AffiliatedInstitutionsDialogComponent {
  dialogRef = inject(DynamicDialogRef);

  userInstitutions = select(InstitutionsSelectors.getUserInstitutions);
  areUserInstitutionsLoading = select(InstitutionsSelectors.areUserInstitutionsLoading);

  selectedInstitutions: Institution[] = [];

  onSelectInstitutions(selectedInstitutions: Institution[]): void {
    this.selectedInstitutions = selectedInstitutions;
  }

  save(): void {
    this.dialogRef.close(this.selectedInstitutions);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
