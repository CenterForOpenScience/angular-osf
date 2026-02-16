import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Message } from 'primeng/message';
import { Tag } from 'primeng/tag';

import { filter, map } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { LicenseDisplayComponent } from '@osf/shared/components/license-display/license-display.component';
import { RegistrationBlocksDataComponent } from '@osf/shared/components/registration-blocks-data/registration-blocks-data.component';
import { INPUT_VALIDATION_MESSAGES } from '@osf/shared/constants/input-validation-messages.const';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ToastService } from '@osf/shared/services/toast.service';
import {
  ContributorsSelectors,
  GetAllContributors,
  LoadMoreContributors,
  ResetContributorsState,
} from '@osf/shared/stores/contributors';
import { FetchSelectedSubjects, SubjectsSelectors } from '@osf/shared/stores/subjects';

import { ClearState, DeleteDraft, FetchLicenses, FetchProjectChildren, RegistriesSelectors } from '../../store';
import { ConfirmRegistrationDialogComponent } from '../confirm-registration-dialog/confirm-registration-dialog.component';
import { SelectComponentsDialogComponent } from '../select-components-dialog/select-components-dialog.component';

@Component({
  selector: 'osf-review',
  imports: [
    TranslatePipe,
    Card,
    Message,
    Tag,
    Button,
    RegistrationBlocksDataComponent,
    ContributorsListComponent,
    LicenseDisplayComponent,
  ],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly customConfirmationService = inject(CustomConfirmationService);
  private readonly customDialogService = inject(CustomDialogService);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly environment = inject(ENVIRONMENT);

  readonly pages = select(RegistriesSelectors.getPagesSchema);
  readonly draftRegistration = select(RegistriesSelectors.getDraftRegistration);
  readonly isDraftSubmitting = select(RegistriesSelectors.isDraftSubmitting);
  readonly isDraftLoading = select(RegistriesSelectors.isDraftLoading);
  readonly stepsData = select(RegistriesSelectors.getStepsData);
  readonly components = select(RegistriesSelectors.getRegistrationComponents);
  readonly license = select(RegistriesSelectors.getRegistrationLicense);
  readonly newRegistration = select(RegistriesSelectors.getRegistration);
  readonly stepsState = select(RegistriesSelectors.getStepsState);
  readonly contributors = select(ContributorsSelectors.getContributors);
  readonly areContributorsLoading = select(ContributorsSelectors.isContributorsLoading);
  readonly hasMoreContributors = select(ContributorsSelectors.hasMoreContributors);
  readonly subjects = select(SubjectsSelectors.getSelectedSubjects);
  readonly hasAdminAccess = select(RegistriesSelectors.hasDraftAdminAccess);

  private readonly actions = createDispatchMap({
    getContributors: GetAllContributors,
    getSubjects: FetchSelectedSubjects,
    deleteDraft: DeleteDraft,
    clearState: ClearState,
    getProjectsComponents: FetchProjectChildren,
    fetchLicenses: FetchLicenses,
    loadMoreContributors: LoadMoreContributors,
    resetContributorsState: ResetContributorsState,
  });

  readonly INPUT_VALIDATION_MESSAGES = INPUT_VALIDATION_MESSAGES;

  private readonly draftId = toSignal(this.route.params.pipe(map((params) => params['id'])));

  private readonly resolvedProviderId = computed(() => {
    const draft = this.draftRegistration();
    return draft ? (draft.providerId ?? this.environment.defaultProvider) : undefined;
  });

  private readonly componentsLoaded = signal(false);

  isDraftInvalid = computed(() => Object.values(this.stepsState()).some((step) => step.invalid));
  licenseOptionsRecord = computed(() => (this.draftRegistration()?.license.options ?? {}) as Record<string, string>);
  registerButtonDisabled = computed(() => this.isDraftLoading() || this.isDraftInvalid() || !this.hasAdminAccess());

  constructor() {
    if (!this.contributors()?.length) {
      this.actions.getContributors(this.draftId(), ResourceType.DraftRegistration);
    }

    if (!this.subjects()?.length) {
      this.actions.getSubjects(this.draftId(), ResourceType.DraftRegistration);
    }

    effect(() => {
      const providerId = this.resolvedProviderId();

      if (providerId) {
        this.actions.fetchLicenses(providerId);
      }
    });

    effect(() => {
      if (!this.isDraftSubmitting() && !this.componentsLoaded()) {
        const draft = this.draftRegistration();
        if (draft?.hasProject) {
          this.actions.getProjectsComponents(draft.branchedFrom?.id ?? '');
          this.componentsLoaded.set(true);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.actions.resetContributorsState();
  }

  goBack(): void {
    const previousStep = this.pages().length;
    this.router.navigate(['../', previousStep], { relativeTo: this.route });
  }

  deleteDraft(): void {
    this.customConfirmationService.confirmDelete({
      headerKey: 'registries.deleteDraft',
      messageKey: 'registries.confirmDeleteDraft',
      onConfirm: () => {
        const providerId = this.draftRegistration()?.providerId;
        this.actions
          .deleteDraft(this.draftId())
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.actions.clearState();
            this.router.navigateByUrl(`/registries/${providerId}/new`);
          });
      },
    });
  }

  confirmRegistration(): void {
    if (this.components()?.length) {
      this.openSelectComponentsForRegistrationDialog();
    } else {
      this.openConfirmRegistrationDialog();
    }
  }

  openSelectComponentsForRegistrationDialog(): void {
    this.customDialogService
      .open(SelectComponentsDialogComponent, {
        header: 'registries.review.selectComponents.title',
        width: '552px',
        data: {
          parent: this.draftRegistration()?.branchedFrom,
          components: this.components(),
        },
      })
      .onClose.pipe(
        filter((selectedComponents) => !!selectedComponents),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((selectedComponents) => this.openConfirmRegistrationDialog(selectedComponents));
  }

  openConfirmRegistrationDialog(components?: string[]): void {
    this.customDialogService
      .open(ConfirmRegistrationDialogComponent, {
        header: 'registries.review.confirmation.title',
        width: '552px',
        data: {
          draftId: this.draftId(),
          projectId:
            this.draftRegistration()?.branchedFrom?.type === 'nodes'
              ? this.draftRegistration()?.branchedFrom?.id
              : null,
          providerId: this.draftRegistration()?.providerId,
          components,
        },
      })
      .onClose.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        if (res) {
          this.toastService.showSuccess('registries.review.confirmation.successMessage');
          const id = this.newRegistration()?.id;
          if (id) {
            this.router.navigate([`/${id}/overview`]);
          }
        } else if (this.components()?.length) {
          this.openSelectComponentsForRegistrationDialog();
        }
      });
  }

  loadMoreContributors(): void {
    this.actions.loadMoreContributors(this.draftId(), ResourceType.DraftRegistration);
  }
}
