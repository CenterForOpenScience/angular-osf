import { createDispatchMap, select } from '@ngxs/store';

import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ProjectOverviewComponent } from '@osf/features/project/overview/project-overview.component';
import { CollectionSubmission } from '@shared/models';

import { CollectionsModerationSelectors, SetCurrentSubmission } from '../../store/collections-moderation';

@Component({
  selector: 'osf-collection-submission-overview',
  imports: [ProjectOverviewComponent],
  templateUrl: './collection-submission-overview.component.html',
  styleUrl: './collection-submission-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionSubmissionOverviewComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  protected submissions = select(CollectionsModerationSelectors.getCollectionSubmissions);

  protected actions = createDispatchMap({
    setCurrentSubmission: SetCurrentSubmission,
  });

  constructor() {
    effect(() => {
      const submissions = this.submissions();
      if (!submissions.length) {
        this.router.navigate(['../'], { relativeTo: this.activatedRoute });
      }
    });

    effect(() => {
      const submissionId = this.route.snapshot.params['id'];
      const submissions = this.submissions();

      if (!submissionId || !submissions) return;

      const currentSubmission = submissions.find(
        (submission: CollectionSubmission) => submission.nodeId === submissionId
      );

      if (currentSubmission) {
        this.actions.setCurrentSubmission(currentSubmission);
      }
    });
  }
}
