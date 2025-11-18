import { createDispatchMap } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Button } from 'primeng/button';

import { ChangeDetectionStrategy, Component, computed, HostBinding, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { RegistrationReviewStates } from '@osf/shared/enums/registration-review-states.enum';
import { RegistryStatus } from '@osf/shared/enums/registry-status.enum';
import { RevisionReviewStates } from '@osf/shared/enums/revision-review-states.enum';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';

import { RegistrationOverviewModel } from '../../models';
import { MakePublic } from '../../store/registry';
import { WithdrawDialogComponent } from '../withdraw-dialog/withdraw-dialog.component';

@Component({
  selector: 'osf-registry-statuses',
  imports: [Accordion, AccordionContent, AccordionHeader, AccordionPanel, TranslatePipe, Button, RouterLink],
  templateUrl: './registry-statuses.component.html',
  styleUrl: './registry-statuses.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryStatusesComponent {
  @HostBinding('class') classes = 'flex-1 flex';
  private readonly customDialogService = inject(CustomDialogService);
  private readonly environment = inject(ENVIRONMENT);

  readonly supportEmail = this.environment.supportEmail;

  registry = input.required<RegistrationOverviewModel | null>();
  canEdit = input<boolean>(false);
  isModeration = input<boolean>(false);

  readonly RegistryStatus = RegistryStatus;
  readonly RevisionReviewStates = RevisionReviewStates;
  readonly customConfirmationService = inject(CustomConfirmationService);
  readonly actions = createDispatchMap({ makePublic: MakePublic });

  canWithdraw = computed(
    () => this.registry()?.reviewsState === RegistrationReviewStates.Accepted && !this.isModeration()
  );

  isAccepted = computed(() => this.registry()?.status === RegistryStatus.Accepted);
  isEmbargo = computed(() => this.registry()?.status === RegistryStatus.Embargo);

  get embargoEndDate() {
    const embargoEndDate = this.registry()?.embargoEndDate;
    if (embargoEndDate) {
      return new Date(embargoEndDate).toDateString();
    }
    return null;
  }

  openWithdrawDialog(): void {
    const registry = this.registry();

    if (registry) {
      this.customDialogService.open(WithdrawDialogComponent, {
        header: 'registry.overview.withdrawRegistration',
        width: '552px',
        data: {
          registryId: registry.id,
        },
      });
    }
  }

  openEndEmbargoDialog(): void {
    const registry = this.registry();
    if (registry) {
      this.customConfirmationService.confirmDelete({
        headerKey: 'registry.overview.endEmbargo',
        messageKey: 'registry.overview.endEmbargoMessage',
        acceptLabelKey: 'common.buttons.confirm',
        onConfirm: () => this.actions.makePublic(registry.id),
      });
    }
  }
}
