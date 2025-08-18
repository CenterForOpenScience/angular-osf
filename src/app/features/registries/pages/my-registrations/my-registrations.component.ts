import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { PaginatorState } from 'primeng/paginator';
import { Skeleton } from 'primeng/skeleton';
import { TabsModule } from 'primeng/tabs';

import { tap } from 'rxjs';

import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { UserSelectors } from '@osf/core/store/user';
import { CustomPaginatorComponent, SelectComponent, SubHeaderComponent } from '@osf/shared/components';
import { RegistrationCardComponent } from '@osf/shared/components/registration-card/registration-card.component';
import { IS_XSMALL } from '@osf/shared/helpers';
import { CustomConfirmationService, ToastService } from '@osf/shared/services';

import { REGISTRATIONS_TABS } from '../../constants/registrations-tabs';
import { RegistrationTab } from '../../enums';
import {
  CreateSchemaResponse,
  DeleteDraft,
  FetchAllSchemaResponses,
  FetchDraftRegistrations,
  FetchSubmittedRegistrations,
  RegistriesSelectors,
} from '../../store';

@Component({
  selector: 'osf-my-registrations',
  imports: [
    SubHeaderComponent,
    TranslatePipe,
    TabsModule,
    FormsModule,
    SelectComponent,
    RegistrationCardComponent,
    CustomPaginatorComponent,
    Skeleton,
    Button,
    RouterLink,
    NgTemplateOutlet,
  ],
  templateUrl: './my-registrations.component.html',
  styleUrl: './my-registrations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyRegistrationsComponent {
  private router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly customConfirmationService = inject(CustomConfirmationService);
  private readonly toastService = inject(ToastService);

  protected readonly isMobile = toSignal(inject(IS_XSMALL));
  protected readonly tabOptions = REGISTRATIONS_TABS;

  private currentUser = select(UserSelectors.getCurrentUser);
  protected draftRegistrations = select(RegistriesSelectors.getDraftRegistrations);
  protected draftRegistrationsTotalCount = select(RegistriesSelectors.getDraftRegistrationsTotalCount);
  protected isDraftRegistrationsLoading = select(RegistriesSelectors.isDraftRegistrationsLoading);
  protected submittedRegistrations = select(RegistriesSelectors.getSubmittedRegistrations);
  protected submittedRegistrationsTotalCount = select(RegistriesSelectors.getSubmittedRegistrationsTotalCount);
  protected isSubmittedRegistrationsLoading = select(RegistriesSelectors.isSubmittedRegistrationsLoading);
  protected schemaResponse = select(RegistriesSelectors.getSchemaResponse);

  protected actions = createDispatchMap({
    getDraftRegistrations: FetchDraftRegistrations,
    getSubmittedRegistrations: FetchSubmittedRegistrations,
    deleteDraft: DeleteDraft,
    getSchemaResponse: FetchAllSchemaResponses,
    createSchemaResponse: CreateSchemaResponse,
  });

  protected readonly RegistrationTab = RegistrationTab;

  readonly provider = 'osf';

  selectedTab = signal(RegistrationTab.Submitted);
  itemsPerPage = 10;
  skeletons = [...Array(8)];
  draftFirst = 0;
  submittedFirst = 0;

  constructor() {
    const initialTab = this.route.snapshot.queryParams['tab'];
    if (initialTab == 'drafts') {
      this.selectedTab.set(RegistrationTab.Drafts);
    } else {
      this.selectedTab.set(RegistrationTab.Submitted);
    }

    effect(() => {
      const tab = this.selectedTab();

      if (tab === 0) {
        this.draftFirst = 0;
        this.actions.getDraftRegistrations();
      } else {
        this.submittedFirst = 0;
        this.actions.getSubmittedRegistrations(this.currentUser()?.id);
      }
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { tab: tab === RegistrationTab.Drafts ? 'drafts' : 'submitted' },
        queryParamsHandling: 'merge',
      });
    });
  }

  goToCreateRegistration(): void {
    this.router.navigate([`/registries/${this.provider}/new`]);
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
    this.actions.getSubmittedRegistrations(this.currentUser()?.id, event.page! + 1);
    this.submittedFirst = event.first!;
  }

  onUpdateRegistration(id: string): void {
    this.actions
      .createSchemaResponse(id)
      .pipe(
        tap(() => {
          this.navigateToJustificationPage();
        })
      )
      .subscribe();
  }

  onContinueUpdateRegistration({ id, unapproved }: { id: string; unapproved: boolean }): void {
    this.actions
      .getSchemaResponse(id)
      .pipe(
        tap(() => {
          if (unapproved) {
            this.navigateToJustificationReview();
          } else {
            this.navigateToJustificationPage();
          }
        })
      )
      .subscribe();
  }

  private navigateToJustificationPage(): void {
    const revisionId = this.schemaResponse()?.id;
    this.router.navigate([`/registries/revisions/${revisionId}/justification`]);
  }

  private navigateToJustificationReview(): void {
    const revisionId = this.schemaResponse()?.id;
    this.router.navigate([`/registries/revisions/${revisionId}/review`]);
  }
}
