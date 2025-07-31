import { createDispatchMap, Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, HostBinding, inject, input } from '@angular/core';

import { WithdrawDialogComponent } from '@osf/features/registry/components';
import { RegistryOverview } from '@osf/features/registry/models';
import { MakePublic } from '@osf/features/registry/store/registry-overview';
import { RegistrationReviewStates, RevisionReviewStates } from '@osf/shared/enums';
import { RegistryStatus } from '@shared/enums';
import { CustomConfirmationService } from '@shared/services';

@Component({
  selector: 'osf-registry-statuses',
  imports: [Accordion, AccordionContent, AccordionHeader, AccordionPanel, TranslatePipe, Button],
  templateUrl: './registry-statuses.component.html',
  styleUrl: './registry-statuses.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryStatusesComponent {
  @HostBinding('class') classes = 'flex-1 flex';
  private readonly store = inject(Store);
  registry = input.required<RegistryOverview | null>();
  private readonly dialogService = inject(DialogService);
  private readonly translateService = inject(TranslateService);
  protected readonly RegistryStatus = RegistryStatus;
  protected readonly RevisionReviewStates = RevisionReviewStates;
  protected readonly customConfirmationService = inject(CustomConfirmationService);
  protected readonly actions = createDispatchMap({
    makePublic: MakePublic,
  });

  get canWithdraw(): boolean {
    return (
      this.registry()?.reviewsState === RegistrationReviewStates.Accepted &&
      this.registry()?.revisionStatus === RevisionReviewStates.RevisionPendingModeration
    );
  }

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
