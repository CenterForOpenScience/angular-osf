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
import { FixSpecialCharPipe } from '@osf/shared/pipes/fix-special-char.pipe';
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
    Card,
    TruncatedTextComponent,
    Tag,
    DatePipe,
    Button,
    TitleCasePipe,
    TranslatePipe,
    AffiliatedInstitutionsViewComponent,
    ContributorsListComponent,
    LicenseDisplayComponent,
    FixSpecialCharPipe,
  ],
  templateUrl: './review-step.component.html',
  styleUrl: './review-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewStepComponent implements OnInit {
  private router = inject(Router);
  private toastService = inject(ToastService);
  private actions = createDispatchMap({
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

  provider = input.required<PreprintProviderDetails | undefined>();

  preprint = select(PreprintStepperSelectors.getPreprint);
  preprintFile = select(PreprintStepperSelectors.getPreprintFile);
  isPreprintSubmitting = select(PreprintStepperSelectors.isPreprintSubmitting);

  bibliographicContributors = select(ContributorsSelectors.getBibliographicContributors);
  areContributorsLoading = select(ContributorsSelectors.isBibliographicContributorsLoading);
  hasMoreBibliographicContributors = select(ContributorsSelectors.hasMoreBibliographicContributors);
  subjects = select(SubjectsSelectors.getSelectedSubjects);
  affiliatedInstitutions = select(InstitutionsSelectors.getResourceInstitutions);
  license = select(PreprintStepperSelectors.getPreprintLicense);
  preprintProject = select(PreprintStepperSelectors.getPreprintProject);
  licenseOptionsRecord = computed(() => (this.preprint()?.licenseOptions ?? {}) as Record<string, string>);

  readonly ApplicabilityStatus = ApplicabilityStatus;
  readonly PreregLinkInfo = PreregLinkInfo;

  ngOnInit(): void {
    this.actions.getBibliographicContributors(this.preprint()?.id, ResourceType.Preprint);
    this.actions.fetchSubjects(this.preprint()!.id, ResourceType.Preprint);
    this.actions.fetchLicenses();
    this.actions.fetchPreprintProject();
    this.actions.fetchResourceInstitutions(this.preprint()!.id, ResourceType.Preprint);
  }

  submitPreprint() {
    const preprint = this.preprint()!;
    const preprintFile = this.preprintFile()!;

    this.actions
      .updatePrimaryFileRelationship(preprintFile?.id ?? preprint.primaryFileId)
      .pipe(
        switchMap(() => {
          if (!this.provider()?.reviewsWorkflow) {
            return this.actions.updatePreprint(preprint.id, { isPublished: true });
          }

          if (preprint.reviewsState !== ReviewsState.Accepted) {
            return this.actions.submitPreprint();
          }
          return of(null);
        }),
        tap(() => {
          this.toastService.showSuccess('preprints.preprintStepper.common.successMessages.preprintSubmitted');
          this.router.navigate(['/preprints', this.provider()!.id, preprint.id]);
        })
      )
      .subscribe();
  }

  cancelSubmission() {
    this.router.navigateByUrl('/preprints');
  }

  loadMoreContributors(): void {
    this.actions.loadMoreBibliographicContributors(this.preprint()?.id, ResourceType.Preprint);
  }
}
