import { Store } from '@ngxs/store';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';

import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { CreatorsFilterComponent } from '@osf/features/search/components/resources/components/resource-filters/components/filters/creators/creators-filter.component';
import { DateCreatedFilterComponent } from '@osf/features/search/components/resources/components/resource-filters/components/filters/date-created/date-created-filter.component';
import { FunderFilterComponent } from '@osf/features/search/components/resources/components/resource-filters/components/filters/funder/funder-filter.component';
import { InstitutionFilterComponent } from '@osf/features/search/components/resources/components/resource-filters/components/filters/institution-filter/institution-filter.component';
import { LicenseFilterComponent } from '@osf/features/search/components/resources/components/resource-filters/components/filters/license-filter/license-filter.component';
import { PartOfCollectionFilterComponent } from '@osf/features/search/components/resources/components/resource-filters/components/filters/part-of-collection-filter/part-of-collection-filter.component';
import { ProviderFilterComponent } from '@osf/features/search/components/resources/components/resource-filters/components/filters/provider-filter/provider-filter.component';
import { ResourceTypeFilterComponent } from '@osf/features/search/components/resources/components/resource-filters/components/filters/resource-type-filter/resource-type-filter.component';
import { ResourceFiltersOptionsSelectors } from '@osf/features/search/components/resources/components/resource-filters/components/filters/store/resource-filters-options.selectors';
import { SubjectFilterComponent } from '@osf/features/search/components/resources/components/resource-filters/components/filters/subject/subject-filter.component';
import { SearchSelectors } from '@osf/features/search/store';

@Component({
  selector: 'osf-resource-filters',
  imports: [
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionPanel,
    AutoCompleteModule,
    ReactiveFormsModule,
    CreatorsFilterComponent,
    DateCreatedFilterComponent,
    SubjectFilterComponent,
    FunderFilterComponent,
    LicenseFilterComponent,
    ResourceTypeFilterComponent,
    ProviderFilterComponent,
    PartOfCollectionFilterComponent,
    InstitutionFilterComponent,
  ],
  templateUrl: './resource-filters.component.html',
  styleUrl: './resource-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceFiltersComponent {
  readonly #store = inject(Store);

  readonly datesOptionsCount = computed(() => {
    return this.#store
      .selectSignal(ResourceFiltersOptionsSelectors.getDatesCreated)()
      .reduce((accumulator, date) => accumulator + date.count, 0);
  });

  readonly funderOptionsCount = computed(() =>
    this.#store
      .selectSignal(ResourceFiltersOptionsSelectors.getFunders)()
      .reduce((acc, item) => acc + item.count, 0)
  );

  readonly subjectOptionsCount = computed(() =>
    this.#store
      .selectSignal(ResourceFiltersOptionsSelectors.getSubjects)()
      .reduce((acc, item) => acc + item.count, 0)
  );

  readonly licenseOptionsCount = computed(() =>
    this.#store
      .selectSignal(ResourceFiltersOptionsSelectors.getLicenses)()
      .reduce((acc, item) => acc + item.count, 0)
  );

  readonly resourceTypeOptionsCount = computed(() =>
    this.#store
      .selectSignal(ResourceFiltersOptionsSelectors.getResourceTypes)()
      .reduce((acc, item) => acc + item.count, 0)
  );

  readonly institutionOptionsCount = computed(() =>
    this.#store
      .selectSignal(ResourceFiltersOptionsSelectors.getInstitutions)()
      .reduce((acc, item) => acc + item.count, 0)
  );

  readonly providerOptionsCount = computed(() =>
    this.#store
      .selectSignal(ResourceFiltersOptionsSelectors.getProviders)()
      .reduce((acc, item) => acc + item.count, 0)
  );

  readonly partOfCollectionOptionsCount = computed(() =>
    this.#store
      .selectSignal(ResourceFiltersOptionsSelectors.getPartOfCollection)()
      .reduce((acc, item) => acc + item.count, 0)
  );

  readonly isMyProfilePage = this.#store.selectSignal(SearchSelectors.getIsMyProfile);

  readonly anyOptionsCount = computed(() => {
    return (
      this.datesOptionsCount() > 0 ||
      this.funderOptionsCount() > 0 ||
      this.subjectOptionsCount() > 0 ||
      this.licenseOptionsCount() > 0 ||
      this.resourceTypeOptionsCount() > 0 ||
      this.institutionOptionsCount() > 0 ||
      this.providerOptionsCount() > 0 ||
      this.partOfCollectionOptionsCount() > 0 ||
      !this.isMyProfilePage()
    );
  });
}
