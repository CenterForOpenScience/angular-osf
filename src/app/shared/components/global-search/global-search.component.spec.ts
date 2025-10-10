import { MockProvider } from 'ng-mocks';

import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ResourceType } from '@shared/enums';
import { DiscoverableFilter, FilterOperator, FilterOption } from '@shared/models';
import { GlobalSearchSelectors } from '@shared/stores/global-search';

import { GlobalSearchComponent } from './global-search.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('GlobalSearchComponent', () => {
  let component: GlobalSearchComponent;
  let fixture: ComponentFixture<GlobalSearchComponent>;
  let mockRouter: ReturnType<RouterMockBuilder['build']>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;

  const mockFilter: DiscoverableFilter = {
    key: 'subject',
    label: 'Subject',
    operator: FilterOperator.AnyOf,
    options: [],
  };

  const mockFilterOption: FilterOption = {
    label: 'Biology',
    value: 'biology',
    cardSearchResultCount: 100,
  };

  beforeEach(async () => {
    mockRouter = RouterMockBuilder.create().withUrl('/search').build();
    mockActivatedRoute = ActivatedRouteMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [GlobalSearchComponent, OSFTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideMockStore({
          signals: [
            { selector: GlobalSearchSelectors.getResources, value: signal([]) },
            { selector: GlobalSearchSelectors.getResourcesLoading, value: signal(false) },
            { selector: GlobalSearchSelectors.getResourcesCount, value: signal(0) },
            { selector: GlobalSearchSelectors.getFilters, value: signal([]) },
            { selector: GlobalSearchSelectors.getSelectedOptions, value: signal({}) },
            { selector: GlobalSearchSelectors.getFilterSearchCache, value: signal({}) },
            { selector: GlobalSearchSelectors.getSortBy, value: signal('') },
            { selector: GlobalSearchSelectors.getFirst, value: signal(null) },
            { selector: GlobalSearchSelectors.getNext, value: signal(null) },
            { selector: GlobalSearchSelectors.getPrevious, value: signal(null) },
            { selector: GlobalSearchSelectors.getResourceType, value: signal(ResourceType.Null) },
          ],
        }),
        MockProvider(ActivatedRoute, mockActivatedRoute),
        MockProvider(Router, mockRouter),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalSearchComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    fixture.detectChanges();
    expect(component.resourceTabOptions()).toEqual([]);
    expect(component.provider()).toBeNull();
    expect(component.searchControlInput()).toBeNull();
    expect(component.currentStep()).toBe(0);
  });

  it('should initialize searchControl from input', () => {
    const customControl = new FormControl('test search');
    fixture.componentRef.setInput('searchControlInput', customControl);
    fixture.detectChanges();

    expect(component.searchControl).toBe(customControl);
  });

  it('should create new searchControl if no input provided', () => {
    fixture.detectChanges();

    expect(component.searchControl).toBeDefined();
    expect(component.searchControl instanceof FormControl).toBe(true);
  });

  it('should handle onLoadFilterOptions', () => {
    expect(() => component.onLoadFilterOptions(mockFilter)).not.toThrow();
  });

  it('should handle onLoadMoreFilterOptions', () => {
    expect(() => component.onLoadMoreFilterOptions(mockFilter)).not.toThrow();
  });

  it('should handle search with search text provided', () => {
    expect(() => component.onSearchFilterOptions({ searchText: 'bio', filter: mockFilter })).not.toThrow();
  });

  it('should handle search with empty search text', () => {
    expect(() => component.onSearchFilterOptions({ searchText: '  ', filter: mockFilter })).not.toThrow();
  });

  it('should update filter options on filter change', () => {
    expect(() =>
      component.onSelectedFilterOptionsChanged({
        filter: mockFilter,
        filterOption: [mockFilterOption],
      })
    ).not.toThrow();
  });

  it('should change resource type on tab change', () => {
    expect(() => component.onTabChange(ResourceType.Project)).not.toThrow();
  });

  it('should update sort and fetch resources', () => {
    expect(() => component.onSortChanged('relevance')).not.toThrow();
  });

  it('should fetch resources by link', () => {
    expect(() => component.onPageChanged('http://api.osf.io/v2/search?page=2')).not.toThrow();
  });

  it('should scroll to top of content wrapper', () => {
    const mockElement = {
      scrollTo: jest.fn(),
    };
    const querySelectorSpy = jest.spyOn(document, 'querySelector').mockReturnValue(mockElement as any);

    component.scrollToTop();

    expect(querySelectorSpy).toHaveBeenCalledWith('.content-wrapper');
    expect(mockElement.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'instant' });

    querySelectorSpy.mockRestore();
  });

  it('should handle missing content wrapper gracefully', () => {
    const querySelectorSpy = jest.spyOn(document, 'querySelector').mockReturnValue(null);

    expect(() => component.scrollToTop()).not.toThrow();

    querySelectorSpy.mockRestore();
  });
});
