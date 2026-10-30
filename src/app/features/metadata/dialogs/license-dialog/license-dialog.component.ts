import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';

import { LicenseComponent } from '@osf/shared/components/license/license.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { LicenseOptions, LicenseState } from '@osf/shared/models/license/license.model';
import { FetchLicenses, LicensesSelectors } from '@osf/shared/stores/licenses';

import { MetadataModel } from '../../models';
import { LicenseDialogData, LicenseDialogResult } from '../../models/license-dialog.model';

@Component({
  selector: 'osf-license-dialog',
  imports: [Button, TranslatePipe, LoadingSpinnerComponent, LicenseComponent],
  templateUrl: './license-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LicenseDialogComponent implements OnInit {
  readonly dialogRef = inject(DynamicDialogRef);
  readonly config = inject(DynamicDialogConfig<LicenseDialogData>);

  readonly actions = createDispatchMap({ fetchLicenses: FetchLicenses });

  readonly licenses = select(LicensesSelectors.getLicenses);
  readonly licensesLoading = select(LicensesSelectors.getLoading);

  private readonly data = this.config.data ?? {};
  private readonly initialLicenseId = this.data.metadata?.license?.id || null;

  readonly initialLicenseOptions = this.resolveLicenseOptions(this.data.metadata);
  readonly selectedLicenseId = signal<string | null>(this.initialLicenseId);
  readonly licenseState = signal<LicenseState | null>(null);

  readonly selectedLicense = computed(
    () => this.licenses().find((license) => license.id === this.selectedLicenseId()) ?? null
  );

  readonly isUnchanged = computed(() => {
    const license = this.selectedLicense();
    if (!license || license.id !== this.initialLicenseId) {
      return false;
    }

    if (!license.requiredFields.length) {
      return true;
    }

    const initial = this.initialLicenseOptions;
    const current = this.licenseState()?.licenseOptions;

    return (
      !!initial && !!current && initial.year === current.year && initial.copyrightHolders === current.copyrightHolders
    );
  });

  readonly isSaveDisabled = computed(() => {
    const license = this.selectedLicense();
    if (this.licensesLoading() || !license) {
      return true;
    }

    if (license.requiredFields.length && (this.licenseState()?.formInvalid ?? true)) {
      return true;
    }

    return this.isUnchanged();
  });

  ngOnInit(): void {
    this.actions.fetchLicenses(this.data.resourceType ?? ResourceType.Project, this.data.providerId);
  }

  save(): void {
    const license = this.selectedLicense();
    if (!license || this.isSaveDisabled()) {
      return;
    }

    const result: LicenseDialogResult = {
      licenseId: license.id,
      licenseOptions: license.requiredFields.length ? this.licenseState()?.licenseOptions : undefined,
    };
    this.dialogRef.close(result);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  private resolveLicenseOptions(metadata?: MetadataModel | null): LicenseOptions | null {
    const nodeLicense = metadata?.nodeLicense;
    if (!nodeLicense) {
      return null;
    }

    return {
      copyrightHolders: nodeLicense.copyrightHolders?.join(', ') ?? '',
      year: nodeLicense.year ?? '',
    };
  }
}
