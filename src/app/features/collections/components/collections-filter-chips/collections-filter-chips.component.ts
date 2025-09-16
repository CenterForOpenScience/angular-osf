import { createDispatchMap, select } from '@ngxs/store';

import { Chip } from 'primeng/chip';

import { ChangeDetectionStrategy, Component, computed } from '@angular/core';

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

import { collectionFilterTypes } from '../../constants';
import { CollectionFilterType } from '../../enums';

@Component({
  selector: 'osf-collections-filter-chips',
  imports: [Chip],
  templateUrl: './collections-filter-chips.component.html',
  styleUrl: './collections-filter-chips.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionsFilterChipsComponent {
  activeFilters = select(CollectionsSelectors.getAllSelectedFilters);

  private readonly filterTypes = collectionFilterTypes;

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

  activeFilterEntries = computed(() => {
    const filters = this.activeFilters();
    return this.filterTypes
      .map((key) => ({
        key,
        filters: filters[key] || [],
      }))
      .filter((entry) => entry.filters.length);
  });

  onRemoveFilter(filterType: CollectionFilterType, removedFilter: string): void {
    const currentFilters = this.activeFilters()[filterType].filter((filter: string) => filter !== removedFilter);

    switch (filterType) {
      case CollectionFilterType.ProgramArea:
        this.actions.programArea(currentFilters);
        break;
      case CollectionFilterType.CollectedType:
        this.actions.collectedType(currentFilters);
        break;
      case CollectionFilterType.Status:
        this.actions.status(currentFilters);
        break;
      case CollectionFilterType.DataType:
        this.actions.dataType(currentFilters);
        break;
      case CollectionFilterType.Disease:
        this.actions.disease(currentFilters);
        break;
      case CollectionFilterType.GradeLevels:
        this.actions.gradeLevels(currentFilters);
        break;
      case CollectionFilterType.Issue:
        this.actions.issue(currentFilters);
        break;
      case CollectionFilterType.SchoolType:
        this.actions.schoolType(currentFilters);
        break;
      case CollectionFilterType.StudyDesign:
        this.actions.studyDesign(currentFilters);
        break;
      case CollectionFilterType.Volume:
        this.actions.volume(currentFilters);
        break;
    }
  }
}
