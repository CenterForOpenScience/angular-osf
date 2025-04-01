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
  TokenForm,
  TokenFormControls,
} from '@osf/features/settings/tokens/entities/token-form.entities';
import { CommonModule } from '@angular/common';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { TokensState } from '@core/store/settings';
import { TokensService } from '@osf/features/settings/tokens/tokens.service';
import { Token } from '@osf/features/settings/tokens/entities/tokens.models';

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
  #tokensService = inject(TokensService);
  isEditMode = input(false);
  initialValues = input<Token | null>(null);
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
        [TokenFormControls.TokenName]: this.initialValues()?.name,
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

    const { tokenName, scopes } = this.tokenForm.value;
    if (!tokenName || !scopes) return;

    this.#tokensService.createToken(tokenName, scopes).subscribe({
      next: (token) => {
        this.dialogRef.close(token);
      },
      error: (error) => {
        console.error('Failed to create token:', error);
        // TODO: Show error message to user
      },
    });
  }
}
