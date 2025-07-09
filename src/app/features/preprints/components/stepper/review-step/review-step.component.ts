import { createDispatchMap, select } from '@ngxs/store';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';

import { DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

import { ApplicabilityStatus, PreregLinkInfo } from '@osf/features/preprints/enums';
import { PreprintProviderDetails } from '@osf/features/preprints/models';
import {
  FetchLicenses,
  FetchPreprintProject,
  FetchPreprintsSubjects,
  SubmitPreprint,
  SubmitPreprintSelectors,
} from '@osf/features/preprints/store/submit-preprint';
import { TruncatedTextComponent } from '@shared/components';
import { ResourceType } from '@shared/enums';
import { Institution } from '@shared/models';
import { ToastService } from '@shared/services';
import { ContributorsSelectors, GetAllContributors } from '@shared/stores';

@Component({
  selector: 'osf-review-step',
  imports: [Card, TruncatedTextComponent, Tag, DatePipe, Button, TitleCasePipe],
  templateUrl: './review-step.component.html',
  styleUrl: './review-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewStepComponent implements OnInit {
  private router = inject(Router);
  private toastService = inject(ToastService);
  private actions = createDispatchMap({
    getContributors: GetAllContributors,
    fetchSubjects: FetchPreprintsSubjects,
    fetchLicenses: FetchLicenses,
    fetchPreprintProject: FetchPreprintProject,
    submitPreprint: SubmitPreprint,
  });
  provider = input.required<PreprintProviderDetails | undefined>();
  createdPreprint = select(SubmitPreprintSelectors.getCreatedPreprint);

  contributors = select(ContributorsSelectors.getContributors);
  bibliographicContributors = computed(() => {
    return this.contributors().filter((contributor) => contributor.isBibliographic);
  });
  subjects = select(SubmitPreprintSelectors.getSelectedSubjects);
  affiliatedInstitutions = signal<Institution[]>([]);
  license = select(SubmitPreprintSelectors.getPreprintLicense);
  preprintProject = select(SubmitPreprintSelectors.getPreprintProject);

  readonly ApplicabilityStatus = ApplicabilityStatus;
  readonly PreregLinkInfo = PreregLinkInfo;

  ngOnInit(): void {
    this.actions.getContributors(this.createdPreprint()!.id, ResourceType.Preprint);
    this.actions.fetchSubjects();
    this.actions.fetchLicenses();
    this.actions.fetchPreprintProject();
  }

  submitPreprint() {
    this.actions.submitPreprint().subscribe({
      complete: () => {
        this.toastService.showSuccess('Preprint submitted');
        this.router.navigateByUrl('/preprints');
      },
    });
  }

  cancelSubmission() {
    this.router.navigateByUrl('/preprints');
  }
}
