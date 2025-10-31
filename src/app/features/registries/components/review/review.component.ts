import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Message } from 'primeng/message';
import { Tag } from 'primeng/tag';

import { map, of } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, effect, inject, OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { LicenseDisplayComponent } from '@osf/shared/components/license-display/license-display.component';
import { RegistrationBlocksDataComponent } from '@osf/shared/components/registration-blocks-data/registration-blocks-data.component';
import { INPUT_VALIDATION_MESSAGES } from '@osf/shared/constants/input-validation-messages.const';
import { FieldType } from '@osf/shared/enums/field-type.enum';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';
import { FixSpecialCharPipe } from '@osf/shared/pipes/fix-special-char.pipe';
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

import {
  ClearState,
  DeleteDraft,
  FetchLicenses,
  FetchProjectChildren,
  RegistriesSelectors,
  UpdateStepState,
} from '../../store';
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
    FixSpecialCharPipe,
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
  private readonly environment = inject(ENVIRONMENT);

  readonly pages = select(RegistriesSelectors.getPagesSchema);
  readonly draftRegistration = select(RegistriesSelectors.getDraftRegistration);
  readonly isDraftSubmitting = select(RegistriesSelectors.isDraftSubmitting);
  readonly isDraftLoading = select(RegistriesSelectors.isDraftLoading);
  readonly stepsData = select(RegistriesSelectors.getStepsData);
  readonly INPUT_VALIDATION_MESSAGES = INPUT_VALIDATION_MESSAGES;
  readonly contributors = select(ContributorsSelectors.getContributors);
  readonly areContributorsLoading = select(ContributorsSelectors.isContributorsLoading);
  readonly hasMoreContributors = select(ContributorsSelectors.hasMoreContributors);
  readonly subjects = select(SubjectsSelectors.getSelectedSubjects);
  readonly components = select(RegistriesSelectors.getRegistrationComponents);
  readonly license = select(RegistriesSelectors.getRegistrationLicense);
  readonly newRegistration = select(RegistriesSelectors.getRegistration);

  readonly FieldType = FieldType;

  actions = createDispatchMap({
    getContributors: GetAllContributors,
    getSubjects: FetchSelectedSubjects,
    deleteDraft: DeleteDraft,
    clearState: ClearState,
    getProjectsComponents: FetchProjectChildren,
    fetchLicenses: FetchLicenses,
    updateStepState: UpdateStepState,
    loadMoreContributors: LoadMoreContributors,
    resetContributorsState: ResetContributorsState,
  });

  private readonly draftId = toSignal(this.route.params.pipe(map((params) => params['id'])) ?? of(undefined));

  stepsState = select(RegistriesSelectors.getStepsState);

  isDraftInvalid = computed(() => Object.values(this.stepsState()).some((step) => step.invalid));

  licenseOptionsRecord = computed(() => (this.draftRegistration()?.license.options ?? {}) as Record<string, string>);

  hasAdminAccess = computed(() => {
    const registry = this.draftRegistration();
    if (!registry) return false;
    return registry.currentUserPermissions.includes(UserPermissions.Admin);
  });

  registerButtonDisabled = computed(() => this.isDraftLoading() || this.isDraftInvalid() || !this.hasAdminAccess());

  constructor() {
    if (!this.contributors()?.length) {
      this.actions.getContributors(this.draftId(), ResourceType.DraftRegistration);
    }
    if (!this.subjects()?.length) {
      this.actions.getSubjects(this.draftId(), ResourceType.DraftRegistration);
    }

    effect(() => {
      if (this.draftRegistration()) {
        this.actions.fetchLicenses(this.draftRegistration()?.providerId ?? this.environment.defaultProvider);
      }
    });

    let componentsLoaded = false;
    effect(() => {
      if (!this.isDraftSubmitting()) {
        const draftRegistrations = this.draftRegistration();
        if (draftRegistrations?.hasProject) {
          if (!componentsLoaded) {
            this.actions.getProjectsComponents(draftRegistrations?.branchedFrom?.id ?? '');
            componentsLoaded = true;
          }
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
        this.actions.deleteDraft(this.draftId()).subscribe({
          next: () => {
            this.actions.clearState();
            this.router.navigateByUrl(`/registries/${providerId}/new`);
          },
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
      .onClose.subscribe((selectedComponents) => {
        if (selectedComponents) {
          this.openConfirmRegistrationDialog(selectedComponents);
        }
      });
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
      .onClose.subscribe((res) => {
        if (res) {
          this.toastService.showSuccess('registries.review.confirmation.successMessage');
          this.router.navigate([`/${this.newRegistration()?.id}/overview`]);
        } else {
          if (this.components()?.length) {
            this.openSelectComponentsForRegistrationDialog();
          }
        }
      });
  }

  loadMoreContributors(): void {
    this.actions.loadMoreContributors(this.draftId(), ResourceType.DraftRegistration);
  }
}
