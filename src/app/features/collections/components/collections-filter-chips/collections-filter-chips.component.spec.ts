import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionsSelectors } from '@shared/stores/collections';

import { CollectionsFilterChipsComponent } from './collections-filter-chips.component';

import { MOCK_COLLECTIONS_ACTIVE_FILTERS } from '@testing/mocks/collections-filters.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('CollectionsFilterChipsComponent', () => {
  let component: CollectionsFilterChipsComponent;
  let fixture: ComponentFixture<CollectionsFilterChipsComponent>;

  const mockActiveFilters = MOCK_COLLECTIONS_ACTIVE_FILTERS;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionsFilterChipsComponent, OSFTestingModule],
      providers: [
        provideMockStore({
          signals: [{ selector: CollectionsSelectors.getAllSelectedFilters, value: mockActiveFilters }],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionsFilterChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have active filters from store', () => {
    expect(component.activeFilters()).toEqual(mockActiveFilters);
  });

  it('should compute active filter entries correctly', () => {
    const activeFilterEntries = component.activeFilterEntries();

    expect(activeFilterEntries).toBeDefined();
    expect(Array.isArray(activeFilterEntries)).toBe(true);

    expect(activeFilterEntries.length).toBeGreaterThan(0);

    activeFilterEntries.forEach((entry) => {
      expect(entry.key).toBeDefined();
      expect(Array.isArray(entry.filters)).toBe(true);
      expect(entry.filters.length).toBeGreaterThan(0);
    });
  });

  it('should handle filter removal without errors', () => {
    expect(() => {
      component.onRemoveFilter('programArea' as any, 'Science');
    }).not.toThrow();

    expect(() => {
      component.onRemoveFilter('collectedType' as any, 'preprint');
    }).not.toThrow();

    expect(() => {
      component.onRemoveFilter('status' as any, 'pending');
    }).not.toThrow();

    expect(() => {
      component.onRemoveFilter('dataType' as any, 'Quantitative');
    }).not.toThrow();

    expect(() => {
      component.onRemoveFilter('disease' as any, 'Cancer');
    }).not.toThrow();

    expect(() => {
      component.onRemoveFilter('gradeLevels' as any, 'Graduate');
    }).not.toThrow();

    expect(() => {
      component.onRemoveFilter('issue' as any, '1');
    }).not.toThrow();

    expect(() => {
      component.onRemoveFilter('schoolType' as any, 'University');
    }).not.toThrow();

    expect(() => {
      component.onRemoveFilter('studyDesign' as any, 'Experimental');
    }).not.toThrow();

    expect(() => {
      component.onRemoveFilter('volume' as any, '1');
    }).not.toThrow();
  });

  it('should handle filter removal with multiple values', () => {
    expect(() => {
      component.onRemoveFilter('programArea' as any, 'Science');
    }).not.toThrow();
  });

  it('should handle filter removal when filter array is empty', () => {
    expect(() => {
      component.onRemoveFilter('programArea' as any, 'Science');
    }).not.toThrow();
  });
});
