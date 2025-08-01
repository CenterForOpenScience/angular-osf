import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, effect, inject, input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { TextInputComponent } from '@osf/shared/components';
import { InputLimits } from '@osf/shared/constants';
import { ToastService } from '@osf/shared/services';
import { CustomValidators } from '@osf/shared/utils';

import { DeveloperApp, DeveloperAppCreateUpdate, DeveloperAppForm, DeveloperAppFormFormControls } from '../../models';
import { CreateDeveloperApp, DeveloperAppsSelectors, UpdateDeveloperApp } from '../../store';

@Component({
  selector: 'osf-developer-app-add-edit-form',
  imports: [Button, ReactiveFormsModule, TranslatePipe, TextInputComponent],
  templateUrl: './developer-app-add-edit-form.component.html',
  styleUrl: './developer-app-add-edit-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeveloperAppAddEditFormComponent implements OnInit {
  readonly isEditMode = input(false);
  readonly initialValues = input<DeveloperApp | null>(null);

  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly actions = createDispatchMap({
    createDeveloperApp: CreateDeveloperApp,
    updateDeveloperApp: UpdateDeveloperApp,
  });

  protected readonly inputLimits = InputLimits;
  protected readonly dialogRef = inject(DynamicDialogRef);
  protected readonly isLoading = select(DeveloperAppsSelectors.isLoading);

  protected readonly DeveloperAppFormFormControls = DeveloperAppFormFormControls;
  protected readonly appForm: DeveloperAppForm = new FormGroup({
    [DeveloperAppFormFormControls.AppName]: new FormControl('', {
      nonNullable: true,
      validators: [CustomValidators.requiredTrimmed(), Validators.maxLength(InputLimits.fullName.maxLength)],
    }),
    [DeveloperAppFormFormControls.ProjectHomePageUrl]: new FormControl('', {
      nonNullable: true,
      validators: [
        CustomValidators.requiredTrimmed(),
        CustomValidators.linkValidator(),
        Validators.maxLength(InputLimits.link.maxLength),
      ],
    }),
    [DeveloperAppFormFormControls.AppDescription]: new FormControl('', {
      nonNullable: false,
      validators: [Validators.maxLength(InputLimits.description.maxLength)],
    }),
    [DeveloperAppFormFormControls.AuthorizationCallbackUrl]: new FormControl('', {
      nonNullable: true,
      validators: [
        CustomValidators.requiredTrimmed(),
        CustomValidators.linkValidator(),
        Validators.maxLength(InputLimits.link.maxLength),
      ],
    }),
  });

  constructor() {
    effect(() => {
      return this.isLoading() ? this.appForm.disable() : this.appForm.enable();
    });
  }

  ngOnInit(): void {
    if (this.initialValues()) {
      this.appForm.patchValue({
        [DeveloperAppFormFormControls.AppName]: this.initialValues()?.name,
        [DeveloperAppFormFormControls.AppDescription]: this.initialValues()?.description,
        [DeveloperAppFormFormControls.ProjectHomePageUrl]: this.initialValues()?.projHomePageUrl,
        [DeveloperAppFormFormControls.AuthorizationCallbackUrl]: this.initialValues()?.authorizationCallbackUrl,
      });
    }
  }

  handleSubmitForm(): void {
    if (!this.appForm.valid) {
      this.appForm.markAllAsTouched();
      Object.values(this.appForm.controls).forEach((control) => control.markAsDirty());
      return;
    }

    if (!this.isEditMode()) {
      this.actions.createDeveloperApp({ ...this.appForm.value } as DeveloperAppCreateUpdate).subscribe({
        next: () => this.toastService.showSuccess('settings.developerApps.form.createSuccess'),
        complete: () => this.dialogRef.close(),
      });
    } else {
      this.actions
        .updateDeveloperApp(this.initialValues()!.clientId, {
          ...this.appForm.value,
          id: this.initialValues()!.id,
        } as DeveloperAppCreateUpdate)
        .subscribe({
          next: () => this.toastService.showSuccess('settings.developerApps.form.createSuccess'),
          complete: () => this.router.navigate(['settings/developer-apps']),
        });
    }
  }
}
