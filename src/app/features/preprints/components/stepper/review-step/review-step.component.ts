import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';

import { of, switchMap, tap } from 'rxjs';

import { DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApplicabilityStatus, PreregLinkInfo, ReviewsState } from '@osf/features/preprints/enums';
import { PreprintProviderDetails } from '@osf/features/preprints/models';
import {
  FetchLicenses,
  FetchPreprintProject,
  PreprintStepperSelectors,
  SubmitPreprint,
  UpdatePreprint,
  UpdatePrimaryFileRelationship,
} from '@osf/features/preprints/store/preprint-stepper';
import { AffiliatedInstitutionsViewComponent } from '@osf/shared/components/affiliated-institutions-view/affiliated-institutions-view.component';
import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { LicenseDisplayComponent } from '@osf/shared/components/license-display/license-display.component';
import { TruncatedTextComponent } from '@osf/shared/components/truncated-text/truncated-text.component';
import { ToastService } from '@osf/shared/services/toast.service';
import { ResourceType } from '@shared/enums/resource-type.enum';
import {
  ContributorsSelectors,
  GetBibliographicContributors,
  LoadMoreBibliographicContributors,
} from '@shared/stores/contributors';
import { FetchResourceInstitutions, InstitutionsSelectors } from '@shared/stores/institutions';
import { FetchSelectedSubjects, SubjectsSelectors } from '@shared/stores/subjects';

@Component({
  selector: 'osf-review-step',
  imports: [
    Button,
    Card,
    Tag,
    AffiliatedInstitutionsViewComponent,
    ContributorsListComponent,
    LicenseDisplayComponent,
    TruncatedTextComponent,
    DatePipe,
    TitleCasePipe,
    TranslatePipe,
  ],
  templateUrl: './review-step.component.html',
  styleUrl: './review-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewStepComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  readonly provider = input.required<PreprintProviderDetails>();

  private readonly actions = createDispatchMap({
    getBibliographicContributors: GetBibliographicContributors,
    fetchSubjects: FetchSelectedSubjects,
    fetchLicenses: FetchLicenses,
    fetchPreprintProject: FetchPreprintProject,
    submitPreprint: SubmitPreprint,
    fetchResourceInstitutions: FetchResourceInstitutions,
    updatePrimaryFileRelationship: UpdatePrimaryFileRelationship,
    updatePreprint: UpdatePreprint,
    loadMoreBibliographicContributors: LoadMoreBibliographicContributors,
  });

  readonly preprint = select(PreprintStepperSelectors.getPreprint);
  readonly preprintFile = select(PreprintStepperSelectors.getPreprintFile);
  readonly isPreprintSubmitting = select(PreprintStepperSelectors.isPreprintSubmitting);

  readonly bibliographicContributors = select(ContributorsSelectors.getBibliographicContributors);
  readonly areContributorsLoading = select(ContributorsSelectors.isBibliographicContributorsLoading);
  readonly hasMoreBibliographicContributors = select(ContributorsSelectors.hasMoreBibliographicContributors);
  readonly subjects = select(SubjectsSelectors.getSelectedSubjects);
  readonly affiliatedInstitutions = select(InstitutionsSelectors.getResourceInstitutions);
  readonly license = select(PreprintStepperSelectors.getPreprintLicense);
  readonly preprintProject = select(PreprintStepperSelectors.getPreprintProject);
  readonly licenseOptionsRecord = computed(() => (this.preprint()?.licenseOptions ?? {}) as Record<string, string>);

  readonly ApplicabilityStatus = ApplicabilityStatus;
  readonly PreregLinkInfo = PreregLinkInfo;

  ngOnInit(): void {
    this.actions.fetchLicenses(this.provider().id);
    this.actions.fetchPreprintProject();

    const preprintId = this.preprint()?.id;
    if (!preprintId) {
      return;
    }

    this.actions.getBibliographicContributors(preprintId, ResourceType.Preprint);
    this.actions.fetchSubjects(preprintId, ResourceType.Preprint);
    this.actions.fetchResourceInstitutions(preprintId, ResourceType.Preprint);
  }

  submitPreprint(): void {
    const preprint = this.preprint();
    const provider = this.provider();

    if (!preprint) {
      return;
    }

    const preprintFileId = this.preprintFile()?.id ?? preprint.primaryFileId;

    if (!preprintFileId) {
      return;
    }

    this.actions
      .updatePrimaryFileRelationship(preprintFileId)
      .pipe(
        switchMap(() => {
          if (!provider.reviewsWorkflow) {
            return this.actions.updatePreprint(preprint.id, { isPublished: true });
          }

          if (preprint.reviewsState !== ReviewsState.Accepted) {
            return this.actions.submitPreprint();
          }
          return of(null);
        }),
        tap(() => {
          this.toastService.showSuccess('preprints.preprintStepper.common.successMessages.preprintSubmitted');
          this.router.navigate(['/preprints', provider.id, preprint.id]);
        })
      )
      .subscribe();
  }

  cancelSubmission(): void {
    this.router.navigateByUrl('/preprints');
  }

  loadMoreContributors(): void {
    this.actions.loadMoreBibliographicContributors(this.preprint()?.id, ResourceType.Preprint);
  }
}
