import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AffiliatedInstitutionSelectComponent } from '@osf/shared/components/affiliated-institution-select/affiliated-institution-select.component';
import { Institution } from '@osf/shared/models/institutions/institutions.models';
import { FetchUserInstitutions, InstitutionsSelectors } from '@osf/shared/stores/institutions';

@Component({
  selector: 'osf-affiliated-institutions-dialog',
  imports: [Button, TranslatePipe, ReactiveFormsModule, AffiliatedInstitutionSelectComponent],
  templateUrl: './affiliated-institutions-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AffiliatedInstitutionsDialogComponent implements OnInit {
  dialogRef = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  actions = createDispatchMap({ fetchUserInstitutions: FetchUserInstitutions });
  userInstitutions = select(InstitutionsSelectors.getUserInstitutions);
  areUserInstitutionsLoading = select(InstitutionsSelectors.areUserInstitutionsLoading);

  selectedInstitutions = signal<Institution[]>(this.config.data || []);

  ngOnInit() {
    this.actions.fetchUserInstitutions();
  }

  save(): void {
    this.dialogRef.close(this.selectedInstitutions());
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
