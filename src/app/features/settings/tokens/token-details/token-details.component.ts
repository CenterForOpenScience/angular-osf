import { Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { ConfirmationService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { map, of, switchMap } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { DeleteToken, GetTokenById } from '@osf/features/settings/tokens/store/tokens.actions';
import { TokensSelectors } from '@osf/features/settings/tokens/store/tokens.selectors';
import { TokenAddEditFormComponent } from '@osf/features/settings/tokens/token-add-edit-form/token-add-edit-form.component';
import { defaultConfirmationConfig } from '@shared/helpers/default-confirmation-config.helper';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';

@Component({
  selector: 'osf-token-details',
  imports: [Button, Card, FormsModule, RouterLink, TokenAddEditFormComponent, TranslatePipe],
  providers: [DialogService, DynamicDialogRef],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './token-details.component.html',
  styleUrls: ['./token-details.component.scss'],
})
export class TokenDetailsComponent {
  #confirmationService = inject(ConfirmationService);
  #isXSmall$ = inject(IS_XSMALL);
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #store = inject(Store);
  #translateService = inject(TranslateService);

  readonly tokenId = toSignal(
    this.#route.params.pipe(
      map((params) => params['id']),
      switchMap((tokenId) => {
        const token = this.#store.selectSnapshot(TokensSelectors.getTokenById)(tokenId);
        if (!token) {
          this.#store.dispatch(new GetTokenById(tokenId));
        }
        return of(tokenId);
      })
    )
  );

  readonly token = computed(() => {
    const id = this.tokenId();
    if (!id) return null;
    const token = this.#store.selectSignal(TokensSelectors.getTokenById)();
    return token(id) ?? null;
  });

  protected readonly isXSmall = toSignal(this.#isXSmall$);

  deleteToken(): void {
    this.#confirmationService.confirm({
      ...defaultConfirmationConfig,
      message: this.#translateService.instant('settings.tokens.confirmation.delete.message'),
      header: this.#translateService.instant('settings.tokens.confirmation.delete.title', { name: this.token()?.name }),
      acceptButtonProps: {
        ...defaultConfirmationConfig.acceptButtonProps,
        severity: 'danger',
        label: this.#translateService.instant('settings.tokens.list.deleteButton'),
      },
      accept: () => {
        this.#store.dispatch(new DeleteToken(this.tokenId())).subscribe({
          next: () => {
            this.#router.navigate(['settings/tokens']);
          },
        });
      },
    });
  }
}
