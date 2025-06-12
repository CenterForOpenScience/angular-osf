import { select } from '@ngxs/store';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';

import { ChangeDetectionStrategy, Component, computed } from '@angular/core';

import { PreprintsDateCreatedFilterComponent } from '@osf/features/preprints/components';
import { PreprintsCreatorsFilterComponent } from '@osf/features/preprints/components/filters/preprints-creators/preprints-creators-filter.component';
import { PreprintsInstitutionFilterComponent } from '@osf/features/preprints/components/filters/preprints-institution-filter/preprints-institution-filter.component';
import { PreprintsLicenseFilterComponent } from '@osf/features/preprints/components/filters/preprints-license-filter/preprints-license-filter.component';
import { PreprintsSubjectFilterComponent } from '@osf/features/preprints/components/filters/preprints-subject/preprints-subject-filter.component';
import { PreprintsResourcesFiltersOptionsSelectors } from '@osf/features/preprints/store/preprints-resources-filters-options';

@Component({
  selector: 'osf-preprints-resources-filters',
  imports: [
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
    PreprintsDateCreatedFilterComponent,
    PreprintsCreatorsFilterComponent,
    PreprintsSubjectFilterComponent,
    PreprintsInstitutionFilterComponent,
    PreprintsLicenseFilterComponent,
  ],
  templateUrl: './preprints-resources-filters.component.html',
  styleUrl: './preprints-resources-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintsResourcesFiltersComponent {
  datesCreated = select(PreprintsResourcesFiltersOptionsSelectors.getDatesCreated);
  datesOptionsCount = computed(() => {
    if (!this.datesCreated()) {
      return 0;
    }

    return this.datesCreated().reduce((acc, date) => acc + date.count, 0);
  });

  subjectOptions = select(PreprintsResourcesFiltersOptionsSelectors.getSubjects);
  subjectOptionsCount = computed(() => {
    if (!this.subjectOptions()) {
      return 0;
    }

    return this.subjectOptions().reduce((acc, item) => acc + item.count, 0);
  });

  institutionOptions = select(PreprintsResourcesFiltersOptionsSelectors.getInstitutions);
  institutionOptionsCount = computed(() => {
    if (!this.institutionOptions()) {
      return 0;
    }

    return this.institutionOptions().reduce((acc, item) => acc + item.count, 0);
  });

  licenseOptions = select(PreprintsResourcesFiltersOptionsSelectors.getLicenses);
  licenseOptionsCount = computed(() => {
    if (!this.licenseOptions()) {
      return 0;
    }

    return this.licenseOptions().reduce((acc, item) => acc + item.count, 0);
  });

  anyOptionsCount = computed(() => {
    return this.datesOptionsCount() > 0;
  });
}
