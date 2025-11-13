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
import { ProviderReviewsWorkflow, ReviewsState } from '@osf/features/preprints/enums';
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

  webUrl = this.environment.webUrl;

  preprint = select(PreprintSelectors.getPreprint);
  provider = input.required<PreprintProviderDetails>();
  latestAction = input.required<ReviewAction | null>();
  latestWithdrawalRequest = input.required<PreprintRequest | null>();

  isPendingWithdrawal = input.required<boolean>();

  noActions = computed(() => this.latestAction() === null);

  documentType = computed(() => {
    const provider = this.provider();
    if (!provider) return null;

    return getPreprintDocumentType(provider, this.translateService);
  });

  labelDate = computed(() => {
    const preprint = this.preprint()!;
    return preprint.dateWithdrawn ? preprint.dateWithdrawn : preprint.dateLastTransitioned;
  });

  status = computed(() => {
    const currentState = this.preprint()!.reviewsState;

    if (this.isPendingWithdrawal()) {
      return statusLabelKeyByState[ReviewsState.Pending]!;
    } else {
      return statusLabelKeyByState[currentState]!;
    }
  });

  iconClass = computed(() => {
    const currentState = this.preprint()!.reviewsState;

    if (this.isPendingWithdrawal()) {
      return statusIconByState[ReviewsState.Pending];
    }

    return statusIconByState[currentState];
  });

  severity = computed(() => {
    const currentState = this.preprint()!.reviewsState;

    if (this.isPendingWithdrawal()) {
      return statusSeverityByState[ReviewsState.Pending];
    } else {
      return currentState === ReviewsState.Pending
        ? statusSeverityByWorkflow[this.provider()?.reviewsWorkflow as ProviderReviewsWorkflow]
        : statusSeverityByState[currentState];
    }
  });

  recentActivityLanguage = computed(() => {
    const currentState = this.preprint()!.reviewsState;

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
  actionCreatorLink = computed(() => `${this.webUrl}/${this.actionCreatorId()}`);
  actionCreatorId = computed(() => this.latestAction()?.creator?.id);
  withdrawalRequesterName = computed(() => this.latestWithdrawalRequest()?.creator.name);
  withdrawalRequesterId = computed(() => this.latestWithdrawalRequest()?.creator.id);
}
