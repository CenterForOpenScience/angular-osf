import { select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Message } from 'primeng/message';

import { DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { ReviewAction } from '@osf/features/moderation/models';
import {
  recentActivityMessageByState,
  statusIconByState,
  statusLabelKeyByState,
  statusSeverityByState,
  statusSeverityByWorkflow,
} from '@osf/features/preprints/constants';
import { ReviewsState } from '@osf/features/preprints/enums';
import { getPreprintDocumentType } from '@osf/features/preprints/helpers';
import { PreprintProviderDetails, PreprintRequest } from '@osf/features/preprints/models';
import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { IconComponent } from '@osf/shared/components/icon/icon.component';

@Component({
  selector: 'osf-moderation-status-banner',
  imports: [IconComponent, Message, TitleCasePipe, TranslatePipe, DatePipe],
  templateUrl: './moderation-status-banner.component.html',
  styleUrl: './moderation-status-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModerationStatusBannerComponent {
  private readonly translateService = inject(TranslateService);
  private readonly environment = inject(ENVIRONMENT);

  readonly webUrl = this.environment.webUrl;

  readonly preprint = select(PreprintSelectors.getPreprint);

  readonly provider = input.required<PreprintProviderDetails>();
  readonly latestAction = input.required<ReviewAction | null>();
  readonly latestWithdrawalRequest = input.required<PreprintRequest | null>();
  readonly isPendingWithdrawal = input.required<boolean>();

  noActions = computed(() => this.latestAction() === null);
  currentState = computed(() => this.preprint()?.reviewsState ?? ReviewsState.Pending);

  documentType = computed(() => {
    const provider = this.provider();
    if (!provider) return null;

    return getPreprintDocumentType(provider, this.translateService);
  });

  labelDate = computed(() => {
    const preprint = this.preprint();
    return preprint?.dateWithdrawn ? preprint.dateWithdrawn : preprint?.dateLastTransitioned;
  });

  status = computed(() => {
    const currentState = this.currentState();

    if (this.isPendingWithdrawal()) {
      return statusLabelKeyByState[ReviewsState.Pending]!;
    } else {
      return statusLabelKeyByState[currentState]!;
    }
  });

  iconClass = computed(() => {
    const currentState = this.currentState();

    if (this.isPendingWithdrawal()) {
      return statusIconByState[ReviewsState.Pending];
    }

    return statusIconByState[currentState];
  });

  severity = computed(() => {
    const currentState = this.currentState();
    const workflow = this.provider()?.reviewsWorkflow;

    if (this.isPendingWithdrawal()) {
      return statusSeverityByState[ReviewsState.Pending];
    }

    if (currentState === ReviewsState.Pending && workflow) {
      return statusSeverityByWorkflow[workflow];
    }

    return statusSeverityByState[currentState];
  });

  recentActivityLanguage = computed(() => {
    const currentState = this.currentState();

    if (this.noActions()) {
      return recentActivityMessageByState.automatic[currentState]!;
    } else {
      return recentActivityMessageByState[currentState]!;
    }
  });

  requestActivityLanguage = computed(() => {
    if (!this.isPendingWithdrawal()) {
      return;
    }

    return recentActivityMessageByState[ReviewsState.PendingWithdrawal];
  });

  actionCreatorName = computed(() => this.latestAction()?.creator?.name);
  actionCreatorId = computed(() => this.latestAction()?.creator?.id);
  actionCreatorLink = computed(() => {
    const creatorId = this.actionCreatorId();
    return creatorId ? `${this.webUrl}/${creatorId}` : null;
  });

  withdrawalRequesterName = computed(() => this.latestWithdrawalRequest()?.creator.name);
  withdrawalRequesterId = computed(() => this.latestWithdrawalRequest()?.creator.id);
  withdrawalRequesterLink = computed(() => {
    const requesterId = this.withdrawalRequesterId();
    return requesterId ? `${this.webUrl}/${requesterId}` : null;
  });
}
