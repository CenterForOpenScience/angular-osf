import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TooltipPosition } from '@shared/models';

import { InfoIconComponent } from './info-icon.component';

describe('InfoIconComponent', () => {
  let component: InfoIconComponent;
  let fixture: ComponentFixture<InfoIconComponent>;
  let componentRef: ComponentRef<InfoIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InfoIconComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept tooltipText input', () => {
    componentRef.setInput('tooltipText', 'This is a tooltip');
    fixture.detectChanges();

    expect(component.tooltipText()).toBe('This is a tooltip');
  });

  it('should handle different tooltip positions', () => {
    const positions: TooltipPosition[] = ['top', 'bottom', 'left', 'right'];

    positions.forEach((position) => {
      componentRef.setInput('tooltipPosition', position);
      fixture.detectChanges();

      const iconElement = fixture.debugElement.query(By.css('i'));
      expect(iconElement.nativeElement.getAttribute('ng-reflect-tooltip-position')).toBe(position);
    });
  });
});
