import { createDispatchMap, select } from '@ngxs/store';

import { ChangeDetectionStrategy, Component, effect, input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import {
  FetchPreprintsSubjects,
  SubmitPreprintSelectors,
  UpdatePreprintsSubjects,
} from '@osf/features/preprints/store/submit-preprint';
import { SubjectsComponent } from '@osf/shared/components';
import { Subject } from '@osf/shared/models';
import { FetchChildrenSubjects, FetchSubjects } from '@osf/shared/stores';

@Component({
  selector: 'osf-preprints-subjects',
  imports: [SubjectsComponent],
  templateUrl: './preprints-subjects.component.html',
  styleUrl: './preprints-subjects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintsSubjectsComponent implements OnInit {
  private readonly selectedProviderId = select(SubmitPreprintSelectors.getSelectedProviderId);
  protected selectedSubjects = select(SubmitPreprintSelectors.getSelectedSubjects);
  protected isSubjectsUpdating = select(SubmitPreprintSelectors.isSubjectsUpdating);
  protected control = input.required<FormControl>();

  protected actions = createDispatchMap({
    fetchSubjects: FetchSubjects,
    fetchPreprintsSubjects: FetchPreprintsSubjects,
    fetchChildrenSubjects: FetchChildrenSubjects,
    updatePreprintsSubjects: UpdatePreprintsSubjects,
  });

  constructor() {
    effect(() => {
      this.updateControlState(this.selectedSubjects());
    });
  }

  ngOnInit(): void {
    this.actions.fetchSubjects(this.selectedProviderId()!);
    this.actions.fetchPreprintsSubjects();
  }

  getSubjectChildren(parentId: string) {
    this.actions.fetchChildrenSubjects(parentId);
  }

  searchSubjects(search: string) {
    this.actions.fetchSubjects(search);
  }

  updateSelectedSubjects(subjects: Subject[]) {
    this.updateControlState(subjects);
    this.actions.updatePreprintsSubjects(subjects);
  }

  updateControlState(value: Subject[]) {
    if (this.control()) {
      this.control().setValue(value);
      this.control().markAsTouched();
      this.control().markAsDirty();
      this.control().updateValueAndValidity();
    }
  }
}
