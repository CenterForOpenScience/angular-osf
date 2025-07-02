import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { FilterChipsComponent } from './filter-chips.component';

describe('FilterChipsComponent', () => {
  let component: FilterChipsComponent;
  let fixture: ComponentFixture<FilterChipsComponent>;
  let componentRef: ComponentRef<FilterChipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterChipsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterChipsComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should have default input values', () => {
      expect(component.selectedValues()).toEqual({});
      expect(component.filterLabels()).toEqual({});
      expect(component.filterOptions()).toEqual({});
    });

    it('should not display anything when no chips are present', () => {
      fixture.detectChanges();
      const chipContainer = fixture.debugElement.query(By.css('.flex.flex-wrap'));
      expect(chipContainer).toBeFalsy();
    });
  });

  describe('Chips Display', () => {
    beforeEach(() => {
      // Set up test data
      componentRef.setInput('selectedValues', {
        subject: 'psychology',
        resourceType: 'project',
      });
      componentRef.setInput('filterLabels', {
        subject: 'Subject',
        resourceType: 'Resource Type',
      });
      componentRef.setInput('filterOptions', {
        subject: [{ id: 'psychology', value: 'psychology', label: 'Psychology' }],
        resourceType: [{ id: 'project', value: 'project', label: 'Project' }],
      });
      fixture.detectChanges();
    });

    it('should display chips for selected values', () => {
      const chips = fixture.debugElement.queryAll(By.css('.filter-chip'));
      expect(chips.length).toBe(2);
    });

    it('should display correct chip labels and values', () => {
      const chips = fixture.debugElement.queryAll(By.css('.chip-label'));
      const chipTexts = chips.map((chip) => chip.nativeElement.textContent.trim());

      expect(chipTexts).toContain('Subject: Psychology');
      expect(chipTexts).toContain('Resource Type: Project');
    });

    it('should display remove button for each chip', () => {
      const removeButtons = fixture.debugElement.queryAll(By.css('.chip-remove'));
      expect(removeButtons.length).toBe(2);
    });

    it('should display clear all button when multiple chips are present', () => {
      const clearAllButton = fixture.debugElement.query(By.css('.clear-all-btn'));
      expect(clearAllButton).toBeTruthy();
      expect(clearAllButton.nativeElement.textContent.trim()).toBe('Clear all');
    });

    it('should have proper aria-label for remove buttons', () => {
      const removeButtons = fixture.debugElement.queryAll(By.css('.chip-remove'));
      const ariaLabels = removeButtons.map((btn) => btn.nativeElement.getAttribute('aria-label'));

      expect(ariaLabels).toContain('Remove Subject filter');
      expect(ariaLabels).toContain('Remove Resource Type filter');
    });
  });

  describe('Single Chip Behavior', () => {
    beforeEach(() => {
      componentRef.setInput('selectedValues', {
        subject: 'psychology',
      });
      componentRef.setInput('filterLabels', {
        subject: 'Subject',
      });
      componentRef.setInput('filterOptions', {
        subject: [{ id: 'psychology', value: 'psychology', label: 'Psychology' }],
      });
      fixture.detectChanges();
    });

    it('should not display clear all button for single chip', () => {
      const clearAllButton = fixture.debugElement.query(By.css('.clear-all-btn'));
      expect(clearAllButton).toBeFalsy();
    });

    it('should still display remove button for single chip', () => {
      const removeButtons = fixture.debugElement.queryAll(By.css('.chip-remove'));
      expect(removeButtons.length).toBe(1);
    });
  });

  describe('Event Emissions', () => {
    beforeEach(() => {
      componentRef.setInput('selectedValues', {
        subject: 'psychology',
        resourceType: 'project',
      });
      componentRef.setInput('filterLabels', {
        subject: 'Subject',
        resourceType: 'Resource Type',
      });
      fixture.detectChanges();
    });

    it('should emit filterRemoved when remove button is clicked', () => {
      spyOn(component.filterRemoved, 'emit');

      const removeButtons = fixture.debugElement.queryAll(By.css('.chip-remove'));
      removeButtons[0].nativeElement.click();

      expect(component.filterRemoved.emit).toHaveBeenCalledWith('subject');
    });

    it('should emit allFiltersCleared when clear all button is clicked', () => {
      spyOn(component.allFiltersCleared, 'emit');

      const clearAllButton = fixture.debugElement.query(By.css('.clear-all-btn'));
      clearAllButton.nativeElement.click();

      expect(component.allFiltersCleared.emit).toHaveBeenCalled();
    });
  });

  describe('Chips Computed Property', () => {
    it('should filter out null and empty values', () => {
      componentRef.setInput('selectedValues', {
        subject: 'psychology',
        resourceType: null,
        creator: '',
        funder: 'nsf',
      });
      componentRef.setInput('filterLabels', {
        subject: 'Subject',
        funder: 'Funder',
      });
      fixture.detectChanges();

      const chips = component.chips();
      expect(chips.length).toBe(2);
      expect(chips.map((c) => c.key)).toEqual(['subject', 'funder']);
    });

    it('should use raw value when no option label is found', () => {
      componentRef.setInput('selectedValues', {
        subject: 'unknown-subject',
      });
      componentRef.setInput('filterLabels', {
        subject: 'Subject',
      });
      componentRef.setInput('filterOptions', {
        subject: [{ id: 'psychology', value: 'psychology', label: 'Psychology' }],
      });
      fixture.detectChanges();

      const chips = component.chips();
      expect(chips[0].displayValue).toBe('unknown-subject');
    });

    it('should use filter key as label when no label is provided', () => {
      componentRef.setInput('selectedValues', {
        subject: 'psychology',
      });
      componentRef.setInput('filterLabels', {});
      fixture.detectChanges();

      const chips = component.chips();
      expect(chips[0].label).toBe('subject');
    });
  });

  describe('Component Methods', () => {
    it('should call filterRemoved.emit with correct parameter in removeFilter', () => {
      spyOn(component.filterRemoved, 'emit');

      component.removeFilter('testKey');

      expect(component.filterRemoved.emit).toHaveBeenCalledWith('testKey');
    });

    it('should call allFiltersCleared.emit in clearAllFilters', () => {
      spyOn(component.allFiltersCleared, 'emit');

      component.clearAllFilters();

      expect(component.allFiltersCleared.emit).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty filter options gracefully', () => {
      componentRef.setInput('selectedValues', {
        subject: 'psychology',
      });
      componentRef.setInput('filterLabels', {
        subject: 'Subject',
      });
      componentRef.setInput('filterOptions', {});
      fixture.detectChanges();

      const chips = component.chips();
      expect(chips[0].displayValue).toBe('psychology');
    });

    it('should handle undefined filter options gracefully', () => {
      componentRef.setInput('selectedValues', {
        subject: 'psychology',
      });
      componentRef.setInput('filterLabels', {
        subject: 'Subject',
      });
      // filterOptions not set (undefined)
      fixture.detectChanges();

      expect(() => fixture.detectChanges()).not.toThrow();
      const chips = component.chips();
      expect(chips[0].displayValue).toBe('psychology');
    });
  });
});
