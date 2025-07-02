import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SEARCH_TAB_OPTIONS, searchSortingOptions } from '@shared/constants';
import { ResourceTab } from '@shared/enums';
import { Resource } from '@shared/models';

import { SearchResultsContainerComponent } from './search-results-container.component';

describe('SearchResultsContainerComponent', () => {
  let component: SearchResultsContainerComponent;
  let fixture: ComponentFixture<SearchResultsContainerComponent>;
  let componentRef: ComponentRef<SearchResultsContainerComponent>;

  const mockResources: Resource[] = [
    {
      id: '1',
      title: 'Test Resource 1',
      description: 'Test Description 1',
      type: 'project',
      url: 'http://test1.com',
      contributors: [],
      tags: [],
      dateCreated: new Date('2023-01-01'),
      dateModified: new Date('2023-01-01'),
    },
    {
      id: '2',
      title: 'Test Resource 2',
      description: 'Test Description 2',
      type: 'registration',
      url: 'http://test2.com',
      contributors: [],
      tags: [],
      dateCreated: new Date('2023-01-02'),
      dateModified: new Date('2023-01-02'),
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchResultsContainerComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchResultsContainerComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should have default input values', () => {
      expect(component.resources()).toEqual([]);
      expect(component.searchCount()).toBe(0);
      expect(component.selectedSort()).toBe('');
      expect(component.selectedTab()).toBe(ResourceTab.All);
      expect(component.selectedValues()).toEqual({});
      expect(component.first()).toBeNull();
      expect(component.prev()).toBeNull();
      expect(component.next()).toBeNull();
      expect(component.isFiltersOpen()).toBe(false);
      expect(component.isSortingOpen()).toBe(false);
    });

    it('should have access to constants', () => {
      expect(component['searchSortingOptions']).toBe(searchSortingOptions);
      expect(component['ResourceTab']).toBe(ResourceTab);
      expect(component['tabsOptions']).toBe(SEARCH_TAB_OPTIONS);
    });
  });

  describe('Computed Properties', () => {
    it('should compute hasSelectedValues correctly when no values are selected', () => {
      componentRef.setInput('selectedValues', {});
      expect(component['hasSelectedValues']()).toBe(false);
    });

    it('should compute hasSelectedValues correctly when values are selected', () => {
      componentRef.setInput('selectedValues', { subject: 'psychology', type: 'project' });
      expect(component['hasSelectedValues']()).toBe(true);
    });

    it('should compute hasSelectedValues correctly when some values are null or empty', () => {
      componentRef.setInput('selectedValues', { subject: null, type: '', category: 'science' });
      expect(component['hasSelectedValues']()).toBe(true);
    });

    it('should compute hasSelectedValues correctly when all values are null or empty', () => {
      componentRef.setInput('selectedValues', { subject: null, type: '', category: '' });
      expect(component['hasSelectedValues']()).toBe(false);
    });

    it('should compute hasFilters correctly', () => {
      expect(component['hasFilters']()).toBe(true);
    });
  });

  describe('Display Logic', () => {
    beforeEach(() => {
      componentRef.setInput('resources', mockResources);
      componentRef.setInput('searchCount', 2);
      componentRef.setInput('selectedSort', 'relevance');
      componentRef.setInput('selectedTab', ResourceTab.All);
      fixture.detectChanges();
    });

    it('should display correct search count when count is normal', () => {
      const countElement = fixture.debugElement.query(By.css('h3'));
      expect(countElement.nativeElement.textContent.trim()).toBe('2 results');
    });

    it('should display 10000+ when search count is above 10000', () => {
      componentRef.setInput('searchCount', 15000);
      fixture.detectChanges();

      const countElement = fixture.debugElement.query(By.css('h3'));
      expect(countElement.nativeElement.textContent.trim()).toBe('10 000+ results');
    });

    it('should display 0 results when search count is 0', () => {
      componentRef.setInput('searchCount', 0);
      fixture.detectChanges();

      const countElement = fixture.debugElement.query(By.css('h3'));
      expect(countElement.nativeElement.textContent.trim()).toBe('0 results');
    });

    it('should display mobile dropdown when on mobile', () => {
      const mobileDropdown = fixture.debugElement.query(By.css('p-select.text-center.inline-flex.md\\:hidden'));
      expect(mobileDropdown).toBeTruthy();
    });

    it('should display desktop sorting dropdown', () => {
      const desktopDropdown = fixture.debugElement.query(By.css('p-select.no-border-dropdown'));
      expect(desktopDropdown).toBeTruthy();
    });

    it('should show filter chips when hasSelectedValues is true', () => {
      componentRef.setInput('selectedValues', { subject: 'psychology' });
      fixture.detectChanges();

      const filterChipsSlot = fixture.debugElement.query(By.css('[slot="filter-chips"]'));
      expect(filterChipsSlot).toBeTruthy();
    });

    it('should not show filter chips when hasSelectedValues is false', () => {
      componentRef.setInput('selectedValues', {});
      fixture.detectChanges();

      const filterChipsContainer = fixture.debugElement.query(By.css('.mb-3'));
      expect(filterChipsContainer).toBeFalsy();
    });
  });

  describe('Conditional Display States', () => {
    it('should display filters when isFiltersOpen is true', () => {
      componentRef.setInput('isFiltersOpen', true);
      fixture.detectChanges();

      const filtersContainer = fixture.debugElement.query(By.css('.filter-full-size'));
      expect(filtersContainer).toBeTruthy();
    });

    it('should display sorting options when isSortingOpen is true', () => {
      componentRef.setInput('isSortingOpen', true);
      fixture.detectChanges();

      const sortingContainer = fixture.debugElement.query(By.css('.flex.flex-column.p-5.pt-1.row-gap-3'));
      expect(sortingContainer).toBeTruthy();
    });

    it('should display sorting cards when isSortingOpen is true', () => {
      componentRef.setInput('isSortingOpen', true);
      fixture.detectChanges();

      const sortCards = fixture.debugElement.queryAll(By.css('.sort-card'));
      expect(sortCards.length).toBe(searchSortingOptions.length);
    });

    it('should highlight selected sorting option', () => {
      componentRef.setInput('isSortingOpen', true);
      componentRef.setInput('selectedSort', 'relevance');
      fixture.detectChanges();

      const selectedCard = fixture.debugElement.query(By.css('.sort-card.card-selected'));
      expect(selectedCard).toBeTruthy();
    });

    it('should display main content when neither filters nor sorting are open', () => {
      componentRef.setInput('isFiltersOpen', false);
      componentRef.setInput('isSortingOpen', false);
      componentRef.setInput('resources', mockResources);
      fixture.detectChanges();

      const dataView = fixture.debugElement.query(By.css('p-dataView'));
      expect(dataView).toBeTruthy();
    });
  });

  describe('Method Testing', () => {
    it('should emit sortChanged when selectSort is called', () => {
      spyOn(component.sortChanged, 'emit');

      component.selectSort('relevance');

      expect(component.sortChanged.emit).toHaveBeenCalledWith('relevance');
    });

    it('should emit tabChanged when selectTab is called', () => {
      spyOn(component.tabChanged, 'emit');

      component.selectTab(ResourceTab.Projects);

      expect(component.tabChanged.emit).toHaveBeenCalledWith(ResourceTab.Projects);
    });

    it('should emit pageChanged when switchPage is called with valid link', () => {
      spyOn(component.pageChanged, 'emit');

      component.switchPage('http://example.com/page2');

      expect(component.pageChanged.emit).toHaveBeenCalledWith('http://example.com/page2');
    });

    it('should not emit pageChanged when switchPage is called with null', () => {
      spyOn(component.pageChanged, 'emit');

      component.switchPage(null);

      expect(component.pageChanged.emit).not.toHaveBeenCalled();
    });

    it('should emit filtersToggled when openFilters is called', () => {
      spyOn(component.filtersToggled, 'emit');

      component.openFilters();

      expect(component.filtersToggled.emit).toHaveBeenCalled();
    });

    it('should emit sortingToggled when openSorting is called', () => {
      spyOn(component.sortingToggled, 'emit');

      component.openSorting();

      expect(component.sortingToggled.emit).toHaveBeenCalled();
    });

    it('should return true for isAnyFilterOptions', () => {
      expect(component.isAnyFilterOptions()).toBe(true);
    });
  });

  describe('Pagination', () => {
    beforeEach(() => {
      componentRef.setInput('resources', mockResources);
      componentRef.setInput('first', 'http://example.com/page1');
      componentRef.setInput('prev', 'http://example.com/prev');
      componentRef.setInput('next', 'http://example.com/next');
      fixture.detectChanges();
    });

    it('should display pagination buttons when navigation links are available', () => {
      const paginationButtons = fixture.debugElement.queryAll(By.css('p-button'));
      expect(paginationButtons.length).toBeGreaterThan(0);
    });

    it('should handle first page button click', () => {
      spyOn(component, 'switchPage');

      const firstButton = fixture.debugElement.query(By.css('p-button[icon="fas fa-angles-left"]'));
      firstButton.nativeElement.click();

      expect(component.switchPage).toHaveBeenCalledWith('http://example.com/page1');
    });

    it('should handle previous page button click', () => {
      spyOn(component, 'switchPage');

      const prevButton = fixture.debugElement.query(By.css('p-button[icon="fas fa-angle-left"]'));
      prevButton.nativeElement.click();

      expect(component.switchPage).toHaveBeenCalledWith('http://example.com/prev');
    });

    it('should handle next page button click', () => {
      spyOn(component, 'switchPage');

      const nextButton = fixture.debugElement.query(By.css('p-button[icon="fas fa-angle-right"]'));
      nextButton.nativeElement.click();

      expect(component.switchPage).toHaveBeenCalledWith('http://example.com/next');
    });

    it('should disable previous button when prev is null', () => {
      componentRef.setInput('prev', null);
      fixture.detectChanges();

      const prevButton = fixture.debugElement.query(By.css('p-button[icon="fas fa-angle-left"]'));
      expect(prevButton.nativeElement.disabled).toBe(true);
    });

    it('should disable next button when next is null', () => {
      componentRef.setInput('next', null);
      fixture.detectChanges();

      const nextButton = fixture.debugElement.query(By.css('p-button[icon="fas fa-angle-right"]'));
      expect(nextButton.nativeElement.disabled).toBe(true);
    });
  });

  describe('Event Handling', () => {
    beforeEach(() => {
      componentRef.setInput('resources', mockResources);
      fixture.detectChanges();
    });

    it('should handle sort selection from dropdown', () => {
      spyOn(component, 'selectSort');

      const sortDropdown = fixture.debugElement.query(By.css('p-select.no-border-dropdown'));
      sortDropdown.triggerEventHandler('ngModelChange', 'date');

      expect(component.selectSort).toHaveBeenCalledWith('date');
    });

    it('should handle tab selection from mobile dropdown', () => {
      spyOn(component, 'selectTab');

      const tabDropdown = fixture.debugElement.query(By.css('p-select.text-center.inline-flex.md\\:hidden'));
      tabDropdown.triggerEventHandler('ngModelChange', ResourceTab.Projects);

      expect(component.selectTab).toHaveBeenCalledWith(ResourceTab.Projects);
    });

    it('should handle filter icon click', () => {
      spyOn(component, 'openFilters');

      const filterIcon = fixture.debugElement.query(By.css('img[alt="filter by"]'));
      filterIcon.nativeElement.click();

      expect(component.openFilters).toHaveBeenCalled();
    });

    it('should handle sort icon click', () => {
      spyOn(component, 'openSorting');

      const sortIcon = fixture.debugElement.query(By.css('img[alt="sort by"]'));
      sortIcon.nativeElement.click();

      expect(component.openSorting).toHaveBeenCalled();
    });

    it('should handle filter icon keyboard enter', () => {
      spyOn(component, 'openFilters');

      const filterIcon = fixture.debugElement.query(By.css('img[alt="filter by"]'));
      filterIcon.triggerEventHandler('keydown.enter', {});

      expect(component.openFilters).toHaveBeenCalled();
    });

    it('should handle sort icon keyboard enter', () => {
      spyOn(component, 'openSorting');

      const sortIcon = fixture.debugElement.query(By.css('img[alt="sort by"]'));
      sortIcon.triggerEventHandler('keydown.enter', {});

      expect(component.openSorting).toHaveBeenCalled();
    });
  });

  describe('Sorting Card Interaction', () => {
    beforeEach(() => {
      componentRef.setInput('isSortingOpen', true);
      componentRef.setInput('selectedSort', 'relevance');
      fixture.detectChanges();
    });

    it('should handle sort card click', () => {
      spyOn(component, 'selectSort');

      const sortCard = fixture.debugElement.query(By.css('.sort-card'));
      sortCard.nativeElement.click();

      expect(component.selectSort).toHaveBeenCalledWith(searchSortingOptions[0].value);
    });

    it('should handle sort card keyboard enter', () => {
      spyOn(component, 'selectSort');

      const sortCard = fixture.debugElement.query(By.css('.sort-card'));
      sortCard.triggerEventHandler('keydown.enter', {});

      expect(component.selectSort).toHaveBeenCalledWith(searchSortingOptions[0].value);
    });
  });

  describe('Resource Display', () => {
    beforeEach(() => {
      componentRef.setInput('resources', mockResources);
      fixture.detectChanges();
    });

    it('should display resources in data view', () => {
      const dataView = fixture.debugElement.query(By.css('p-dataView'));
      expect(dataView).toBeTruthy();
      expect(dataView.componentInstance.value).toEqual(mockResources);
    });

    it('should set correct rows per page', () => {
      const dataView = fixture.debugElement.query(By.css('p-dataView'));
      expect(dataView.componentInstance.rows).toBe(10);
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should have proper tabindex on interactive elements', () => {
      const filterIcon = fixture.debugElement.query(By.css('img[alt="filter by"]'));
      const sortIcon = fixture.debugElement.query(By.css('img[alt="sort by"]'));

      expect(filterIcon.nativeElement.getAttribute('tabindex')).toBe('0');
      expect(sortIcon.nativeElement.getAttribute('tabindex')).toBe('0');
    });

    it('should have proper role attributes on interactive elements', () => {
      const filterIcon = fixture.debugElement.query(By.css('img[alt="filter by"]'));
      const sortIcon = fixture.debugElement.query(By.css('img[alt="sort by"]'));

      expect(filterIcon.nativeElement.getAttribute('role')).toBe('button');
      expect(sortIcon.nativeElement.getAttribute('role')).toBe('button');
    });

    it('should have proper alt text on icons', () => {
      const filterIcon = fixture.debugElement.query(By.css('img[alt="filter by"]'));
      const sortIcon = fixture.debugElement.query(By.css('img[alt="sort by"]'));

      expect(filterIcon.nativeElement.getAttribute('alt')).toBe('filter by');
      expect(sortIcon.nativeElement.getAttribute('alt')).toBe('sort by');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty resources array', () => {
      componentRef.setInput('resources', []);
      fixture.detectChanges();

      const dataView = fixture.debugElement.query(By.css('p-dataView'));
      expect(dataView.componentInstance.value).toEqual([]);
    });

    it('should handle undefined selected values', () => {
      componentRef.setInput('selectedValues', undefined);
      expect(() => component['hasSelectedValues']()).not.toThrow();
    });

    it('should handle null navigation links', () => {
      componentRef.setInput('first', null);
      componentRef.setInput('prev', null);
      componentRef.setInput('next', null);
      fixture.detectChanges();

      expect(() => fixture.detectChanges()).not.toThrow();
    });
  });
});
