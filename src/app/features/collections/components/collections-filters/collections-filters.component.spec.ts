import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionsSelectors } from '@shared/stores/collections';

import { CollectionsFiltersComponent } from './collections-filters.component';

import {
  MOCK_COLLECTIONS_FILTERS_OPTIONS,
  MOCK_COLLECTIONS_SELECTED_FILTERS,
} from '@testing/mocks/collections-filters.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('CollectionsFiltersComponent', () => {
  let component: CollectionsFiltersComponent;
  let fixture: ComponentFixture<CollectionsFiltersComponent>;

  const mockFiltersOptions = MOCK_COLLECTIONS_FILTERS_OPTIONS;
  const mockSelectedFilters = MOCK_COLLECTIONS_SELECTED_FILTERS;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionsFiltersComponent, OSFTestingModule],
      providers: [
        provideMockStore({
          signals: [
            { selector: CollectionsSelectors.getAllFiltersOptions, value: mockFiltersOptions },
            { selector: CollectionsSelectors.getAllSelectedFilters, value: mockSelectedFilters },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionsFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute available filter entries correctly', () => {
    const availableFilterEntries = component.availableFilterEntries();

    expect(availableFilterEntries).toBeDefined();
    expect(Array.isArray(availableFilterEntries)).toBe(true);

    expect(availableFilterEntries.length).toBeGreaterThan(0);

    availableFilterEntries.forEach((entry) => {
      expect(entry.key).toBeDefined();
      expect(entry.value).toBeDefined();
      expect(Array.isArray(entry.options)).toBe(true);
      expect(Array.isArray(entry.selectedFilters)).toBe(true);
      expect(entry.translationKeys).toBeDefined();
      expect(entry.translationKeys.label).toBeDefined();
      expect(entry.translationKeys.description).toBeDefined();
      expect(entry.translationKeys.placeholder).toBeDefined();
    });
  });

  it('should filter out filter types with no options', () => {
    const availableFilterEntries = component.availableFilterEntries();
    expect(availableFilterEntries.length).toBeGreaterThan(0);

    availableFilterEntries.forEach((entry) => {
      expect(entry.options.length).toBeGreaterThan(0);
    });
  });

  it('should handle completely empty filter options', () => {
    const availableFilterEntries = component.availableFilterEntries();
    expect(availableFilterEntries.length).toBeGreaterThan(0);

    availableFilterEntries.forEach((entry) => {
      expect(entry.key).toBeDefined();
      expect(entry.value).toBeDefined();
      expect(Array.isArray(entry.options)).toBe(true);
      expect(Array.isArray(entry.selectedFilters)).toBe(true);
    });
  });

  it('should handle empty selected filters', () => {
    const availableFilterEntries = component.availableFilterEntries();

    availableFilterEntries.forEach((entry) => {
      expect(Array.isArray(entry.selectedFilters)).toBe(true);
      expect(entry.selectedFilters.length).toBeGreaterThanOrEqual(0);
    });
  });

  it('should handle set filters without errors', () => {
    const mockEvent = { value: ['Science', 'Technology'] } as any;

    expect(() => {
      component.setFilters('programArea' as any, mockEvent);
    }).not.toThrow();

    expect(() => {
      component.setFilters('collectedType' as any, { value: ['preprint'] } as any);
    }).not.toThrow();

    expect(() => {
      component.setFilters('status' as any, { value: ['pending'] } as any);
    }).not.toThrow();
  });

  it('should handle clear filters without errors', () => {
    expect(() => {
      component.clearFilters('programArea' as any);
    }).not.toThrow();

    expect(() => {
      component.clearFilters('collectedType' as any);
    }).not.toThrow();

    expect(() => {
      component.clearFilters('status' as any);
    }).not.toThrow();
  });

  it('should have filters options from store', () => {
    expect(component.filtersOptions()).toEqual(mockFiltersOptions);
  });

  it('should have selected filters from store', () => {
    expect(component.selectedFilters()).toEqual(mockSelectedFilters);
  });
});
