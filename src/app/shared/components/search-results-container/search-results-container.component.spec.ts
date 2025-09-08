import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ResourceType } from '@shared/enums';
import { TranslateServiceMock } from '@shared/mocks';

import { SearchResultsContainerComponent } from './search-results-container.component';

describe('SearchResultsContainerComponent', () => {
  let component: SearchResultsContainerComponent;
  let fixture: ComponentFixture<SearchResultsContainerComponent>;
  let componentRef: ComponentRef<SearchResultsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchResultsContainerComponent, NoopAnimationsModule],
      providers: [TranslateServiceMock, provideHttpClient(), provideHttpClientTesting()],
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
      expect(component.selectedTab()).toBe(ResourceType.Null);
      expect(component.selectedValues()).toEqual({});
      expect(component.first()).toBeNull();
      expect(component.prev()).toBeNull();
      expect(component.next()).toBeNull();
      expect(component.isFiltersOpen()).toBe(false);
      expect(component.isSortingOpen()).toBe(false);
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

  describe('Method Testing', () => {
    it('should emit sortChanged when selectSort is called', () => {
      jest.spyOn(component.sortChanged, 'emit');

      component.selectSort('relevance');

      expect(component.sortChanged.emit).toHaveBeenCalledWith('relevance');
    });

    it('should emit tabChanged when selectTab is called', () => {
      jest.spyOn(component.tabChanged, 'emit');

      component.selectTab(ResourceType.Project);

      expect(component.tabChanged.emit).toHaveBeenCalledWith(ResourceType.Project);
    });

    it('should emit pageChanged when switchPage is called with valid link', () => {
      jest.spyOn(component.pageChanged, 'emit');

      component.switchPage('http://example.com/page2');

      expect(component.pageChanged.emit).toHaveBeenCalledWith('http://example.com/page2');
    });

    it('should not emit pageChanged when switchPage is called with null', () => {
      jest.spyOn(component.pageChanged, 'emit');

      component.switchPage(null);

      expect(component.pageChanged.emit).not.toHaveBeenCalled();
    });
  });
});
