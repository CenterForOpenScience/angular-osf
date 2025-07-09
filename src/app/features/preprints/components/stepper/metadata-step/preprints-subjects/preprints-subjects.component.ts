import { createDispatchMap, select } from '@ngxs/store';

import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';

import { SubmitPreprintSelectors } from '@osf/features/preprints/store/submit-preprint';
import { SubjectsComponent } from '@osf/shared/components';
import { ResourceType } from '@osf/shared/enums';
import { SubjectModel } from '@osf/shared/models';
import {
  FetchChildrenSubjects,
  FetchSelectedSubjects,
  FetchSubjects,
  SubjectsSelectors,
  UpdateResourceSubjects,
} from '@osf/shared/stores';

@Component({
  selector: 'osf-preprints-subjects',
  imports: [SubjectsComponent, Card],
  templateUrl: './preprints-subjects.component.html',
  styleUrl: './preprints-subjects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintsSubjectsComponent implements OnInit {
  preprintId = input<string>();

  private readonly selectedProviderId = select(SubmitPreprintSelectors.getSelectedProviderId);
  protected selectedSubjects = select(SubjectsSelectors.getSelectedSubjects);
  protected isSubjectsUpdating = select(SubjectsSelectors.areSelectedSubjectsLoading);

  protected actions = createDispatchMap({
    fetchSubjects: FetchSubjects,
    fetchSelectedSubjects: FetchSelectedSubjects,
    fetchChildrenSubjects: FetchChildrenSubjects,
    updateResourceSubjects: UpdateResourceSubjects,
  });

  ngOnInit(): void {
    this.actions.fetchSubjects(ResourceType.Preprint, this.selectedProviderId()!);
    this.actions.fetchSelectedSubjects(this.preprintId()!, ResourceType.Preprint);
  }

  getSubjectChildren(parentId: string) {
    this.actions.fetchChildrenSubjects(parentId);
  }

  searchSubjects(search: string) {
    this.actions.fetchSubjects(ResourceType.Preprint, this.selectedProviderId()!, search);
  }

  updateSelectedSubjects(subjects: SubjectModel[]) {
    this.actions.updateResourceSubjects(this.preprintId()!, ResourceType.Preprint, subjects);
  }
}
