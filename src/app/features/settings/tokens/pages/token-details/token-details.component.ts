import { createDispatchMap, Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { map, of, switchMap } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CustomConfirmationService } from '@osf/shared/services';
import { IS_XSMALL } from '@osf/shared/utils';

import { TokenAddEditFormComponent } from '../../components';
import { DeleteToken, GetTokenById, TokensSelectors } from '../../store';

@Component({
  selector: 'osf-token-details',
  imports: [Button, Card, FormsModule, RouterLink, TokenAddEditFormComponent, TranslatePipe],
  providers: [DialogService, DynamicDialogRef],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './token-details.component.html',
  styleUrls: ['./token-details.component.scss'],
})
export class TokenDetailsComponent {
  private readonly customConfirmationService = inject(CustomConfirmationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(Store);

  private readonly actions = createDispatchMap({ getTokenById: GetTokenById, deleteToken: DeleteToken });

  protected readonly isXSmall = toSignal(inject(IS_XSMALL));

  readonly tokenId = toSignal(
    this.route.params.pipe(
      map((params) => params['id']),
      switchMap((tokenId) => {
        const token = this.store.selectSnapshot(TokensSelectors.getTokenById)(tokenId);

        if (!token) {
          this.actions.getTokenById(tokenId);
        }

        return of(tokenId);
      })
    )
  );

  readonly token = computed(() => {
    const id = this.tokenId();
    if (!id) return null;

    const token = this.store.selectSignal(TokensSelectors.getTokenById)();
    return token(id) ?? null;
  });

  deleteToken(): void {
    this.customConfirmationService.confirmDelete({
      headerKey: 'settings.tokens.confirmation.delete.title',
      headerParams: { name: this.token()?.name },
      messageKey: 'settings.tokens.confirmation.delete.message',
      onConfirm: () => {
        this.actions.deleteToken(this.tokenId()).subscribe({
          next: () => {
            this.router.navigate(['settings/tokens']);
          },
        });
      },
    });
  }
}
