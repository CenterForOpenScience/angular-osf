import { Store } from '@ngxs/store';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';

import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { ProfileResourceFiltersOptionsSelectors } from '@osf/features/profile/components/filters/store';
import { ProfileSelectors } from '@osf/features/profile/store';

import { ProfileDateCreatedFilterComponent } from '../filters/profile-date-created-filter/profile-date-created-filter.component';
import { ProfileFunderFilterComponent } from '../filters/profile-funder-filter/profile-funder-filter.component';
import { ProfileInstitutionFilterComponent } from '../filters/profile-institution-filter/profile-institution-filter.component';
import { ProfileLicenseFilterComponent } from '../filters/profile-license-filter/profile-license-filter.component';
import { ProfilePartOfCollectionFilterComponent } from '../filters/profile-part-of-collection-filter/profile-part-of-collection-filter.component';
import { ProfileProviderFilterComponent } from '../filters/profile-provider-filter/profile-provider-filter.component';
import { ProfileResourceTypeFilterComponent } from '../filters/profile-resource-type-filter/profile-resource-type-filter.component';
import { ProfileSubjectFilterComponent } from '../filters/profile-subject-filter/profile-subject-filter.component';

@Component({
  selector: 'osf-profile-resource-filters',
  imports: [
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionPanel,
    ProfileDateCreatedFilterComponent,
    ProfileFunderFilterComponent,
    ProfileSubjectFilterComponent,
    ProfileLicenseFilterComponent,
    ProfileResourceTypeFilterComponent,
    ProfileInstitutionFilterComponent,
    ProfileProviderFilterComponent,
    ProfilePartOfCollectionFilterComponent,
  ],
  templateUrl: './profile-resource-filters.component.html',
  styleUrl: './profile-resource-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileResourceFiltersComponent {
  readonly store = inject(Store);

  readonly datesOptionsCount = computed(() => {
    return this.store
      .selectSignal(ProfileResourceFiltersOptionsSelectors.getDatesCreated)()
      .reduce((accumulator, date) => accumulator + date.count, 0);
  });

  readonly funderOptionsCount = computed(() => {
    return this.store
      .selectSignal(ProfileResourceFiltersOptionsSelectors.getFunders)()
      .reduce((acc, item) => acc + item.count, 0);
  });

  readonly subjectOptionsCount = computed(() => {
    return this.store
      .selectSignal(ProfileResourceFiltersOptionsSelectors.getSubjects)()
      .reduce((acc, item) => acc + item.count, 0);
  });

  readonly licenseOptionsCount = computed(() => {
    return this.store
      .selectSignal(ProfileResourceFiltersOptionsSelectors.getLicenses)()
      .reduce((acc, item) => acc + item.count, 0);
  });

  readonly resourceTypeOptionsCount = computed(() => {
    return this.store
      .selectSignal(ProfileResourceFiltersOptionsSelectors.getResourceTypes)()
      .reduce((acc, item) => acc + item.count, 0);
  });

  readonly institutionOptionsCount = computed(() => {
    return this.store
      .selectSignal(ProfileResourceFiltersOptionsSelectors.getInstitutions)()
      .reduce((acc, item) => acc + item.count, 0);
  });

  readonly providerOptionsCount = computed(() => {
    return this.store
      .selectSignal(ProfileResourceFiltersOptionsSelectors.getProviders)()
      .reduce((acc, item) => acc + item.count, 0);
  });

  readonly partOfCollectionOptionsCount = computed(() => {
    return this.store
      .selectSignal(ProfileResourceFiltersOptionsSelectors.getPartOfCollection)()
      .reduce((acc, item) => acc + item.count, 0);
  });

  readonly isMyProfilePage = this.store.selectSignal(ProfileSelectors.getIsMyProfile);

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
