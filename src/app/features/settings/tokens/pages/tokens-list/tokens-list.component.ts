import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { CustomConfirmationService } from '@osf/shared/services';
import { IS_XSMALL } from '@osf/shared/utils';

import { Token } from '../../models';
import { DeleteToken, GetTokens, TokensSelectors } from '../../store';

@Component({
  selector: 'osf-tokens-list',
  imports: [Button, Card, RouterLink, Skeleton, TranslatePipe],
  templateUrl: './tokens-list.component.html',
  styleUrl: './tokens-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokensListComponent implements OnInit {
  actions = createDispatchMap({ getTokens: GetTokens, deleteToken: DeleteToken });
  customConfirmationService = inject(CustomConfirmationService);

  protected readonly isLoading = signal(false);
  protected readonly isXSmall = toSignal(inject(IS_XSMALL));

  tokens = select(TokensSelectors.getTokens);

  ngOnInit(): void {
    if (!this.tokens().length) {
      this.isLoading.set(true);
      this.actions.getTokens().subscribe({
        complete: () => {
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
    }
  }

  deleteToken(token: Token) {
    this.customConfirmationService.confirmDelete({
      headerKey: 'settings.tokens.confirmation.delete.title',
      headerParams: { name: token.name },
      messageKey: 'settings.tokens.confirmation.delete.message',
      onConfirm: () => this.actions.deleteToken(token.id),
    });
  }
}
