import { createDispatchMap, select } from '@ngxs/store';

import { Chip } from 'primeng/chip';

import { ChangeDetectionStrategy, Component, computed } from '@angular/core';

import { collectionFilterTypes } from '@osf/features/collections/constants/filter-types.const';
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

type FilterType = keyof ReturnType<typeof CollectionsSelectors.getAllSelectedFilters>;

@Component({
  selector: 'osf-collections-filter-chips',
  imports: [Chip],
  templateUrl: './collections-filter-chips.component.html',
  styleUrl: './collections-filter-chips.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionsFilterChipsComponent {
  protected activeFilters = select(CollectionsSelectors.getAllSelectedFilters);

  private readonly filterTypes = collectionFilterTypes;

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

  protected activeFilterEntries = computed(() => {
    const filters = this.activeFilters();
    return this.filterTypes
      .map((key) => ({
        key,
        filters: filters[key] || [],
      }))
      .filter((entry) => entry.filters.length);
  });

  protected onRemoveFilter(filterType: FilterType, removedFilter: string): void {
    const currentFilters = this.activeFilters()[filterType].filter((filter: string) => filter !== removedFilter);

    switch (filterType) {
      case 'programArea':
        this.actions.programArea(currentFilters);
        break;
      case 'collectedType':
        this.actions.collectedType(currentFilters);
        break;
      case 'status':
        this.actions.status(currentFilters);
        break;
      case 'dataType':
        this.actions.dataType(currentFilters);
        break;
      case 'disease':
        this.actions.disease(currentFilters);
        break;
      case 'gradeLevels':
        this.actions.gradeLevels(currentFilters);
        break;
      case 'issue':
        this.actions.issue(currentFilters);
        break;
      case 'reviewsState':
        this.actions.reviewsState(currentFilters);
        break;
      case 'schoolType':
        this.actions.schoolType(currentFilters);
        break;
      case 'studyDesign':
        this.actions.studyDesign(currentFilters);
        break;
      case 'volume':
        this.actions.volume(currentFilters);
        break;
    }
  }
}
