import { createDispatchMap } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, computed, HostBinding, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { RegistrationReviewStates, RegistryStatus, RevisionReviewStates } from '@osf/shared/enums';
import { hasViewOnlyParam } from '@osf/shared/helpers';
import { CustomConfirmationService } from '@osf/shared/services';

import { RegistryOverview } from '../../models';
import { MakePublic } from '../../store/registry-overview';
import { WithdrawDialogComponent } from '../withdraw-dialog/withdraw-dialog.component';

@Component({
  selector: 'osf-registry-statuses',
  imports: [Accordion, AccordionContent, AccordionHeader, AccordionPanel, TranslatePipe, Button],
  templateUrl: './registry-statuses.component.html',
  styleUrl: './registry-statuses.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryStatusesComponent {
  @HostBinding('class') classes = 'flex-1 flex';
  private readonly router = inject(Router);
  private readonly dialogService = inject(DialogService);
  private readonly translateService = inject(TranslateService);

  registry = input.required<RegistryOverview | null>();

  readonly RegistryStatus = RegistryStatus;
  readonly RevisionReviewStates = RevisionReviewStates;
  readonly customConfirmationService = inject(CustomConfirmationService);
  readonly actions = createDispatchMap({ makePublic: MakePublic });

  get canWithdraw(): boolean {
    return (
      this.registry()?.reviewsState === RegistrationReviewStates.Accepted &&
      this.registry()?.revisionStatus === RevisionReviewStates.RevisionPendingModeration
    );
  }

  hasViewOnly = computed(() => {
    return hasViewOnlyParam(this.router);
  });

  openWithdrawDialog(): void {
    const registry = this.registry();
    if (registry) {
      this.dialogService.open(WithdrawDialogComponent, {
        width: '552px',
        focusOnShow: false,
        header: this.translateService.instant('registry.overview.withdrawRegistration'),
        closeOnEscape: true,
        modal: true,
        closable: true,
        data: {
          registryId: registry.id,
        },
      });
    }
  }

  openMakePublicDialog(): void {
    const registry = this.registry();
    if (registry) {
      this.customConfirmationService.confirmAccept({
        headerKey: 'common.labels.makePublic',
        messageKey: 'registry.overview.makePublicMessage',
        acceptLabelKey: 'common.labels.makePublic',
        onConfirm: () => this.actions.makePublic(registry.id),
      });
    }
  }
}
