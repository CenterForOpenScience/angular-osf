import { TranslatePipe } from '@ngx-translate/core';

import { Skeleton } from 'primeng/skeleton';
import { Tag } from 'primeng/tag';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { SubjectModel } from '@osf/shared/models/subject/subject.model';

@Component({
  selector: 'osf-subjects-list',
  imports: [Tag, Skeleton, TranslatePipe],
  templateUrl: './subjects-list.component.html',
  styleUrl: './subjects-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubjectsListComponent {
  subjects = input<SubjectModel[]>([]);
  isLoading = input<boolean>(false);
}
