import { MockComponent, MockModule, MockProvider } from 'ng-mocks';

import { ChartModule } from 'primeng/chart';

import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetInput } from '@osf/shared/models/charts/dataset-input.model';

import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

import { PieChartComponent } from './pie-chart.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('PieChartComponent', () => {
  let component: PieChartComponent;
  let fixture: ComponentFixture<PieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieChartComponent, OSFTestingModule, MockModule(ChartModule), MockComponent(LoadingSpinnerComponent)],
      providers: [MockProvider(PLATFORM_ID, 'browser')],
    }).compileComponents();

    fixture = TestBed.createComponent(PieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have default values', () => {
    expect(component.isLoading()).toBe(false);
    expect(component.title()).toBe('');
    expect(component.labels()).toEqual([]);
    expect(component.datasets()).toEqual([]);
    expect(component.showLegend()).toBe(false);
  });

  it('should initialize data and options signals', () => {
    expect(component.data()).toBeDefined();
    expect(component.options()).toBeDefined();
  });

  it('should initialize chart on browser platform', () => {
    const markForCheckSpy = jest.spyOn(component['cd'], 'markForCheck');

    component.ngOnInit();

    expect(component.data().labels).toBeDefined();
    expect(component.data().datasets).toBeDefined();
    expect(component.options()).toBeDefined();
    expect(markForCheckSpy).toHaveBeenCalled();
  });

  describe('Chart Data Configuration', () => {
    const mockLabels = ['Label1', 'Label2', 'Label3'];
    const mockDatasets: DatasetInput[] = [
      { label: 'Dataset 1', data: [10, 20, 30] },
      { label: 'Dataset 2', data: [15, 25, 35] },
    ];

    beforeEach(() => {
      fixture.componentRef.setInput('labels', mockLabels);
      fixture.componentRef.setInput('datasets', mockDatasets);
      component.ngOnInit();
    });

    it('should map datasets correctly with PIE_CHART_PALETTE', () => {
      const chartData = component.data();
      expect(chartData.datasets).toHaveLength(2);
      expect(chartData.datasets[0].label).toBe('Dataset 1');
      expect(chartData.datasets[0].data).toEqual([10, 20, 30]);
      expect(chartData.datasets[0].backgroundColor).toBeDefined();
      expect(chartData.datasets[0].borderWidth).toBe(0);
    });

    it('should include correct labels from input', () => {
      const chartData = component.data();
      expect(chartData.labels).toEqual(mockLabels);
    });

    it('should have correct dataset structure', () => {
      const chartData = component.data();
      const dataset = chartData.datasets[0];
      expect(dataset).toHaveProperty('label');
      expect(dataset).toHaveProperty('data');
      expect(dataset).toHaveProperty('backgroundColor');
      expect(dataset).toHaveProperty('borderWidth');
    });

    it('should handle multiple datasets correctly', () => {
      const chartData = component.data();
      expect(chartData.datasets).toHaveLength(2);
      expect(chartData.datasets[0].label).toBe('Dataset 1');
      expect(chartData.datasets[1].label).toBe('Dataset 2');
    });
  });

  describe('Chart Options Configuration', () => {
    it('should set maintainAspectRatio and responsive', () => {
      component.ngOnInit();
      const options = component.options();
      expect(options.maintainAspectRatio).toBe(true);
      expect(options.responsive).toBe(true);
    });

    it('should set legend display based on showLegend input when false', () => {
      fixture.componentRef.setInput('showLegend', false);
      component.ngOnInit();
      const options = component.options();
      expect(options.plugins?.legend?.display).toBe(false);
    });

    it('should set legend display based on showLegend input when true', () => {
      fixture.componentRef.setInput('showLegend', true);
      component.ngOnInit();
      const options = component.options();
      expect(options.plugins?.legend?.display).toBe(true);
    });

    it('should set legend position to bottom', () => {
      component.ngOnInit();
      const options = component.options();
      expect(options.plugins?.legend?.position).toBe('bottom');
    });
  });

  describe('Input Updates', () => {
    it('should update title input', () => {
      fixture.componentRef.setInput('title', 'Test Title');
      fixture.detectChanges();
      expect(component.title()).toBe('Test Title');
    });

    it('should update isLoading input', () => {
      fixture.componentRef.setInput('isLoading', true);
      fixture.detectChanges();
      expect(component.isLoading()).toBe(true);
    });

    it('should update labels input and reinitialize chart', () => {
      const newLabels = ['New Label 1', 'New Label 2'];
      fixture.componentRef.setInput('labels', newLabels);
      component.ngOnInit();
      expect(component.data().labels).toEqual(newLabels);
    });

    it('should update datasets input and reinitialize chart', () => {
      const newDatasets: DatasetInput[] = [{ label: 'New Dataset', data: [1, 2, 3] }];
      fixture.componentRef.setInput('datasets', newDatasets);
      component.ngOnInit();
      expect(component.data().datasets).toHaveLength(1);
      expect(component.data().datasets[0].label).toBe('New Dataset');
    });

    it('should update showLegend input and reinitialize chart', () => {
      fixture.componentRef.setInput('showLegend', true);
      component.ngOnInit();
      expect(component.options().plugins?.legend?.display).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty datasets array', () => {
      fixture.componentRef.setInput('datasets', []);
      fixture.componentRef.setInput('labels', ['Label1']);
      component.ngOnInit();
      expect(component.data().datasets).toEqual([]);
    });

    it('should handle empty labels array', () => {
      fixture.componentRef.setInput('labels', []);
      fixture.componentRef.setInput('datasets', [{ label: 'Dataset 1', data: [10] }]);
      component.ngOnInit();
      expect(component.data().labels).toEqual([]);
    });

    it('should handle component with no data', () => {
      fixture.componentRef.setInput('labels', []);
      fixture.componentRef.setInput('datasets', []);
      component.ngOnInit();
      expect(component.data().labels).toEqual([]);
      expect(component.data().datasets).toEqual([]);
    });
  });
});
