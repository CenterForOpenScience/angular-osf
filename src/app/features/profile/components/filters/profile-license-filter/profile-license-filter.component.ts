import { Store } from '@ngxs/store';

import { Select, SelectChangeEvent } from 'primeng/select';

import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { GetAllOptions, ProfileResourceFiltersOptionsSelectors } from '@osf/features/profile/components/filters/store';

import { ProfileResourceFiltersSelectors, SetLicense } from '../../profile-resource-filters/store';

@Component({
  selector: 'osf-profile-license-filter',
  imports: [Select, FormsModule],
  templateUrl: './profile-license-filter.component.html',
  styleUrl: './profile-license-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileLicenseFilterComponent {
  readonly #store = inject(Store);

  protected availableLicenses = this.#store.selectSignal(ProfileResourceFiltersOptionsSelectors.getLicenses);
  protected licenseState = this.#store.selectSignal(ProfileResourceFiltersSelectors.getLicense);
  protected inputText = signal<string | null>(null);
  protected licensesOptions = computed(() => {
    if (this.inputText() !== null) {
      const search = this.inputText()!.toLowerCase();
      return this.availableLicenses()
        .filter((license) => license.label.toLowerCase().includes(search))
        .map((license) => ({
          labelCount: license.label + ' (' + license.count + ')',
          label: license.label,
          id: license.id,
        }));
    }

    return this.availableLicenses().map((license) => ({
      labelCount: license.label + ' (' + license.count + ')',
      label: license.label,
      id: license.id,
    }));
  });

  loading = signal<boolean>(false);

  constructor() {
    effect(() => {
      const storeValue = this.licenseState().label;
      const currentInput = untracked(() => this.inputText());

      if (!storeValue && currentInput !== null) {
        this.inputText.set(null);
      } else if (storeValue && currentInput !== storeValue) {
        this.inputText.set(storeValue);
      }
    });
  }

  setLicenses(event: SelectChangeEvent): void {
    if ((event.originalEvent as PointerEvent).pointerId && event.value) {
      const license = this.licensesOptions().find((license) => license.label.includes(event.value));
      if (license) {
        this.#store.dispatch(new SetLicense(license.label, license.id));
        this.#store.dispatch(GetAllOptions);
      }
    } else {
      this.#store.dispatch(new SetLicense('', ''));
      this.#store.dispatch(GetAllOptions);
    }
  }
}
