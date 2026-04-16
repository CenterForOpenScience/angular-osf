import { Store } from '@ngxs/store';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';

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

import {
  MOCK_COLLECTIONS_ACTIVE_FILTERS,
  MOCK_COLLECTIONS_EMPTY_FILTERS,
} from '@testing/mocks/collections-filters.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';

import { CollectionFilterType } from '../../enums';

import { CollectionsFilterChipsComponent } from './collections-filter-chips.component';

describe('CollectionsFilterChipsComponent', () => {
  let component: CollectionsFilterChipsComponent;
  let fixture: ComponentFixture<CollectionsFilterChipsComponent>;
  let store: Store;
  let dispatchMock: Mock;

  const mockActiveFilters = MOCK_COLLECTIONS_ACTIVE_FILTERS;
  const defaultSignals: SignalOverride[] = [
    { selector: CollectionsSelectors.getAllSelectedFilters, value: mockActiveFilters },
  ];

  function setup(overrides: BaseSetupOverrides = {}): void {
    TestBed.configureTestingModule({
      imports: [CollectionsFilterChipsComponent],
      providers: [
        provideOSFCore(),
        provideMockStore({ signals: mergeSignalOverrides(defaultSignals, overrides.selectorOverrides) }),
      ],
    });

    store = TestBed.inject(Store);
    dispatchMock = store.dispatch as Mock;
    fixture = TestBed.createComponent(CollectionsFilterChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should have active filters from store', () => {
    setup();
    expect(component.activeFilters()).toEqual(mockActiveFilters);
  });

  it('should compute only non-empty active filter entries', () => {
    setup({
      selectorOverrides: [
        { selector: CollectionsSelectors.getAllSelectedFilters, value: MOCK_COLLECTIONS_EMPTY_FILTERS },
      ],
    });

    expect(component.activeFilterEntries()).toEqual([]);
  });

  it('should dispatch SetProgramAreaFilters when removing program area filter', () => {
    setup();
    component.onRemoveFilter(CollectionFilterType.ProgramArea, 'Science');

    expect(store.dispatch).toHaveBeenCalledWith(new SetProgramAreaFilters(['Technology']));
  });

  it('should dispatch SetCollectedTypeFilters when removing collected type filter', () => {
    setup();
    component.onRemoveFilter(CollectionFilterType.CollectedType, 'preprint');

    expect(store.dispatch).toHaveBeenCalledWith(new SetCollectedTypeFilters([]));
  });

  it('should dispatch SetStatusFilters when removing status filter', () => {
    setup();
    component.onRemoveFilter(CollectionFilterType.Status, 'pending');

    expect(store.dispatch).toHaveBeenCalledWith(new SetStatusFilters([]));
  });

  it('should dispatch SetDataTypeFilters when removing data type filter', () => {
    setup();
    component.onRemoveFilter(CollectionFilterType.DataType, 'Quantitative');

    expect(store.dispatch).toHaveBeenCalledWith(new SetDataTypeFilters([]));
  });

  it('should dispatch SetDiseaseFilters when removing disease filter', () => {
    setup();
    component.onRemoveFilter(CollectionFilterType.Disease, 'Cancer');

    expect(store.dispatch).toHaveBeenCalledWith(new SetDiseaseFilters([]));
  });

  it('should dispatch SetGradeLevelsFilters when removing grade levels filter', () => {
    setup();
    component.onRemoveFilter(CollectionFilterType.GradeLevels, 'Graduate');

    expect(store.dispatch).toHaveBeenCalledWith(new SetGradeLevelsFilters([]));
  });

  it('should dispatch SetIssueFilters when removing issue filter', () => {
    setup();
    component.onRemoveFilter(CollectionFilterType.Issue, '1');

    expect(store.dispatch).toHaveBeenCalledWith(new SetIssueFilters([]));
  });

  it('should dispatch SetSchoolTypeFilters when removing school type filter', () => {
    setup();
    component.onRemoveFilter(CollectionFilterType.SchoolType, 'University');

    expect(store.dispatch).toHaveBeenCalledWith(new SetSchoolTypeFilters([]));
  });

  it('should dispatch SetStudyDesignFilters when removing study design filter', () => {
    setup();
    component.onRemoveFilter(CollectionFilterType.StudyDesign, 'Experimental');

    expect(store.dispatch).toHaveBeenCalledWith(new SetStudyDesignFilters([]));
  });

  it('should dispatch SetVolumeFilters when removing volume filter', () => {
    setup();
    component.onRemoveFilter(CollectionFilterType.Volume, '1');

    expect(store.dispatch).toHaveBeenCalledWith(new SetVolumeFilters([]));
  });

  it('should remove only the selected filter value', () => {
    setup();
    dispatchMock.mockClear();

    component.onRemoveFilter(CollectionFilterType.ProgramArea, 'Technology');

    expect(store.dispatch).toHaveBeenCalledWith(new SetProgramAreaFilters(['Science']));
  });
});
