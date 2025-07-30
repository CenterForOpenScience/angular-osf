import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject, OnInit, signal, viewChild } from '@angular/core';

import { ProjectOverview } from '@osf/features/project/overview/models';
import { LicenseComponent, LoadingSpinnerComponent } from '@osf/shared/components';
import { License, LicenseOptions } from '@shared/models';
import { LicensesSelectors, LoadAllLicenses } from '@shared/stores/licenses';

@Component({
  selector: 'osf-license-dialog',
  imports: [Button, TranslatePipe, LoadingSpinnerComponent, LicenseComponent],
  templateUrl: './license-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LicenseDialogComponent implements OnInit {
  protected dialogRef = inject(DynamicDialogRef);
  protected config = inject(DynamicDialogConfig);

  protected actions = createDispatchMap({
    loadLicenses: LoadAllLicenses,
  });

  licenses = select(LicensesSelectors.getLicenses);
  licensesLoading = select(LicensesSelectors.getLoading);

  selectedLicenseId = signal<string | null>(null);
  selectedLicenseOptions = signal<LicenseOptions | null>(null);
  currentProject: ProjectOverview | null = null;
  isSubmitting = signal<boolean>(false);

  licenseComponent = viewChild<LicenseComponent>('licenseComponent');

  ngOnInit(): void {
    this.actions.loadLicenses();
    this.currentProject = this.config.data?.currentProject || null;
    if (this.currentProject?.license) {
      this.selectedLicenseId.set(this.currentProject.license.id || null);
      if (this.currentProject.nodeLicense) {
        this.selectedLicenseOptions.set({
          copyrightHolders: this.currentProject.nodeLicense.copyrightHolders?.join(', ') || '',
          year: this.currentProject.nodeLicense.year || new Date().getFullYear().toString(),
        });
      }
    }
  }

  onSelectLicense(license: License): void {
    this.selectedLicenseId.set(license.id);
  }

  onCreateLicense(event: { id: string; licenseOptions: LicenseOptions }): void {
    const selectedLicense = this.licenses().find((license) => license.id === event.id);

    if (selectedLicense) {
      this.dialogRef.close({
        licenseName: selectedLicense.name,
        licenseId: selectedLicense.id,
        licenseOptions: event.licenseOptions,
        projectId: this.currentProject?.id,
      });
    }

    this.isSubmitting.set(false);
  }

  save(): void {
    if (
      this.licenseComponent()?.selectedLicense()!.requiredFields.length &&
      this.licenseComponent()?.licenseForm.invalid
    ) {
      return;
    }

    const selectedLicenseId = this.selectedLicenseId();
    if (!selectedLicenseId) return;

    const selectedLicense = this.licenses().find((license) => license.id === selectedLicenseId);
    if (!selectedLicense) return;

    this.isSubmitting.set(true);

    if (selectedLicense.requiredFields?.length) {
      this.licenseComponent()?.saveLicense();
    } else {
      this.dialogRef.close({
        licenseName: selectedLicense.name,
        licenseId: selectedLicense.id,
        projectId: this.currentProject?.id,
      });
    }
  }

  cancel(): void {
    this.licenseComponent()?.cancel();
    this.dialogRef.close();
  }
}
