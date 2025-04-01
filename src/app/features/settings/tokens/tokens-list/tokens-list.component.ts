import {
  ChangeDetectionStrategy,
  Component,
  inject,
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

@Component({
  selector: 'osf-tokens-list',
  imports: [Button, Card, RouterLink],
  templateUrl: './tokens-list.component.html',
  styleUrl: './tokens-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokensListComponent {
  #confirmationService = inject(ConfirmationService);
  #isXSmall$ = inject(IS_XSMALL);
  protected readonly isXSmall = toSignal(this.#isXSmall$);

  tokens = signal<Token[]>([
    {
      id: '1',
      name: 'Token name example 1',
      tokenId: 'token1',
      scopes: ['osf.full_read', 'osf.full_write'],
      ownerId: 'user1',
      htmlUrl: 'https://osf.io/settings/tokens/1',
      apiUrl: 'https://api.osf.io/v2/tokens/1',
    },
    {
      id: '2',
      name: 'Token name example 2',
      tokenId: 'token2',
      scopes: ['osf.full_read', 'osf.full_write'],
      ownerId: 'user1',
      htmlUrl: 'https://osf.io/settings/tokens/2',
      apiUrl: 'https://api.osf.io/v2/tokens/2',
    },
    {
      id: '3',
      name: 'Token name example 3',
      tokenId: 'token3',
      scopes: ['osf.full_read', 'osf.full_write'],
      ownerId: 'user1',
      htmlUrl: 'https://osf.io/settings/tokens/3',
      apiUrl: 'https://api.osf.io/v2/tokens/3',
    },
    {
      id: '4',
      name: 'Token name example 4',
      tokenId: 'token4',
      scopes: ['osf.full_read', 'osf.full_write'],
      ownerId: 'user1',
      htmlUrl: 'https://osf.io/settings/tokens/4',
      apiUrl: 'https://api.osf.io/v2/tokens/4',
    },
  ]);

  deleteApp(token: Token) {
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
        //TODO integrate API
      },
    });
  }
}
