import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, effect, inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { UserInstitution } from '@osf/features/project/metadata/models';
import { ProjectMetadataSelectors } from '@osf/features/project/metadata/store';
import { ProjectOverview } from '@osf/features/project/overview/models';

interface AffiliatedInstitutionsForm {
  institutions: FormArray<FormControl<boolean>>;
}

@Component({
  selector: 'osf-affiliated-institutions-dialog',
  imports: [Button, Checkbox, TranslatePipe, ReactiveFormsModule],
  templateUrl: './affiliated-institutions-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AffiliatedInstitutionsDialogComponent implements OnInit {
  protected dialogRef = inject(DynamicDialogRef);
  protected config = inject(DynamicDialogConfig);
  private store = inject(Store);

  protected userInstitutions = this.store.selectSignal(ProjectMetadataSelectors.getUserInstitutions);
  protected userInstitutionsLoading = this.store.selectSignal(ProjectMetadataSelectors.getUserInstitutionsLoading);

  affiliatedInstitutionsForm = new FormGroup<AffiliatedInstitutionsForm>({
    institutions: new FormArray<FormControl<boolean>>([]),
  });

  constructor() {
    // Update form when institutions are loaded
    effect(() => {
      const institutions = this.userInstitutions();
      if (institutions && Array.isArray(institutions) && institutions.length > 0) {
        this.updateFormControls(institutions);
      }
    });
  }

  get currentProject(): ProjectOverview | null {
    return this.config.data?.currentProject || null;
  }

  get hasInstitutions(): boolean {
    const institutions = this.userInstitutions();
    return institutions && Array.isArray(institutions) && institutions.length > 0;
  }

  ngOnInit(): void {
    // Institutions should already be loaded by the metadata component
    // If they're already available, update the form
    const institutions = this.userInstitutions();
    if (institutions && Array.isArray(institutions) && institutions.length > 0) {
      this.updateFormControls(institutions);
    }
  }

  private updateFormControls(institutions: UserInstitution[]): void {
    // Clear existing form controls
    this.affiliatedInstitutionsForm.controls.institutions.clear();

    // Add form controls for each institution
    institutions.forEach((institution) => {
      const isSelected = this.currentProject?.affiliatedInstitutions?.some((i) => i.id === institution.id) ?? false;
      this.affiliatedInstitutionsForm.controls.institutions.push(new FormControl(isSelected, { nonNullable: true }));
    });
  }

  save(): void {
    const institutions = this.userInstitutions();
    if (!institutions || !Array.isArray(institutions)) {
      this.dialogRef.close([]);
      return;
    }

    const selectedInstitutions = institutions.filter(
      (_, index) => this.affiliatedInstitutionsForm.value.institutions?.[index]
    );

    this.dialogRef.close(selectedInstitutions);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
