import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  DeveloperAppForm,
  DeveloperAppFormFormControls,
} from '@osf/features/settings/developer-apps/developer-app.entities';
import { linkValidator } from '@core/helpers/link-validator.helper';

@Component({
  selector: 'osf-create-developer-app',
  imports: [Button, InputText, ReactiveFormsModule],
  templateUrl: './create-developer-app.component.html',
  styleUrl: './create-developer-app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateDeveloperAppComponent {
  readonly dialogRef = inject(DynamicDialogRef);
  protected readonly DeveloperAppFormFormControls =
    DeveloperAppFormFormControls;

  readonly createAppForm: DeveloperAppForm = new FormGroup({
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
    [DeveloperAppFormFormControls.AuthorizationCallbackUrl]: new FormControl(
      '',
      {
        nonNullable: true,
        validators: [Validators.required, linkValidator()],
      },
    ),
  });

  submitForm(): void {
    if (!this.createAppForm.valid) {
      this.createAppForm.markAllAsTouched();
      this.createAppForm
        .get([DeveloperAppFormFormControls.AppName])
        ?.markAsDirty();
      this.createAppForm
        .get(DeveloperAppFormFormControls.ProjectHomePageUrl)
        ?.markAsDirty();
      this.createAppForm
        .get(DeveloperAppFormFormControls.AppDescription)
        ?.markAsDirty();
      this.createAppForm
        .get(DeveloperAppFormFormControls.AuthorizationCallbackUrl)
        ?.markAsDirty();
      return;
    }

    //TODO integrate API
    this.dialogRef.close();
  }
}
