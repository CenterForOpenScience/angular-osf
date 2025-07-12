import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { TabsModule } from 'primeng/tabs';

import { tap } from 'rxjs';

import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SelectComponent, SubHeaderComponent } from '@osf/shared/components';
import { RegistrationCardComponent } from '@osf/shared/components/registration-card/registration-card.component';
import { CustomConfirmationService, LoaderService } from '@osf/shared/services';
import { IS_XSMALL } from '@osf/shared/utils';

import { REGISTRATIONS_TABS } from '../../constants/registrations-tabs';
import { DeleteDraft, FetchDraftRegistrations, FetchSubmittedRegistrations, RegistriesSelectors } from '../../store';

@Component({
  selector: 'osf-my-registrations',
  imports: [SubHeaderComponent, TranslatePipe, TabsModule, FormsModule, SelectComponent, RegistrationCardComponent],
  templateUrl: './my-registrations.component.html',
  styleUrl: './my-registrations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyRegistrationsComponent {
  private router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly loaderService = inject(LoaderService);

  private readonly translateService = inject(TranslateService);
  private readonly customConfirmationService = inject(CustomConfirmationService);

  protected readonly isMobile = toSignal(inject(IS_XSMALL));
  protected readonly tabOptions = REGISTRATIONS_TABS;

  protected draftRegistrations = select(RegistriesSelectors.getDraftRegistrations);
  protected submittedRegistrations = select(RegistriesSelectors.getSubmittedRegistrations);

  protected actions = createDispatchMap({
    getDraftRegistrations: FetchDraftRegistrations,
    getSubmittedRegistrations: FetchSubmittedRegistrations,
    deleteDraft: DeleteDraft,
  });

  selectedTab = signal(1);

  constructor() {
    const initialTab = this.route.snapshot.queryParams['tab'];
    if (initialTab == 'drafts') {
      this.selectedTab.set(0);
    } else {
      this.selectedTab.set(1);
    }

    effect(() => {
      const tab = this.selectedTab();
      this.loaderService.show();

      if (tab === 0) {
        this.actions
          .getDraftRegistrations()
          .pipe(tap(() => this.loaderService.hide()))
          .subscribe();
      } else {
        this.actions
          .getSubmittedRegistrations()
          .pipe(tap(() => this.loaderService.hide()))
          .subscribe();
      }
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { tab: tab === 0 ? 'drafts' : 'submitted' },
        queryParamsHandling: 'merge',
      });
    });
  }

  goToCreateRegistration(): void {
    this.router.navigate(['/registries/new']);
  }

  onDeleteDraft(id: string): void {
    this.customConfirmationService.confirmDelete({
      headerKey: 'registries.deleteDraft',
      messageKey: 'registries.confirmDeleteDraft',
      onConfirm: () => {
        this.actions.deleteDraft(id).subscribe({
          next: () => {
            this.actions.getDraftRegistrations();
          },
        });
      },
    });
  }
}
