import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { Message } from 'primeng/message';

import { ChangeDetectionStrategy, Component, effect, input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { PreprintStepperSelectors } from '@osf/features/preprints/store/preprint-stepper';
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
import { INPUT_VALIDATION_MESSAGES } from '@shared/constants';

@Component({
  selector: 'osf-preprints-subjects',
  imports: [SubjectsComponent, Card, Message, TranslatePipe],
  templateUrl: './preprints-subjects.component.html',
  styleUrl: './preprints-subjects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintsSubjectsComponent implements OnInit {
  preprintId = input<string>();

  private readonly selectedProviderId = select(PreprintStepperSelectors.getSelectedProviderId);
  protected selectedSubjects = select(SubjectsSelectors.getSelectedSubjects);
  protected isSubjectsUpdating = select(SubjectsSelectors.areSelectedSubjectsLoading);
  control = input.required<FormControl>();

  protected readonly INPUT_VALIDATION_MESSAGES = INPUT_VALIDATION_MESSAGES;
  protected actions = createDispatchMap({
    fetchSubjects: FetchSubjects,
    fetchSelectedSubjects: FetchSelectedSubjects,
    fetchChildrenSubjects: FetchChildrenSubjects,
    updateResourceSubjects: UpdateResourceSubjects,
  });

  constructor() {
    effect(() => {
      this.updateControlState(this.selectedSubjects());
    });
  }

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
    this.updateControlState(subjects);

    this.actions.updateResourceSubjects(this.preprintId()!, ResourceType.Preprint, subjects);
  }

  updateControlState(value: SubjectModel[]) {
    if (this.control()) {
      this.control().setValue(value);
      this.control().markAsTouched();
      this.control().markAsDirty();
      this.control().updateValueAndValidity();
    }
  }
}
