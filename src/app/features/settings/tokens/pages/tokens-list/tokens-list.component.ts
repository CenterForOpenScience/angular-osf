import { Store } from '@ngxs/store';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { ConfirmationService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { defaultConfirmationConfig } from '@osf/shared/helpers';
import { IS_XSMALL } from '@osf/shared/utils';

import { Token } from '../../models';
import { DeleteToken, GetTokens, TokensSelectors } from '../../store';

@Component({
  selector: 'osf-tokens-list',
  imports: [Button, Card, RouterLink, Skeleton, TranslateModule],
  templateUrl: './tokens-list.component.html',
  styleUrl: './tokens-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokensListComponent implements OnInit {
  #store = inject(Store);
  #confirmationService = inject(ConfirmationService);
  #translateService = inject(TranslateService);

  protected readonly isLoading = signal(false);
  protected readonly isXSmall = toSignal(inject(IS_XSMALL));

  tokens = this.#store.selectSignal(TokensSelectors.getTokens);

  deleteToken(token: Token) {
    this.#confirmationService.confirm({
      ...defaultConfirmationConfig,
      message: this.#translateService.instant('settings.tokens.confirmation.delete.message'),
      header: this.#translateService.instant('settings.tokens.confirmation.delete.title', { name: token.name }),
      acceptButtonProps: {
        ...defaultConfirmationConfig.acceptButtonProps,
        severity: 'danger',
        label: this.#translateService.instant('settings.tokens.list.deleteButton'),
      },
      accept: () => {
        this.#store.dispatch(new DeleteToken(token.id));
      },
    });
  }

  ngOnInit(): void {
    if (!this.tokens().length) {
      this.isLoading.set(true);
      this.#store.dispatch(GetTokens).subscribe({
        complete: () => {
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
    }
  }
}
