import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SubmissionItemComponent } from '../submission-item/submission-item.component';
import { pendingReviews } from '../test-data';

@Component({
  selector: 'osf-submissions-list',
  imports: [SubmissionItemComponent],
  templateUrl: './submissions-list.component.html',
  styleUrl: './submissions-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmissionsListComponent {
  pendingSubmissions = pendingReviews;
}
