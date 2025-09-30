import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { FilterChipsComponent } from './filter-chips.component';

import { jest } from '@jest/globals';

describe.skip('FilterChipsComponent', () => {
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
      expect(component.filterOptions()).toEqual({});
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
      const chips = fixture.debugElement.queryAll(By.css('p-chip'));
      expect(chips.length).toBe(2);
    });

    it('should display correct chip labels and values', () => {
      const chips = fixture.debugElement.queryAll(By.css('p-chip'));
      const chipLabels = chips.map((chip) => chip.nativeElement.getAttribute('ng-reflect-label'));

      expect(chipLabels).toContain('Subject : Psychology');
      expect(chipLabels).toContain('Resource Type : Project');
    });

    it('should display remove button for each chip', () => {
      const chips = fixture.debugElement.queryAll(By.css('p-chip'));
      expect(chips.length).toBe(2);

      chips.forEach((chip) => {
        const removableAttr = chip.nativeElement.getAttribute('ng-reflect-removable');
        const removeIconAttr = chip.nativeElement.getAttribute('ng-reflect-remove-icon');
        expect(removableAttr === 'true' || removeIconAttr).toBeTruthy();
      });
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

    it('should display single chip correctly', () => {
      const chips = fixture.debugElement.queryAll(By.css('p-chip'));
      expect(chips.length).toBe(1);
    });

    it('should still display remove button for single chip', () => {
      const chips = fixture.debugElement.queryAll(By.css('p-chip'));
      expect(chips.length).toBe(1);

      const removableAttr = chips[0].nativeElement.getAttribute('ng-reflect-removable');
      const removeIconAttr = chips[0].nativeElement.getAttribute('ng-reflect-remove-icon');
      expect(removableAttr === 'true' || removeIconAttr).toBeTruthy();
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
      const emitSpy = jest.spyOn(component.selectedOptionRemoved, 'emit');

      const chips = fixture.debugElement.queryAll(By.css('p-chip'));
      chips[0].triggerEventHandler('onRemove', null);

      expect(emitSpy).toHaveBeenCalledWith('subject');
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
      const emitSpy = jest.spyOn(component.selectedOptionRemoved, 'emit');

      component.removeFilter('testKey');

      expect(emitSpy).toHaveBeenCalledWith('testKey');
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
      fixture.detectChanges();

      expect(() => fixture.detectChanges()).not.toThrow();
      const chips = component.chips();
      expect(chips[0].displayValue).toBe('psychology');
    });
  });
});
