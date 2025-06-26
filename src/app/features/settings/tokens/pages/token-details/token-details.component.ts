import { createDispatchMap, select, Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { IconComponent, LoadingSpinnerComponent } from '@osf/shared/components';
import { CustomConfirmationService, ToastService } from '@osf/shared/services';

import { TokenAddEditFormComponent } from '../../components';
import { DeleteToken, GetTokenById, TokensSelectors } from '../../store';

@Component({
  selector: 'osf-token-details',
  imports: [Button, Card, RouterLink, TranslatePipe, TokenAddEditFormComponent, IconComponent, LoadingSpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './token-details.component.html',
  styleUrls: ['./token-details.component.scss'],
  providers: [DialogService, DynamicDialogRef],
})
export class TokenDetailsComponent implements OnInit {
  private readonly customConfirmationService = inject(CustomConfirmationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  private readonly toastService = inject(ToastService);

  private readonly actions = createDispatchMap({ getTokenById: GetTokenById, deleteToken: DeleteToken });

  tokenId = signal(this.route.snapshot.paramMap.get('id') ?? '');
  token = computed(() => this.store.selectSignal(TokensSelectors.getTokenById)()(this.tokenId()));
  isLoading = select(TokensSelectors.isTokensLoading);

  ngOnInit(): void {
    if (this.tokenId()) {
      this.actions.getTokenById(this.tokenId());
    }
  }

  deleteToken(): void {
    this.customConfirmationService.confirmDelete({
      headerKey: 'settings.tokens.confirmation.delete.title',
      headerParams: { name: this.token()?.name },
      messageKey: 'settings.tokens.confirmation.delete.message',
      onConfirm: () =>
        this.actions.deleteToken(this.tokenId()).subscribe({
          next: () => {
            this.toastService.showSuccess('settings.tokens.toastMessage.successDelete');
            this.router.navigate(['settings/tokens']);
          },
        }),
    });
  }
}
