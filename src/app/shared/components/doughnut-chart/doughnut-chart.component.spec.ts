import { MockComponent, MockProvider } from 'ng-mocks';

import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

import { DoughnutChartComponent } from './doughnut-chart.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('DoughnutChartComponent', () => {
  let component: DoughnutChartComponent;
  let fixture: ComponentFixture<DoughnutChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoughnutChartComponent, OSFTestingModule, MockComponent(LoadingSpinnerComponent)],
      providers: [MockProvider(PLATFORM_ID, 'server')],
    }).compileComponents();

    fixture = TestBed.createComponent(DoughnutChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.isLoading()).toBe(false);
    expect(component.title()).toBe('');
    expect(component.labels()).toEqual([]);
    expect(component.datasets()).toEqual([]);
    expect(component.showLegend()).toBe(false);
    expect(component.showExpandedSection()).toBe(false);
  });

  it('should have access to PIE_CHART_PALETTE', () => {
    expect(component.PIE_CHART_PALETTE).toBeDefined();
    expect(Array.isArray(component.PIE_CHART_PALETTE)).toBe(true);
  });

  it('should handle input updates', () => {
    fixture.componentRef.setInput('title', 'Initial Title');
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();

    expect(component.title()).toBe('Initial Title');
    expect(component.isLoading()).toBe(false);

    fixture.componentRef.setInput('title', 'Updated Title');
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    expect(component.title()).toBe('Updated Title');
    expect(component.isLoading()).toBe(true);
  });
});
