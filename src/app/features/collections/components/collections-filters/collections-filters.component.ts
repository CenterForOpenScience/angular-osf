import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { MultiSelect, MultiSelectChangeEvent } from 'primeng/multiselect';

import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { collectionFilterTypes } from '@osf/features/collections/constants/filter-types.const';
import { CollectionFilterType } from '@osf/features/collections/enums';
import {
  CollectionsSelectors,
  SetCollectedTypeFilters,
  SetDataTypeFilters,
  SetDiseaseFilters,
  SetGradeLevelsFilters,
  SetIssueFilters,
  SetProgramAreaFilters,
  SetSchoolTypeFilters,
  SetStatusFilters,
  SetStudyDesignFilters,
  SetVolumeFilters,
} from '@shared/stores/collections';

@Component({
  selector: 'osf-collections-filters',
  imports: [FormsModule, MultiSelect, Accordion, AccordionContent, AccordionHeader, AccordionPanel, TranslatePipe],
  templateUrl: './collections-filters.component.html',
  styleUrl: './collections-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionsFiltersComponent {
  private readonly filterTypes = collectionFilterTypes;

  filtersOptions = select(CollectionsSelectors.getAllFiltersOptions);
  selectedFilters = select(CollectionsSelectors.getAllSelectedFilters);

  actions = createDispatchMap({
    programArea: SetProgramAreaFilters,
    collectedType: SetCollectedTypeFilters,
    status: SetStatusFilters,
    dataType: SetDataTypeFilters,
    disease: SetDiseaseFilters,
    gradeLevels: SetGradeLevelsFilters,
    issue: SetIssueFilters,
    schoolType: SetSchoolTypeFilters,
    studyDesign: SetStudyDesignFilters,
    volume: SetVolumeFilters,
  });

  availableFilterEntries = computed(() => {
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

  setFilters(filterType: CollectionFilterType, $event: MultiSelectChangeEvent): void {
    const filters = $event.value;

    switch (filterType) {
      case CollectionFilterType.ProgramArea:
        this.actions.programArea(filters);
        break;
      case CollectionFilterType.CollectedType:
        this.actions.collectedType(filters);
        break;
      case CollectionFilterType.Status:
        this.actions.status(filters);
        break;
      case CollectionFilterType.DataType:
        this.actions.dataType(filters);
        break;
      case CollectionFilterType.Disease:
        this.actions.disease(filters);
        break;
      case CollectionFilterType.GradeLevels:
        this.actions.gradeLevels(filters);
        break;
      case CollectionFilterType.Issue:
        this.actions.issue(filters);
        break;
      case CollectionFilterType.SchoolType:
        this.actions.schoolType(filters);
        break;
      case CollectionFilterType.StudyDesign:
        this.actions.studyDesign(filters);
        break;
      case CollectionFilterType.Volume:
        this.actions.volume(filters);
        break;
    }
  }

  clearFilters(filterType: CollectionFilterType): void {
    this.setFilters(filterType, { value: [] } as MultiSelectChangeEvent);
  }
}
