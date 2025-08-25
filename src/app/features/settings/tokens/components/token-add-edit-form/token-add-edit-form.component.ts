import { createDispatchMap, select, Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { map } from 'rxjs';

import { ChangeDetectionStrategy, Component, effect, inject, input, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TextInputComponent } from '@osf/shared/components';
import { InputLimits } from '@osf/shared/constants';
import { ToastService } from '@osf/shared/services';

import { TokenForm, TokenFormControls, TokenModel } from '../../models';
import { CreateToken, GetTokens, TokensSelectors, UpdateToken } from '../../store';
import { TokenCreatedDialogComponent } from '../token-created-dialog/token-created-dialog.component';

@Component({
  selector: 'osf-token-add-edit-form',
  imports: [Button, Checkbox, ReactiveFormsModule, TextInputComponent, TranslatePipe],
  templateUrl: './token-add-edit-form.component.html',
  styleUrl: './token-add-edit-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenAddEditFormComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialogService = inject(DialogService);
  private readonly translateService = inject(TranslateService);
  private readonly toastService = inject(ToastService);
  private readonly store = inject(Store);

  private readonly actions = createDispatchMap({
    createToken: CreateToken,
    getTokens: GetTokens,
    updateToken: UpdateToken,
  });

  isEditMode = input(false);
  initialValues = input<TokenModel | null>(null);

  readonly inputLimits = InputLimits.fullName;

  readonly tokenId = toSignal(this.route.params.pipe(map((params) => params['id'])));
  readonly dialogRef = inject(DynamicDialogRef);
  readonly TokenFormControls = TokenFormControls;
  readonly tokenScopes = select(TokensSelectors.getScopes);
  readonly isLoading = select(TokensSelectors.isTokensLoading);

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

  constructor() {
    effect(() => {
      return this.isLoading() ? this.tokenForm.disable() : this.tokenForm.enable();
    });
  }

  ngOnInit(): void {
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
      this.actions.createToken(tokenName, scopes).subscribe({
        complete: () => {
          this.toastService.showSuccess('settings.tokens.toastMessage.successCreate');
          const tokens = this.store.selectSignal(TokensSelectors.getTokens);
          const newToken = tokens()[0];
          this.dialogRef.close();
          this.showTokenCreatedDialog(newToken.name, newToken.id);
        },
      });
    } else {
      this.actions.updateToken(this.tokenId(), tokenName, scopes).subscribe({
        complete: () => {
          this.router.navigate(['settings/tokens']);
          this.toastService.showSuccess('settings.tokens.toastMessage.successEdit');
        },
      });
    }
  }

  showTokenCreatedDialog(tokenName: string, tokenValue: string) {
    this.dialogService.open(TokenCreatedDialogComponent, {
      width: '500px',
      header: this.translateService.instant('settings.tokens.createdDialog.title'),
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
