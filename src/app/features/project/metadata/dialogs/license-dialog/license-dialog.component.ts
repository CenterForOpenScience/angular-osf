import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Select } from 'primeng/select';

import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ProjectOverview } from '@osf/features/project/overview/models';
import { License } from '@shared/models';
import { LicensesState } from '@shared/stores';

interface LicenseForm {
  licenseName: FormControl<string>;
}

@Component({
  selector: 'osf-license-dialog',
  imports: [Button, Select, TranslatePipe, ReactiveFormsModule],
  templateUrl: './license-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LicenseDialogComponent implements OnInit {
  protected dialogRef = inject(DynamicDialogRef);
  protected config = inject(DynamicDialogConfig);
  private readonly store = inject(Store);

  licenseForm = new FormGroup<LicenseForm>({
    licenseName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  // Get licenses from store
  licenses = this.store.selectSignal(LicensesState.getLicenses);
  licensesLoading = this.store.selectSignal(LicensesState.getLoading);
  licensesError = this.store.selectSignal(LicensesState.getError);

  // Current selected license text
  selectedLicenseText = signal<string>('');

  get currentProject(): ProjectOverview | null {
    return this.config.data?.currentProject || null;
  }

  get isEditMode(): boolean {
    return !!this.currentProject?.license;
  }

  get licenseOptions(): { label: string; value: string; id: string }[] {
    return this.licenses().map((license: License) => ({
      label: license.attributes.name,
      value: license.attributes.name,
      id: license.id,
    }));
  }

  ngOnInit(): void {
    if (this.currentProject?.license) {
      this.licenseForm.patchValue({
        licenseName: this.currentProject.license.name || '',
      });
      this.updateSelectedLicenseText(this.currentProject.license.name || '');
    }

    this.licenseForm.get('licenseName')?.valueChanges.subscribe((licenseName) => {
      this.updateSelectedLicenseText(licenseName);
    });
  }

  private updateSelectedLicenseText(licenseName: string): void {
    const allLicenses = this.licenses();
    const selectedLicense = allLicenses.find((license: License) => license.attributes.name === licenseName);

    if (selectedLicense) {
      this.selectedLicenseText.set(selectedLicense.attributes.text);
    } else {
      this.selectedLicenseText.set('');
    }
  }

  save(): void {
    if (this.licenseForm.valid) {
      const formValue = this.licenseForm.getRawValue();
      const allLicenses = this.licenses();
      const selectedLicense = allLicenses.find((license: License) => license.attributes.name === formValue.licenseName);
      console.log(selectedLicense);
      this.dialogRef.close({
        licenseName: formValue.licenseName,
        licenseId: selectedLicense?.id,
        projectId: this.currentProject?.id,
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
