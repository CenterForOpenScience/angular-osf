import { Store } from '@ngxs/store';

import { Select, SelectChangeEvent } from 'primeng/select';

import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { GetAllOptions, ProfileResourceFiltersOptionsSelectors } from '@osf/features/profile/components/filters/store';

import { ProfileResourceFiltersSelectors, SetSubject } from '../../profile-resource-filters/store';

@Component({
  selector: 'osf-profile-subject-filter',
  imports: [Select, FormsModule],
  templateUrl: './profile-subject-filter.component.html',
  styleUrl: './profile-subject-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSubjectFilterComponent {
  readonly #store = inject(Store);

  protected availableSubjects = this.#store.selectSignal(ProfileResourceFiltersOptionsSelectors.getSubjects);
  protected subjectState = this.#store.selectSignal(ProfileResourceFiltersSelectors.getSubject);
  protected inputText = signal<string | null>(null);
  protected subjectsOptions = computed(() => {
    if (this.inputText() !== null) {
      const search = this.inputText()!.toLowerCase();
      return this.availableSubjects()
        .filter((subject) => subject.label.toLowerCase().includes(search))
        .map((subject) => ({
          labelCount: subject.label + ' (' + subject.count + ')',
          label: subject.label,
          id: subject.id,
        }));
    }

    return this.availableSubjects().map((subject) => ({
      labelCount: subject.label + ' (' + subject.count + ')',
      label: subject.label,
      id: subject.id,
    }));
  });

  loading = signal<boolean>(false);

  constructor() {
    effect(() => {
      const storeValue = this.subjectState().label;
      const currentInput = untracked(() => this.inputText());

      if (!storeValue && currentInput !== null) {
        this.inputText.set(null);
      } else if (storeValue && currentInput !== storeValue) {
        this.inputText.set(storeValue);
      }
    });
  }

  setSubject(event: SelectChangeEvent): void {
    if ((event.originalEvent as PointerEvent).pointerId && event.value) {
      const subject = this.subjectsOptions().find((p) => p.label.includes(event.value));
      if (subject) {
        this.#store.dispatch(new SetSubject(subject.label, subject.id));
        this.#store.dispatch(GetAllOptions);
      }
    } else {
      this.#store.dispatch(new SetSubject('', ''));
      this.#store.dispatch(GetAllOptions);
    }
  }
}
