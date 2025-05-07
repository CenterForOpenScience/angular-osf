import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
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
import { Token } from '@osf/features/settings/tokens/entities/tokens.models';
import { map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenCreatedDialogComponent } from '@osf/features/settings/tokens/token-created-dialog/token-created-dialog.component';
import {
  CreateToken,
  GetTokens,
  TokensSelectors,
  UpdateToken,
} from '@osf/features/settings/tokens/store';

@Component({
  selector: 'osf-token-add-edit-form',
  imports: [Button, InputText, ReactiveFormsModule, CommonModule, Checkbox],
  templateUrl: './token-add-edit-form.component.html',
  styleUrl: './token-add-edit-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenAddEditFormComponent implements OnInit {
  #store = inject(Store);
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #dialogService = inject(DialogService);
  isEditMode = input(false);
  initialValues = input<Token | null>(null);
  protected readonly tokenId = toSignal(
    this.#route.params.pipe(map((params) => params['id'])),
  );
  protected readonly dialogRef = inject(DynamicDialogRef);
  protected readonly TokenFormControls = TokenFormControls;
  protected readonly isMobile = toSignal(inject(IS_XSMALL));
  protected readonly tokenScopes = this.#store.selectSignal(
    TokensSelectors.getScopes,
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
    this.#store.dispatch(GetTokens);
    if (this.initialValues()) {
      this.tokenForm.patchValue({
        [TokenFormControls.TokenName]: this.initialValues()?.name,
        [TokenFormControls.Scopes]: this.initialValues()?.scopes,
      });
    }
  }

  handleSubmitForm(): void {
    if (!this.tokenForm.valid) {
      this.tokenForm.markAllAsTouched();
      this.tokenForm.get(TokenFormControls.TokenName)?.markAsDirty();
      this.tokenForm.get(TokenFormControls.Scopes)?.markAsDirty();
      return;
    }

    const { tokenName, scopes } = this.tokenForm.value;
    if (!tokenName || !scopes) return;

    if (!this.isEditMode()) {
      this.#store.dispatch(new CreateToken(tokenName, scopes)).subscribe({
        complete: () => {
          const tokens = this.#store.selectSnapshot(TokensSelectors.getTokens);
          const newToken = tokens[0];
          this.dialogRef.close();
          this.#showTokenCreatedDialog(newToken.name, newToken.tokenId);
        },
      });
    } else {
      this.#store
        .dispatch(new UpdateToken(this.tokenId(), tokenName, scopes))
        .subscribe({
          complete: () => {
            this.#router.navigate(['settings/tokens']);
          },
        });
    }
  }

  #showTokenCreatedDialog(tokenName: string, tokenValue: string) {
    let dialogWidth = '500px';

    if (this.isMobile()) {
      dialogWidth = '345px';
    }

    this.#dialogService.open(TokenCreatedDialogComponent, {
      width: dialogWidth,
      header: 'Token Successfully Created',
      closeOnEscape: true,
      modal: true,
      closable: true,
      data: {
        tokenName,
        tokenValue,
      },
    });
  }
}
