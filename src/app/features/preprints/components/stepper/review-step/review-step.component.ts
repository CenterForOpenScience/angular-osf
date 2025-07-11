import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
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
  PreprintStepperSelectors,
  SubmitPreprint,
} from '@osf/features/preprints/store/preprint-stepper';
import { TruncatedTextComponent } from '@shared/components';
import { ResourceType } from '@shared/enums';
import { Institution } from '@shared/models';
import { InterpolatePipe } from '@shared/pipes';
import { ToastService } from '@shared/services';
import { ContributorsSelectors, FetchSelectedSubjects, GetAllContributors, SubjectsSelectors } from '@shared/stores';

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
  });
  provider = input.required<PreprintProviderDetails | undefined>();
  createdPreprint = select(PreprintStepperSelectors.getCreatedPreprint);

  contributors = select(ContributorsSelectors.getContributors);
  bibliographicContributors = computed(() => {
    return this.contributors().filter((contributor) => contributor.isBibliographic);
  });
  subjects = select(SubjectsSelectors.getSelectedSubjects);
  affiliatedInstitutions = signal<Institution[]>([]);
  license = select(PreprintStepperSelectors.getPreprintLicense);
  preprintProject = select(PreprintStepperSelectors.getPreprintProject);
  licenseOptionsRecord = computed(() => {
    return (this.createdPreprint()?.licenseOptions ?? {}) as Record<string, string>;
  });

  readonly ApplicabilityStatus = ApplicabilityStatus;
  readonly PreregLinkInfo = PreregLinkInfo;

  ngOnInit(): void {
    this.actions.getContributors(this.createdPreprint()!.id, ResourceType.Preprint);
    this.actions.fetchSubjects(this.createdPreprint()!.id, ResourceType.Preprint);
    this.actions.fetchLicenses();
    this.actions.fetchPreprintProject();
  }

  submitPreprint() {
    this.actions.submitPreprint().subscribe({
      complete: () => {
        this.toastService.showSuccess('preprints.preprintStepper.common.successMessages.preprintSubmitted');
        this.router.navigateByUrl('/preprints');
      },
    });
  }

  cancelSubmission() {
    this.router.navigateByUrl('/preprints');
  }
}
