import { Store } from '@ngxs/store';

import { Select, SelectChangeEvent } from 'primeng/select';

import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  PreprintsResourcesFiltersSelectors,
  SetSubject,
} from '@osf/features/preprints/store/preprints-resources-filters';
import {
  GetAllOptions,
  PreprintsResourcesFiltersOptionsSelectors,
} from '@osf/features/preprints/store/preprints-resources-filters-options';

@Component({
  selector: 'osf-preprints-subject-filter',
  imports: [Select, FormsModule],
  templateUrl: './preprints-subject-filter.component.html',
  styleUrl: './preprints-subject-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintsSubjectFilterComponent {
  readonly #store = inject(Store);

  protected availableSubjects = this.#store.selectSignal(PreprintsResourcesFiltersOptionsSelectors.getSubjects);
  protected subjectState = this.#store.selectSignal(PreprintsResourcesFiltersSelectors.getSubject);
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
