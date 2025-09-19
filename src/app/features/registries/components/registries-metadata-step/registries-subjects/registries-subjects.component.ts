import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { Message } from 'primeng/message';

import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { RegistriesSelectors } from '@osf/features/registries/store';
import { SubjectsComponent } from '@osf/shared/components';
import { INPUT_VALIDATION_MESSAGES } from '@osf/shared/constants';
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
  selector: 'osf-registries-subjects',
  imports: [SubjectsComponent, Card, Message, TranslatePipe],
  templateUrl: './registries-subjects.component.html',
  styleUrl: './registries-subjects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistriesSubjectsComponent {
  control = input.required<FormControl>();
  private readonly route = inject(ActivatedRoute);
  private readonly draftId = this.route.snapshot.params['id'];

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

  private isLoaded = false;

  constructor() {
    effect(() => {
      if (this.draftRegistration() && !this.isLoaded) {
        this.actions.fetchSubjects(ResourceType.Registration, this.draftRegistration()?.providerId);
        this.actions.fetchSelectedSubjects(this.draftId, ResourceType.DraftRegistration);
        this.isLoaded = true;
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
    this.actions.updateResourceSubjects(this.draftId, ResourceType.DraftRegistration, subjects);
  }

  onFocusOut() {
    if (this.control()) {
      this.control().markAsTouched();
      this.control().markAsDirty();
      this.control().updateValueAndValidity();
    }
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
