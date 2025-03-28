import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';
import { toSignal } from '@angular/core/rxjs-interop';
import { PersonalAccessToken } from '@osf/features/settings/tokens/tokens.enities';
import { defaultConfirmationConfig } from '@shared/helpers/default-confirmation-config.helper';
import { TokenAddEditFormComponent } from '@osf/features/settings/tokens/token-add-edit-form/token-add-edit-form.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'osf-token-details',
  imports: [Button, Card, FormsModule, RouterLink, TokenAddEditFormComponent],
  providers: [DialogService, DynamicDialogRef],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './token-details.component.html',
  styleUrls: ['./token-details.component.scss'],
})
export class TokenDetailsComponent {
  #confirmationService = inject(ConfirmationService);
  #isXSmall$ = inject(IS_XSMALL);
  readonly token = signal<PersonalAccessToken>({
    id: '1',
    tokenName: 'Token name example',
    scopes: ['osf.full_read', 'osf.full_write'],
  });
  protected readonly isXSmall = toSignal(this.#isXSmall$);

  deleteToken(): void {
    this.#confirmationService.confirm({
      ...defaultConfirmationConfig,
      message:
        'Are you sure you want to delete this token? This action cannot be reversed.',
      header: `Delete Token ${this.token().tokenName}?`,
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
