import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Checkbox } from 'primeng/checkbox';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  PersonalAccessToken,
  TokenForm,
  TokenFormControls,
} from '@osf/features/settings/tokens/tokens.enities';
import { CommonModule } from '@angular/common';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { TokensState } from '@core/store/settings';

@Component({
  selector: 'osf-token-add-edit-form',
  imports: [Button, InputText, ReactiveFormsModule, CommonModule, Checkbox],
  templateUrl: './token-add-edit-form.component.html',
  styleUrl: './token-add-edit-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenAddEditFormComponent implements OnInit {
  #isXSmall$ = inject(IS_XSMALL);
  #store = inject(Store);
  isEditMode = input(false);
  initialValues = input<PersonalAccessToken | null>(null);
  protected readonly dialogRef = inject(DynamicDialogRef);
  protected readonly TokenFormControls = TokenFormControls;
  protected readonly isXSmall = toSignal(this.#isXSmall$);
  protected readonly tokenScopes = this.#store.selectSignal(
    TokensState.getScopes,
  );

  readonly tokenForm: TokenForm = new FormGroup({
    [TokenFormControls.TokenName]: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    [TokenFormControls.Scopes]: new FormControl<string[]>([], {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    if (this.initialValues()) {
      this.tokenForm.patchValue({
        [TokenFormControls.TokenName]: this.initialValues()?.tokenName,
        [TokenFormControls.Scopes]: this.initialValues()?.scopes,
      });
    }
  }

  submitForm(): void {
    if (!this.tokenForm.valid) {
      this.tokenForm.markAllAsTouched();
      this.tokenForm.get(TokenFormControls.TokenName)?.markAsDirty();
      this.tokenForm.get(TokenFormControls.Scopes)?.markAsDirty();
      return;
    }

    //TODO integrate API
    this.dialogRef.close();
  }
}
