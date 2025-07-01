import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Submission } from '../../models';
import { SubmissionItemComponent } from '../submission-item/submission-item.component';

@Component({
  selector: 'osf-submissions-list',
  imports: [SubmissionItemComponent],
  templateUrl: './submissions-list.component.html',
  styleUrl: './submissions-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmissionsListComponent {
  submissions = input.required<Submission[]>();
}
