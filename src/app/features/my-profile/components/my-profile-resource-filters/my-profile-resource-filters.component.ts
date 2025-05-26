import { Store } from '@ngxs/store';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';

import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { MyProfileSelectors } from '../../store';
import {
  MyProfileDateCreatedFilterComponent,
  MyProfileFunderFilterComponent,
  MyProfileInstitutionFilterComponent,
  MyProfileLicenseFilterComponent,
  MyProfilePartOfCollectionFilterComponent,
  MyProfileProviderFilterComponent,
  MyProfileResourceTypeFilterComponent,
  MyProfileSubjectFilterComponent,
} from '../filters';
import { MyProfileResourceFiltersOptionsSelectors } from '../filters/store';

@Component({
  selector: 'osf-my-profile-resource-filters',
  imports: [
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionPanel,
    MyProfileDateCreatedFilterComponent,
    MyProfileFunderFilterComponent,
    MyProfileSubjectFilterComponent,
    MyProfileLicenseFilterComponent,
    MyProfileResourceTypeFilterComponent,
    MyProfileInstitutionFilterComponent,
    MyProfileProviderFilterComponent,
    MyProfilePartOfCollectionFilterComponent,
  ],
  templateUrl: './my-profile-resource-filters.component.html',
  styleUrl: './my-profile-resource-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProfileResourceFiltersComponent {
  readonly #store = inject(Store);

  readonly datesOptionsCount = computed(() => {
    return this.#store
      .selectSignal(MyProfileResourceFiltersOptionsSelectors.getDatesCreated)()
      .reduce((accumulator, date) => accumulator + date.count, 0);
  });

  readonly funderOptionsCount = computed(() => {
    return this.#store
      .selectSignal(MyProfileResourceFiltersOptionsSelectors.getFunders)()
      .reduce((acc, item) => acc + item.count, 0);
  });

  readonly subjectOptionsCount = computed(() => {
    return this.#store
      .selectSignal(MyProfileResourceFiltersOptionsSelectors.getSubjects)()
      .reduce((acc, item) => acc + item.count, 0);
  });

  readonly licenseOptionsCount = computed(() => {
    return this.#store
      .selectSignal(MyProfileResourceFiltersOptionsSelectors.getLicenses)()
      .reduce((acc, item) => acc + item.count, 0);
  });

  readonly resourceTypeOptionsCount = computed(() => {
    return this.#store
      .selectSignal(MyProfileResourceFiltersOptionsSelectors.getResourceTypes)()
      .reduce((acc, item) => acc + item.count, 0);
  });

  readonly institutionOptionsCount = computed(() => {
    return this.#store
      .selectSignal(MyProfileResourceFiltersOptionsSelectors.getInstitutions)()
      .reduce((acc, item) => acc + item.count, 0);
  });

  readonly providerOptionsCount = computed(() => {
    return this.#store
      .selectSignal(MyProfileResourceFiltersOptionsSelectors.getProviders)()
      .reduce((acc, item) => acc + item.count, 0);
  });

  readonly partOfCollectionOptionsCount = computed(() => {
    return this.#store
      .selectSignal(MyProfileResourceFiltersOptionsSelectors.getPartOfCollection)()
      .reduce((acc, item) => acc + item.count, 0);
  });

  readonly isMyProfilePage = this.#store.selectSignal(MyProfileSelectors.getIsMyProfile);

  readonly anyOptionsCount = computed(() => {
    return (
      this.datesOptionsCount() > 0 ||
      this.funderOptionsCount() > 0 ||
      this.subjectOptionsCount() > 0 ||
      this.licenseOptionsCount() > 0 ||
      this.resourceTypeOptionsCount() > 0 ||
      this.institutionOptionsCount() > 0 ||
      this.providerOptionsCount() > 0 ||
      this.partOfCollectionOptionsCount() > 0
    );
  });
}
