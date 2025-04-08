import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { MOCK_COUNTRIES } from '@osf/features/settings/account-settings/account-settings.const';
import { RadioButton } from 'primeng/radiobutton';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  AccountSettingsPasswordForm,
  AccountSettingsPasswordFormControls,
} from '@osf/features/settings/account-settings/account.settings.entities';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddEmailComponent } from '@osf/features/settings/account-settings/add-email/add-email.component';
import { DeactivateAccountComponent } from '@osf/features/settings/account-settings/deactivate-account/deactivate-account/deactivate-account.component';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';

@Component({
  selector: 'osf-account-settings',
  imports: [
    Button,
    Select,
    RadioButton,
    ReactiveFormsModule,
    InputText,
    Message,
    SubHeaderComponent,
  ],
  providers: [DialogService],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountSettingsComponent {
  readonly passwordForm: AccountSettingsPasswordForm = new FormGroup({
    [AccountSettingsPasswordFormControls.OldPassword]: new FormControl('', {
      nonNullable: true,
    }),
    [AccountSettingsPasswordFormControls.NewPassword]: new FormControl('', {
      nonNullable: true,
    }),
    [AccountSettingsPasswordFormControls.ConfirmPassword]: new FormControl('', {
      nonNullable: true,
    }),
  });
  protected readonly optControl = new FormControl(false);
  protected readonly MOCK_COUNTRIES = MOCK_COUNTRIES;
  protected readonly AccountSettingsPasswordFormControls =
    AccountSettingsPasswordFormControls;
  private readonly dialogService = inject(DialogService);
  private dialogRef: DynamicDialogRef | null = null;

  addEmail() {
    this.dialogRef = this.dialogService.open(AddEmailComponent, {
      width: '448px',
      focusOnShow: false,
      header: 'Add alternative email',
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }

  deactivateAccount() {
    this.dialogRef = this.dialogService.open(DeactivateAccountComponent, {
      width: '448px',
      focusOnShow: false,
      header: 'Deactivate account',
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }
}
