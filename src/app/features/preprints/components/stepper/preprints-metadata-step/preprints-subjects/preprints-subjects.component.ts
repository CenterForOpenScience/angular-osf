import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { Message } from 'primeng/message';

import { ChangeDetectionStrategy, Component, effect, input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { SubjectsComponent } from '@osf/shared/components/subjects/subjects.component';
import { INPUT_VALIDATION_MESSAGES } from '@osf/shared/constants/input-validation-messages.const';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import {
  FetchChildrenSubjects,
  FetchSelectedSubjects,
  FetchSubjects,
  SubjectsSelectors,
  UpdateResourceSubjects,
} from '@osf/shared/stores/subjects';
import { SubjectModel } from '@shared/models/subject/subject.model';

@Component({
  selector: 'osf-preprints-subjects',
  imports: [SubjectsComponent, Card, Message, TranslatePipe],
  templateUrl: './preprints-subjects.component.html',
  styleUrl: './preprints-subjects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintsSubjectsComponent implements OnInit {
  readonly control = input.required<FormControl>();
  readonly providerId = input.required<string>();
  readonly preprintId = input.required<string>();

  readonly selectedSubjects = select(SubjectsSelectors.getSelectedSubjects);
  readonly isSubjectsUpdating = select(SubjectsSelectors.areSelectedSubjectsLoading);

  readonly actions = createDispatchMap({
    fetchSubjects: FetchSubjects,
    fetchSelectedSubjects: FetchSelectedSubjects,
    fetchChildrenSubjects: FetchChildrenSubjects,
    updateResourceSubjects: UpdateResourceSubjects,
  });

  readonly INPUT_VALIDATION_MESSAGES = INPUT_VALIDATION_MESSAGES;

  constructor() {
    effect(() => {
      this.updateControlState(this.selectedSubjects());
    });
  }

  ngOnInit(): void {
    this.actions.fetchSubjects(ResourceType.Preprint, this.providerId());
    this.actions.fetchSelectedSubjects(this.preprintId()!, ResourceType.Preprint);
  }

  getSubjectChildren(parentId: string): void {
    this.actions.fetchChildrenSubjects(parentId);
  }

  searchSubjects(search: string): void {
    this.actions.fetchSubjects(ResourceType.Preprint, this.providerId(), search);
  }

  updateSelectedSubjects(subjects: SubjectModel[]): void {
    this.updateControlState(subjects);
    this.actions.updateResourceSubjects(this.preprintId(), ResourceType.Preprint, subjects);
  }

  updateControlState(value: SubjectModel[]): void {
    const control = this.control();
    control.setValue(value);
    control.markAsTouched();
    control.markAsDirty();
    control.updateValueAndValidity();
  }
}
