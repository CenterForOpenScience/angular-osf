import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
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
  UpdatePrimaryFileRelationship,
} from '@osf/features/preprints/store/preprint-stepper';
import {
  AffiliatedInstitutionsViewComponent,
  ContributorsListComponent,
  TruncatedTextComponent,
} from '@shared/components';
import { ResourceType } from '@shared/enums';
import { InterpolatePipe } from '@shared/pipes';
import { ToastService } from '@shared/services';
import { ContributorsSelectors, FetchSelectedSubjects, GetAllContributors, SubjectsSelectors } from '@shared/stores';
import { FetchResourceInstitutions, InstitutionsSelectors } from '@shared/stores/institutions';

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
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionPanel,
    InterpolatePipe,
    AffiliatedInstitutionsViewComponent,
    ContributorsListComponent,
  ],
  templateUrl: './review-step.component.html',
  styleUrl: './review-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewStepComponent implements OnInit {
  private router = inject(Router);
  private toastService = inject(ToastService);
  private actions = createDispatchMap({
    getContributors: GetAllContributors,
    fetchSubjects: FetchSelectedSubjects,
    fetchLicenses: FetchLicenses,
    fetchPreprintProject: FetchPreprintProject,
    submitPreprint: SubmitPreprint,
    fetchResourceInstitutions: FetchResourceInstitutions,
    updatePrimaryFileRelationship: UpdatePrimaryFileRelationship,
  });

  provider = input.required<PreprintProviderDetails | undefined>();

  preprint = select(PreprintStepperSelectors.getPreprint);
  preprintFile = select(PreprintStepperSelectors.getPreprintFile);
  isPreprintSubmitting = select(PreprintStepperSelectors.isPreprintSubmitting);

  contributors = select(ContributorsSelectors.getContributors);
  bibliographicContributors = computed(() => this.contributors().filter((contributor) => contributor.isBibliographic));
  subjects = select(SubjectsSelectors.getSelectedSubjects);
  affiliatedInstitutions = select(InstitutionsSelectors.getResourceInstitutions);
  license = select(PreprintStepperSelectors.getPreprintLicense);
  preprintProject = select(PreprintStepperSelectors.getPreprintProject);
  licenseOptionsRecord = computed(() => (this.preprint()?.licenseOptions ?? {}) as Record<string, string>);

  readonly ApplicabilityStatus = ApplicabilityStatus;
  readonly PreregLinkInfo = PreregLinkInfo;

  ngOnInit(): void {
    this.actions.getContributors(this.preprint()!.id, ResourceType.Preprint);
    this.actions.fetchSubjects(this.preprint()!.id, ResourceType.Preprint);
    this.actions.fetchLicenses();
    this.actions.fetchPreprintProject();
    this.actions.fetchResourceInstitutions(this.preprint()!.id, ResourceType.Preprint);
  }

  submitPreprint() {
    const preprint = this.preprint()!;
    const preprintFile = this.preprintFile()!;

    this.actions
      .updatePrimaryFileRelationship(preprintFile.id ?? preprint.primaryFileId)
      .pipe(
        switchMap(() => {
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
}
