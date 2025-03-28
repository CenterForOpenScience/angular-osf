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
import { PersonalAccessToken } from '@osf/features/settings/tokens/tokens.enities';
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

  tokens = signal<PersonalAccessToken[]>([
    {
      id: '1',
      tokenName: 'Token name example 1',
      scopes: ['osf.full_read', 'osf.full_write'],
    },
    {
      id: '2',
      tokenName: 'Token name example 2',
      scopes: ['osf.full_read', 'osf.full_write'],
    },
    {
      id: '3',
      tokenName: 'Token name example 3',
      scopes: ['osf.full_read', 'osf.full_write'],
    },
    {
      id: '4',
      tokenName: 'Token name example 4',
      scopes: ['osf.full_read', 'osf.full_write'],
    },
  ]);

  deleteApp(token: PersonalAccessToken) {
    this.#confirmationService.confirm({
      ...defaultConfirmationConfig,
      message:
        'Are you sure you want to delete this token? This action cannot be reversed.',
      header: `Delete Token ${token.tokenName}?`,
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
