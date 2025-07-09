import { createDispatchMap, select } from '@ngxs/store';

import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';

import { ResourceType } from '@osf/shared/enums';
import { SubjectModel } from '@osf/shared/models';
import {
  FetchChildrenSubjects,
  FetchSelectedSubjects,
  FetchSubjects,
  SubjectsSelectors,
  UpdateResourceSubjects,
} from '@osf/shared/stores';
import { SubjectsComponent } from '@shared/components';

@Component({
  selector: 'osf-project-metadata-subjects',
  imports: [SubjectsComponent, Card],
  templateUrl: './project-metadata-subjects.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectMetadataSubjectsComponent implements OnInit {
  projectId = input<string>();

  protected selectedSubjects = select(SubjectsSelectors.getSelectedSubjects);
  protected isSubjectsUpdating = select(SubjectsSelectors.areSelectedSubjectsLoading);

  protected actions = createDispatchMap({
    fetchSubjects: FetchSubjects,
    fetchSelectedSubjects: FetchSelectedSubjects,
    fetchChildrenSubjects: FetchChildrenSubjects,
    updateResourceSubjects: UpdateResourceSubjects,
  });

  ngOnInit(): void {
    this.actions.fetchSubjects(ResourceType.Project);
    this.actions.fetchSelectedSubjects(this.projectId()!, ResourceType.Project);
  }

  getSubjectChildren(parentId: string) {
    this.actions.fetchChildrenSubjects(parentId);
  }

  searchSubjects(search: string) {
    this.actions.fetchSubjects(ResourceType.Project, this.projectId()!, search);
  }

  updateSelectedSubjects(subjects: SubjectModel[]) {
    this.actions.updateResourceSubjects(this.projectId()!, ResourceType.Project, subjects);
  }
}
