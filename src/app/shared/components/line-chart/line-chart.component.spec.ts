import { MockComponent, MockModule, MockProvider } from 'ng-mocks';

import { ChartModule } from 'primeng/chart';

import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetInput } from '@osf/shared/models/charts/dataset-input';

import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

import { LineChartComponent } from './line-chart.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('LineChartComponent', () => {
  let component: LineChartComponent;
  let fixture: ComponentFixture<LineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineChartComponent, OSFTestingModule, MockModule(ChartModule), MockComponent(LoadingSpinnerComponent)],
      providers: [MockProvider(PLATFORM_ID, 'browser')],
    }).compileComponents();

    fixture = TestBed.createComponent(LineChartComponent);
    component = fixture.componentInstance;
  });

  it('should have default values', () => {
    expect(component.isLoading()).toBe(false);
    expect(component.title()).toBe('');
    expect(component.labels()).toEqual([]);
    expect(component.datasets()).toEqual([]);
    expect(component.showLegend()).toBe(false);
    expect(component.showGrid()).toBe(false);
  });

  it('should initialize data and options signals', () => {
    const mockGetPropertyValue = jest.fn((prop: string) => {
      const colors: Record<string, string> = {
        '--dark-blue-1': '#1a365d',
        '--grey-2': '#e2e8f0',
        '--pr-blue-1': '#3182ce',
      };
      return colors[prop] || '#000000';
    });

    jest.spyOn(window, 'getComputedStyle').mockReturnValue({
      getPropertyValue: mockGetPropertyValue,
    } as any);

    component.ngOnInit();

    expect(component.data()).toBeDefined();
    expect(component.options()).toBeDefined();
  });

  it('should initialize chart on browser platform', () => {
    const mockGetPropertyValue = jest.fn((prop: string) => {
      const colors: Record<string, string> = {
        '--dark-blue-1': '#1a365d',
        '--grey-2': '#e2e8f0',
        '--pr-blue-1': '#3182ce',
      };
      return colors[prop] || '#000000';
    });

    const mockGetComputedStyle = jest.spyOn(window, 'getComputedStyle').mockReturnValue({
      getPropertyValue: mockGetPropertyValue,
    } as any);

    const markForCheckSpy = jest.spyOn(component['cd'], 'markForCheck');

    component.ngOnInit();

    expect(mockGetComputedStyle).toHaveBeenCalledWith(document.documentElement);
    expect(component.data()).toBeDefined();
    expect(component.options()).toBeDefined();
    expect(markForCheckSpy).toHaveBeenCalled();

    mockGetComputedStyle.mockRestore();
  });

  it('should call setChartData and setChartOptions on browser platform', () => {
    const mockGetPropertyValue = jest.fn((prop: string) => {
      const colors: Record<string, string> = {
        '--dark-blue-1': '#1a365d',
        '--grey-2': '#e2e8f0',
        '--pr-blue-1': '#3182ce',
      };
      return colors[prop] || '#000000';
    });

    jest.spyOn(window, 'getComputedStyle').mockReturnValue({
      getPropertyValue: mockGetPropertyValue,
    } as any);

    const setChartDataSpy = jest.spyOn(component as any, 'setChartData');
    const setChartOptionsSpy = jest.spyOn(component as any, 'setChartOptions');

    component.initChart();

    expect(setChartDataSpy).toHaveBeenCalled();
    expect(setChartOptionsSpy).toHaveBeenCalled();
  });

  describe('Chart Data Configuration', () => {
    const mockLabels = ['Jan', 'Feb', 'Mar'];
    const mockDatasets: DatasetInput[] = [
      { label: 'Dataset 1', data: [10, 20, 30] },
      { label: 'Dataset 2', data: [15, 25, 35], color: '#ff0000' },
    ];

    beforeEach(() => {
      const mockGetPropertyValue = jest.fn((prop: string) => {
        const colors: Record<string, string> = {
          '--dark-blue-1': '#1a365d',
          '--grey-2': '#e2e8f0',
          '--pr-blue-1': '#3182ce',
        };
        return colors[prop] || '#000000';
      });

      jest.spyOn(window, 'getComputedStyle').mockReturnValue({
        getPropertyValue: mockGetPropertyValue,
      } as any);

      fixture.componentRef.setInput('labels', mockLabels);
      fixture.componentRef.setInput('datasets', mockDatasets);
      component.ngOnInit();
    });

    it('should map datasets correctly with default colors from CSS variables', () => {
      const chartData = component.data();
      expect(chartData.datasets).toHaveLength(2);
      expect(chartData.datasets[0].label).toBe('Dataset 1');
      expect(chartData.datasets[0].data).toEqual([10, 20, 30]);
      expect(chartData.datasets[0].backgroundColor).toBe('#3182ce');
      expect(chartData.datasets[0].borderColor).toBe('#3182ce');
    });

    it('should use custom color when provided in dataset', () => {
      const chartData = component.data();
      expect(chartData.datasets[1].backgroundColor).toBe('#ff0000');
      expect(chartData.datasets[1].borderColor).toBe('#ff0000');
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
      expect(dataset).toHaveProperty('borderColor');
    });

    it('should handle multiple datasets correctly', () => {
      const chartData = component.data();
      expect(chartData.datasets).toHaveLength(2);
      expect(chartData.datasets[0].label).toBe('Dataset 1');
      expect(chartData.datasets[1].label).toBe('Dataset 2');
    });
  });

  describe('Input Updates', () => {
    beforeEach(() => {
      const mockGetPropertyValue = jest.fn((prop: string) => {
        const colors: Record<string, string> = {
          '--dark-blue-1': '#1a365d',
          '--grey-2': '#e2e8f0',
          '--pr-blue-1': '#3182ce',
        };
        return colors[prop] || '#000000';
      });

      jest.spyOn(window, 'getComputedStyle').mockReturnValue({
        getPropertyValue: mockGetPropertyValue,
      } as any);
    });

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

    it('should update showLegend input', () => {
      fixture.componentRef.setInput('showLegend', true);
      fixture.detectChanges();
      expect(component.showLegend()).toBe(true);
    });

    it('should update showGrid input', () => {
      fixture.componentRef.setInput('showGrid', true);
      fixture.detectChanges();
      expect(component.showGrid()).toBe(true);
    });
  });
});
