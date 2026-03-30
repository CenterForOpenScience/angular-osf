import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { PaginatorState } from 'primeng/paginator';
import { Skeleton } from 'primeng/skeleton';
import { TabsModule } from 'primeng/tabs';

import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { CustomPaginatorComponent } from '@osf/shared/components/custom-paginator/custom-paginator.component';
import { RegistrationCardComponent } from '@osf/shared/components/registration-card/registration-card.component';
import { SelectComponent } from '@osf/shared/components/select/select.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { IS_XSMALL } from '@osf/shared/helpers/breakpoints.tokens';
import { Primitive } from '@osf/shared/helpers/types.helper';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { REGISTRATIONS_TABS } from '../../constants';
import { RegistrationTab } from '../../enums';
import { DeleteDraft, FetchDraftRegistrations, FetchSubmittedRegistrations, RegistriesSelectors } from '../../store';

@Component({
  selector: 'osf-my-registrations',
  imports: [
    Button,
    Skeleton,
    TabsModule,
    RouterLink,
    NgTemplateOutlet,
    CustomPaginatorComponent,
    RegistrationCardComponent,
    SelectComponent,
    SubHeaderComponent,
    TranslatePipe,
  ],
  templateUrl: './my-registrations.component.html',
  styleUrl: './my-registrations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyRegistrationsComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly customConfirmationService = inject(CustomConfirmationService);
  private readonly toastService = inject(ToastService);
  private readonly environment = inject(ENVIRONMENT);

  readonly isMobile = toSignal(inject(IS_XSMALL));
  readonly tabOptions = REGISTRATIONS_TABS;

  draftRegistrations = select(RegistriesSelectors.getDraftRegistrations);
  draftRegistrationsTotalCount = select(RegistriesSelectors.getDraftRegistrationsTotalCount);
  isDraftRegistrationsLoading = select(RegistriesSelectors.isDraftRegistrationsLoading);
  submittedRegistrations = select(RegistriesSelectors.getSubmittedRegistrations);
  submittedRegistrationsTotalCount = select(RegistriesSelectors.getSubmittedRegistrationsTotalCount);
  isSubmittedRegistrationsLoading = select(RegistriesSelectors.isSubmittedRegistrationsLoading);

  actions = createDispatchMap({
    getDraftRegistrations: FetchDraftRegistrations,
    getSubmittedRegistrations: FetchSubmittedRegistrations,
    deleteDraft: DeleteDraft,
  });

  readonly RegistrationTab = RegistrationTab;

  readonly provider = this.environment.defaultProvider;

  selectedTab = signal(RegistrationTab.Submitted);
  itemsPerPage = 10;
  skeletons = [...Array(8)];
  draftFirst = 0;
  submittedFirst = 0;

  constructor() {
    const initialTab = this.route.snapshot.queryParams['tab'];
    const selectedTab = initialTab === RegistrationTab.Drafts ? RegistrationTab.Drafts : RegistrationTab.Submitted;
    this.onTabChange(selectedTab);
  }

  onTabChange(tab: Primitive): void {
    if (typeof tab !== 'string' || !Object.values(RegistrationTab).includes(tab as RegistrationTab)) {
      return;
    }

    const validTab = tab as RegistrationTab;

    this.selectedTab.set(validTab);
    this.loadTabData(validTab);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      queryParamsHandling: 'merge',
    });
  }

  private loadTabData(tab: RegistrationTab): void {
    if (tab === RegistrationTab.Drafts) {
      this.draftFirst = 0;
      this.actions.getDraftRegistrations();
    } else {
      this.submittedFirst = 0;
      this.actions.getSubmittedRegistrations();
    }
  }

  goToCreateRegistration(): void {
    this.router.navigate(['/registries', this.provider, 'new']);
  }

  onDeleteDraft(id: string): void {
    this.customConfirmationService.confirmDelete({
      headerKey: 'registries.deleteDraft',
      messageKey: 'registries.confirmDeleteDraft',
      onConfirm: () => {
        this.actions.deleteDraft(id).subscribe({
          next: () => {
            this.toastService.showSuccess('registries.successDeleteDraft');
            this.actions.getDraftRegistrations();
          },
        });
      },
    });
  }

  onDraftsPageChange(event: PaginatorState): void {
    this.actions.getDraftRegistrations(event.page! + 1);
    this.draftFirst = event.first!;
  }

  onSubmittedPageChange(event: PaginatorState): void {
    this.actions.getSubmittedRegistrations(event.page! + 1);
    this.submittedFirst = event.first!;
  }
}
