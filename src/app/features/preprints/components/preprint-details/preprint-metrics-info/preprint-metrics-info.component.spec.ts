import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintMetrics } from '@osf/features/preprints/models';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { PreprintMetricsInfoComponent } from './preprint-metrics-info.component';

describe('PreprintMetricsInfoComponent', () => {
  let component: PreprintMetricsInfoComponent;
  let fixture: ComponentFixture<PreprintMetricsInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PreprintMetricsInfoComponent],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(PreprintMetricsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show loading skeletons when isLoading is true', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.componentRef.setInput('metrics', null);
    fixture.detectChanges();

    const skeletons = fixture.nativeElement.querySelectorAll('p-skeleton');
    expect(skeletons.length).toBe(3);
  });

  it('should show metrics when loading is false and metrics are provided', () => {
    const metrics: PreprintMetrics = { views: 123, downloads: 45 };
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('metrics', metrics);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('123');
    expect(text).toContain('45');
  });

  it('should render neither skeleton nor metrics when loading is false and metrics are null', () => {
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('metrics', null);
    fixture.detectChanges();

    const skeletons = fixture.nativeElement.querySelectorAll('p-skeleton');
    expect(skeletons.length).toBe(0);
    const metricsBlock = fixture.nativeElement.querySelector('.font-bold');
    expect(metricsBlock).toBeNull();
  });

  it('should prioritize loading state over metrics display', () => {
    const metrics: PreprintMetrics = { views: 321, downloads: 54 };
    fixture.componentRef.setInput('isLoading', true);
    fixture.componentRef.setInput('metrics', metrics);
    fixture.detectChanges();

    const skeletons = fixture.nativeElement.querySelectorAll('p-skeleton');
    expect(skeletons.length).toBe(3);
    const text = fixture.nativeElement.textContent;
    expect(text).not.toContain('321');
    expect(text).not.toContain('54');
  });
});
