import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';

import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { linkValidator } from '@osf/core/helpers';
import { IS_XSMALL } from '@osf/shared/utils';

import { DeveloperApp, DeveloperAppCreateUpdate, DeveloperAppForm, DeveloperAppFormFormControls } from '../../models';
import { CreateDeveloperApp, UpdateDeveloperApp } from '../../store';

@Component({
  selector: 'osf-developer-app-add-edit-form',
  imports: [Button, InputText, ReactiveFormsModule, NgClass, TranslatePipe],
  templateUrl: './developer-app-add-edit-form.component.html',
  styleUrl: './developer-app-add-edit-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeveloperAppAddEditFormComponent implements OnInit {
  #store = inject(Store);
  #router = inject(Router);
  readonly isEditMode = input(false);
  readonly initialValues = input<DeveloperApp | null>(null);

  protected readonly isMobile = toSignal(inject(IS_XSMALL));
  protected readonly dialogRef = inject(DynamicDialogRef);
  protected readonly DeveloperAppFormFormControls = DeveloperAppFormFormControls;
  protected readonly appForm: DeveloperAppForm = new FormGroup({
    [DeveloperAppFormFormControls.AppName]: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    [DeveloperAppFormFormControls.ProjectHomePageUrl]: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, linkValidator()],
    }),
    [DeveloperAppFormFormControls.AppDescription]: new FormControl('', {
      nonNullable: false,
    }),
    [DeveloperAppFormFormControls.AuthorizationCallbackUrl]: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, linkValidator()],
    }),
  });

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
      this.#store
        .dispatch(
          new CreateDeveloperApp({
            ...this.appForm.value,
          } as DeveloperAppCreateUpdate)
        )
        .subscribe({
          complete: () => {
            this.dialogRef.close();
          },
        });
    } else {
      this.#store
        .dispatch(
          new UpdateDeveloperApp(this.initialValues()!.clientId, {
            ...this.appForm.value,
            id: this.initialValues()!.id,
          } as DeveloperAppCreateUpdate)
        )
        .subscribe({
          complete: () => {
            this.#router.navigate(['settings/developer-apps']);
          },
        });
    }
  }
}
