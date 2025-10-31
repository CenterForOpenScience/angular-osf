import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ProjectOverviewComponent } from '@osf/features/project/overview/project-overview.component';
import { Mode } from '@osf/shared/enums/mode.enum';

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

  readonly isModerationMode = computed(() => {
    const mode = this.route.snapshot.queryParams['mode'];

    return mode === Mode.Moderation;
  });

  constructor() {
    effect(() => {
      if (!this.isModerationMode()) {
        this.router.navigate(['../'], { relativeTo: this.activatedRoute });
      }
    });
  }
}
