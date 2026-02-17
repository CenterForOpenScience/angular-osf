import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { Message } from 'primeng/message';

import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';
import { FormControl } from '@angular/forms';

import { RegistriesSelectors } from '@osf/features/registries/store';
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
  selector: 'osf-registries-subjects',
  imports: [SubjectsComponent, Card, Message, TranslatePipe],
  templateUrl: './registries-subjects.component.html',
  styleUrl: './registries-subjects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistriesSubjectsComponent {
  control = input.required<FormControl>();
  draftId = input.required<string>();

  selectedSubjects = select(SubjectsSelectors.getSelectedSubjects);
  isSubjectsUpdating = select(SubjectsSelectors.areSelectedSubjectsLoading);
  draftRegistration = select(RegistriesSelectors.getDraftRegistration);

  actions = createDispatchMap({
    fetchSubjects: FetchSubjects,
    fetchSelectedSubjects: FetchSelectedSubjects,
    fetchChildrenSubjects: FetchChildrenSubjects,
    updateResourceSubjects: UpdateResourceSubjects,
  });

  readonly INPUT_VALIDATION_MESSAGES = INPUT_VALIDATION_MESSAGES;

  private readonly isLoaded = signal(false);

  constructor() {
    effect(() => {
      if (this.draftRegistration() && !this.isLoaded()) {
        this.actions.fetchSubjects(ResourceType.Registration, this.draftRegistration()?.providerId);
        this.actions.fetchSelectedSubjects(this.draftId(), ResourceType.DraftRegistration);
        this.isLoaded.set(true);
      }
    });
  }

  getSubjectChildren(parentId: string) {
    this.actions.fetchChildrenSubjects(parentId);
  }

  searchSubjects(search: string) {
    this.actions.fetchSubjects(ResourceType.Registration, this.draftRegistration()?.providerId, search);
  }

  updateSelectedSubjects(subjects: SubjectModel[]) {
    this.updateControlState(subjects);
    this.actions.updateResourceSubjects(this.draftId(), ResourceType.DraftRegistration, subjects);
  }

  onFocusOut() {
    const control = this.control();
    control.markAsTouched();
    control.markAsDirty();
    control.updateValueAndValidity();
  }

  updateControlState(value: SubjectModel[]) {
    const control = this.control();
    control.setValue(value);
    control.markAsTouched();
    control.markAsDirty();
    control.updateValueAndValidity();
  }
}
