import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { MultiSelect, MultiSelectChangeEvent } from 'primeng/multiselect';

import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { collectionFilterTypes } from '@osf/features/collections/constants/filter-types.const';
import { CollectionFilterType } from '@osf/features/collections/models';
import {
  CollectionsSelectors,
  SetCollectedTypeFilters,
  SetDataTypeFilters,
  SetDiseaseFilters,
  SetGradeLevelsFilters,
  SetIssueFilters,
  SetProgramAreaFilters,
  SetReviewsStateFilters,
  SetSchoolTypeFilters,
  SetStatusFilters,
  SetStudyDesignFilters,
  SetVolumeFilters,
} from '@osf/features/collections/store';

@Component({
  selector: 'osf-collections-filters',
  imports: [FormsModule, MultiSelect, Accordion, AccordionContent, AccordionHeader, AccordionPanel, TranslatePipe],
  templateUrl: './collections-filters.component.html',
  styleUrl: './collections-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionsFiltersComponent {
  private readonly filterTypes = collectionFilterTypes;

  protected filtersOptions = select(CollectionsSelectors.getAllFiltersOptions);
  protected selectedFilters = select(CollectionsSelectors.getAllSelectedFilters);

  protected actions = createDispatchMap({
    programArea: SetProgramAreaFilters,
    collectedType: SetCollectedTypeFilters,
    status: SetStatusFilters,
    dataType: SetDataTypeFilters,
    disease: SetDiseaseFilters,
    gradeLevels: SetGradeLevelsFilters,
    issue: SetIssueFilters,
    reviewsState: SetReviewsStateFilters,
    schoolType: SetSchoolTypeFilters,
    studyDesign: SetStudyDesignFilters,
    volume: SetVolumeFilters,
  });

  protected availableFilterEntries = computed(() => {
    const options = this.filtersOptions();
    const selectedFilters = this.selectedFilters();

    return this.filterTypes
      .map((key, index) => ({
        key,
        value: index.toString(),
        options: options[key] || [],
        selectedFilters: selectedFilters[key] || [],
        translationKeys: {
          label: `collections.filters.${key}.label`,
          description: `collections.filters.${key}.description`,
          placeholder: `collections.filters.${key}.placeholder`,
        },
      }))
      .filter((entry) => entry.options.length > 0);
  });

  protected setFilters(filterType: CollectionFilterType, $event: MultiSelectChangeEvent): void {
    const filters = $event.value;

    switch (filterType) {
      case 'programArea':
        this.actions.programArea(filters);
        break;
      case 'collectedType':
        this.actions.collectedType(filters);
        break;
      case 'status':
        this.actions.status(filters);
        break;
      case 'dataType':
        this.actions.dataType(filters);
        break;
      case 'disease':
        this.actions.disease(filters);
        break;
      case 'gradeLevels':
        this.actions.gradeLevels(filters);
        break;
      case 'issue':
        this.actions.issue(filters);
        break;
      case 'reviewsState':
        this.actions.reviewsState(filters);
        break;
      case 'schoolType':
        this.actions.schoolType(filters);
        break;
      case 'studyDesign':
        this.actions.studyDesign(filters);
        break;
      case 'volume':
        this.actions.volume(filters);
        break;
    }
  }

  protected clearFilters(filterType: CollectionFilterType): void {
    this.setFilters(filterType, { value: [] } as MultiSelectChangeEvent);
  }
}
