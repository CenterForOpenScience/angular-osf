import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { SubjectsComponent } from '@osf/shared/components/subjects/subjects.component';
import { SubjectModel } from '@osf/shared/models/subject/subject.model';

@Component({
  selector: 'osf-metadata-subjects',
  imports: [SubjectsComponent, Card],
  templateUrl: './metadata-subjects.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataSubjectsComponent {
  selectedSubjects = input.required<SubjectModel[]>();
  isSubjectsUpdating = input.required<boolean>();
  readonly = input<boolean>(false);

  getSubjectChildren = output<string>();
  searchSubjects = output<string>();
  updateSelectedSubjects = output<SubjectModel[]>();
}
