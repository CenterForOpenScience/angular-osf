import { createDispatchMap } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, computed, HostBinding, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RegistrationReviewStates, RegistryStatus, RevisionReviewStates } from '@osf/shared/enums';
import { CustomConfirmationService } from '@osf/shared/services';

import { RegistryOverview } from '../../models';
import { MakePublic } from '../../store/registry-overview';
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
  private readonly dialogService = inject(DialogService);
  private readonly translateService = inject(TranslateService);

  registry = input.required<RegistryOverview | null>();
  canEdit = input<boolean>(false);
  isModeration = input<boolean>(false);

  readonly RegistryStatus = RegistryStatus;
  readonly RevisionReviewStates = RevisionReviewStates;
  readonly customConfirmationService = inject(CustomConfirmationService);
  readonly actions = createDispatchMap({ makePublic: MakePublic });

  canWithdraw = computed(
    () => this.registry()?.reviewsState === RegistrationReviewStates.Accepted && !this.isModeration()
  );

  isAccepted = computed(() => this.registry()?.reviewsState === RegistrationReviewStates.Accepted);
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
