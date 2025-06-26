import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CustomConfirmationService, ToastService } from '@osf/shared/services';

import { TokenModel } from '../../models';
import { DeleteToken, GetTokens, TokensSelectors } from '../../store';

@Component({
  selector: 'osf-tokens-list',
  imports: [Button, Card, RouterLink, Skeleton, TranslatePipe],
  templateUrl: './tokens-list.component.html',
  styleUrl: './tokens-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokensListComponent implements OnInit {
  private readonly actions = createDispatchMap({ getTokens: GetTokens, deleteToken: DeleteToken });
  private readonly customConfirmationService = inject(CustomConfirmationService);
  private readonly toastService = inject(ToastService);

  protected readonly isLoading = select(TokensSelectors.isTokensLoading);

  tokens = select(TokensSelectors.getTokens);

  ngOnInit(): void {
    this.actions.getTokens();
  }

  deleteToken(token: TokenModel) {
    this.customConfirmationService.confirmDelete({
      headerKey: 'settings.tokens.confirmation.delete.title',
      headerParams: { name: token.name },
      messageKey: 'settings.tokens.confirmation.delete.message',
      onConfirm: () =>
        this.actions.deleteToken(token.id).subscribe({
          next: () => this.toastService.showSuccess('settings.tokens.toastMessage.successDelete'),
        }),
    });
  }
}
