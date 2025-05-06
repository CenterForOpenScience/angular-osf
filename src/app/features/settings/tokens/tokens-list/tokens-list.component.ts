import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';
import { toSignal } from '@angular/core/rxjs-interop';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { RouterLink } from '@angular/router';
import { Token } from '@osf/features/settings/tokens/entities/tokens.models';
import { defaultConfirmationConfig } from '@shared/helpers/default-confirmation-config.helper';
import { Store } from '@ngxs/store';
import { DeleteToken, GetTokens, TokensSelectors } from '@core/store/settings';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'osf-tokens-list',
  imports: [Button, Card, RouterLink, Skeleton],
  templateUrl: './tokens-list.component.html',
  styleUrl: './tokens-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokensListComponent implements OnInit {
  #store = inject(Store);
  #confirmationService = inject(ConfirmationService);
  #isXSmall$ = inject(IS_XSMALL);
  protected readonly isLoading = signal(false);
  protected readonly isXSmall = toSignal(this.#isXSmall$);

  tokens = this.#store.selectSignal(TokensSelectors.getTokens);

  deleteToken(token: Token) {
    this.#confirmationService.confirm({
      ...defaultConfirmationConfig,
      message:
        'Are you sure you want to delete this token? This action cannot be reversed.',
      header: `Delete Token ${token.name}?`,
      acceptButtonProps: {
        ...defaultConfirmationConfig.acceptButtonProps,
        severity: 'danger',
        label: 'Delete',
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
